<script>
  import IssueDialog from '$lib/components/IssueDialog.svelte';

  let dialog;
  let issues = $state([]);

  let lanes = [
    'Backlog',
    'Start / Do',
    'Doing / Progress',
    'Done / Implement'
  ];

  function addIssue(issue) {
    issues.push(issue);
  }
</script>

<svelte:head>
  <title>Kanban Board</title>
</svelte:head>

<main class="min-h-screen bg-white px-8 py-10 text-zinc-900">
  <div class="mx-auto max-w-7xl">

    <header class="mb-10 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Kanban Board</h1>
        <p class="mt-1 text-sm text-zinc-500">Manage your tasks</p>
      </div>

      <button
        onclick={() => dialog.open()}
        class="bg-zinc-900 px-4 py-2 text-sm text-white"
      >
        + New Issue
      </button>
    </header>

    <div class="grid grid-cols-4 gap-4">
      {#each lanes as lane (lane)}
        <section class="min-h-96 border border-zinc-200">

          <div class="flex items-center justify-between border-b border-zinc-200 p-4">
            <h2 class="text-sm font-semibold">{lane}</h2>
          </div>

          <div class="space-y-3 p-4">
            {#each issues as issue (issue.id)}
              {#if issue.lane === lane}
                <div class="border border-zinc-200 p-3">
                  <h3 class="font-medium">{issue.title}</h3>
                  <p class="mt-2 text-sm text-zinc-500">
                    {issue.description}
                  </p>
                  <p class="mt-3 text-xs text-zinc-500">
                    {issue.priority} | {issue.storyPoints} SP
                  </p>
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
