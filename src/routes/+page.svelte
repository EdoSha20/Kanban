
<script>
  import { onMount } from 'svelte';
  import { format, isBefore, startOfDay, parseISO } from 'date-fns';
  import IssueDialog from '#lib/components/IssueDialog.svelte';

  let dialog = $state();
  let issues = $state([]);

  let lanes = [
    'Backlog',
    'Start / Do',
    'Doing / Progress',
    'Done / Implement'
  ];

  onMount(() => {
    let saved = localStorage.getItem('issues');

    if (saved) {
      issues = JSON.parse(saved);
    }
  });

  function saveIssues() {
    localStorage.setItem('issues', JSON.stringify(issues));
  }

  function addIssue(issue) {
    issues.push(issue);
    saveIssues();
  }

  function getPoints(lane) {
    let total = 0;

    for (let issue of issues) {
      if (issue.lane === lane) {
        total += issue.storyPoints;
      }
    }

    return total;
  }

  function dragStart(event, id) {
    event.dataTransfer.setData('text/plain', String(id));
  }

  function dragOver(event) {
    event.preventDefault();
  }

  async function showNotification(title) {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;

        await registration.showNotification('Issue completed', {
          body: title + ' is now done!',
          icon: '/icon-192.png'
        });
      } catch (error) {
        console.error('Notification failed:', error);
      }
    }
  }

  function drop(event, lane) {
    event.preventDefault();

    let id = event.dataTransfer.getData('text/plain');

    for (let issue of issues) {
      if (String(issue.id) === id) {
        let oldLane = issue.lane;

        issue.lane = lane;

        if (lane === 'Done / Implement' && oldLane !== lane) {
          showNotification(issue.title);
        }

        break;
      }
    }

    saveIssues();
  }

  function exportICS(issue) {
    if (!issue.dueDate) {
      return;
    }

    let date = issue.dueDate.replaceAll('-', '');

    let nextDay = new Date(issue.dueDate + 'T12:00:00');
    nextDay.setDate(nextDay.getDate() + 1);

    let endDate = format(nextDay, 'yyyyMMdd');

    function escapeText(text) {
      return String(text || '')
        .replaceAll('\\', '\\\\')
        .replaceAll('\n', '\\n')
        .replaceAll(',', '\\,')
        .replaceAll(';', '\\;');
    }

    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kanban Board//EN',
      'BEGIN:VEVENT',
      'UID:' + issue.id + '@kanban-board',
      'DTSTAMP:' + format(new Date(), "yyyyMMdd'T'HHmmss'Z'"),
      'DTSTART;VALUE=DATE:' + date,
      'DTEND;VALUE=DATE:' + endDate,
      'SUMMARY:' + escapeText(issue.title),
      'DESCRIPTION:' + escapeText(issue.description),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    let blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    let url = URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.href = url;
    link.download = 'issue-' + issue.id + '.ics';
    link.click();

    URL.revokeObjectURL(url);
  }

  async function shareIssue(issue) {
    if (!navigator.share) {
      alert('Sharing is not supported in this browser.');
      return;
    }

    try {
      await navigator.share({
        title: issue.title,
        text:
          issue.title + '\n' +
          issue.description + '\n' +
          'Due: ' + issue.dueDate + '\n' +
          'Priority: ' + issue.priority + '\n' +
          'Story Points: ' + issue.storyPoints
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        alert('Sharing failed.');
      }
    }
  }

  function exportCSV() {
    let rows = [
      ['Title', 'Description', 'Created', 'Due Date', 'Story Points', 'Priority', 'Lane']
    ];

    for (let issue of issues) {
      rows.push([
        issue.title,
        issue.description,
        issue.creationDate,
        issue.dueDate,
        issue.storyPoints,
        issue.priority,
        issue.lane
      ]);
    }

    let csv = rows
      .map((row) =>
        row.map((value) => '"' + String(value ?? '').replaceAll('"', '""') + '"').join(',')
      )
      .join('\r\n');

    let blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8'
    });

    let url = URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.href = url;
    link.download = 'kanban-issues.csv';
    link.click();

    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>Kanban Board</title>
</svelte:head>

<main class="min-h-screen bg-white px-8 py-10 text-black">
  <div class="mx-auto max-w-7xl">
    <header class="mb-10 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Kanban Board</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage your tasks
        </p>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          onclick={exportCSV}
          class="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
        >
          Export CSV
        </button>

        <button
          type="button"
          onclick={() => dialog.open()}
          class="bg-black px-4 py-2 text-sm text-white"
        >
          + New Issue
        </button>
      </div>
    </header>

    <div class="grid grid-cols-4 gap-4">
      {#each lanes as lane (lane)}
        <section
          class="min-h-96 border border-gray-200"
          ondragover={dragOver}
          ondrop={(event) => drop(event, lane)}
          aria-label={lane}
        >
          <div class="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 class="text-sm font-semibold">{lane}</h2>
            <span class="text-xs text-gray-500">
              {getPoints(lane)} SP
            </span>
          </div>

          <div class="space-y-3 p-4">
            {#each issues as issue (issue.id)}
              {#if issue.lane === lane}
                <div
                  draggable="true"
                  ondragstart={(event) => dragStart(event, issue.id)}
                  role="listitem"
                  class="cursor-grab border border-gray-200 bg-white p-3"
                >
                  <h3 class="font-medium">{issue.title}</h3>

                  {#if issue.dueDate}
                    <p class="mt-2 text-xs text-gray-500">
                      Due: {format(parseISO(issue.dueDate), 'dd.MM.yyyy')}
                    </p>

                    {#if isBefore(parseISO(issue.dueDate), startOfDay(new Date()))}
                      <p class="mt-1 text-xs font-semibold text-red-600">
                        Overdue!
                      </p>
                    {/if}
                  {/if}

                  <p class="mt-2 text-sm text-gray-500">
                    {issue.description}
                  </p>

                  <div class="mt-4 flex justify-between text-xs text-gray-500">
                    <span>{issue.priority}</span>
                    <span>{issue.storyPoints} SP</span>
                  </div>

                  <div class="mt-3 flex gap-2">
                    <button
                      type="button"
                      onclick={() => exportICS(issue)}
                      class="border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100"
                    >
                      Export ICS
                    </button>

                    <button
                      type="button"
                      onclick={() => shareIssue(issue)}
                      class="border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100"
                    >
                      Share
                    </button>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </section>
      {/each}
    </div>
  </div>
</main>

<IssueDialog bind:this={dialog} {addIssue} />
