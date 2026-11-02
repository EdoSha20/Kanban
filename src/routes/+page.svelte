
<script>
  let lanes = [
    'Backlog',
    'Start / Do',
    'Doing / Progress',
    'Done / Implement'
  ];
</script>

<svelte:head>
  <title>Kanban Board</title>
</svelte:head>

<main class="min-h-screen bg-white px-8 py-10 text-zinc-900">
  <div class="mx-auto max-w-7xl">

    <header class="mb-10 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Kanban Board</h1>
        <p class="mt-1 text-sm text-zinc-500">
          Manage your tasks
        </p>
      </div>

      <button
        type="button"
        class="bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700"
      >
        + New Issue
      </button>
    </header>

    <div class="grid grid-cols-4 gap-4">
      {#each lanes as lane}
        <section class="min-h-96 border border-zinc-200">

          <div class="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
            <h2 class="text-sm font-semibold">{lane}</h2>
            <span class="text-xs text-zinc-500">0 SP</span>
          </div>

          <div class="p-4 text-center">
            <p class="mt-10 text-sm text-zinc-400">
              No issues yet
            </p>
          </div>

        </section>
      {/each}
    </div>

  </div>
</main>
