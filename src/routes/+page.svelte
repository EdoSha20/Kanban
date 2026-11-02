
<script>
  import { onMount } from 'svelte';
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

  function drop(event, lane) {
    event.preventDefault();

    let id = event.dataTransfer.getData('text/plain');

    for (let issue of issues) {
      if (String(issue.id) === id) {
        issue.lane = lane;
      }
    }

    saveIssues();
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

      <button
        type="button"
        onclick={() => dialog.open()}
        class="bg-black px-4 py-2 text-sm text-white"
      >
        + New Issue
      </button>
    </header>

    <div class="grid grid-cols-4 gap-4">
      {#each lanes as lane (lane)}
        <section
          class="min-h-96 border border-gray-200"
          ondragover={dragOver}
          ondrop={(event) => drop(event, lane)}
          role="region"
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

                  <p class="mt-2 text-sm text-gray-500">
                    {issue.description}
                  </p>

                  <div class="mt-4 flex justify-between text-xs text-gray-500">
                    <span>{issue.priority}</span>
                    <span>{issue.storyPoints} SP</span>
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
