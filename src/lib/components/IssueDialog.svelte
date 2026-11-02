
<script>
  let { addIssue } = $props();

  let dialog = $state();
  let title = $state('');
  let description = $state('');
  let dueDate = $state('');
  let points = $state(1);
  let priority = $state('Low');

  export function open() {
    dialog.showModal();
  }

  function save() {
    addIssue({
      id: Date.now(),
      title: title,
      description: description,
      creationDate: new Date().toISOString(),
      dueDate: dueDate,
      storyPoints: Number(points),
      priority: priority,
      lane: 'Backlog'
    });

    title = '';
    description = '';
    dueDate = '';
    points = 1;
    priority = 'Low';

    dialog.close();
  }
</script>

<dialog
  bind:this={dialog}
  class="m-auto w-full max-w-md border border-gray-300 bg-white p-6 text-black shadow-lg backdrop:bg-black/30"
>
  <h2 class="mb-5 text-xl font-semibold">New Issue</h2>

  <form
    onsubmit={(event) => {
      event.preventDefault();
      save();
    }}
  >
    <label for="title" class="block text-sm">Title</label>
    <input
      id="title"
      bind:value={title}
      required
      class="mb-4 w-full border border-gray-300 p-2"
    />

    <label for="description" class="block text-sm">Description</label>
    <textarea
      id="description"
      bind:value={description}
      class="mb-4 w-full border border-gray-300 p-2"
    ></textarea>

    <label for="dueDate" class="block text-sm">Due Date</label>
    <input
      id="dueDate"
      type="date"
      bind:value={dueDate}
      required
      class="mb-4 w-full border border-gray-300 p-2"
    />

    <label for="points" class="block text-sm">Story Points</label>
    <select
      id="points"
      bind:value={points}
      class="mb-4 w-full border border-gray-300 bg-white p-2"
    >
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={5}>5</option>
      <option value={8}>8</option>
      <option value={13}>13</option>
    </select>

    <label for="priority" class="block text-sm">Priority</label>
    <select
      id="priority"
      bind:value={priority}
      class="mb-5 w-full border border-gray-300 bg-white p-2"
    >
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
    </select>

    <div class="flex justify-end gap-3">
      <button
        type="button"
        onclick={() => dialog.close()}
        class="border border-gray-300 px-4 py-2"
      >
        Cancel
      </button>

      <button
        type="submit"
        class="bg-black px-4 py-2 text-white"
      >
        Save
      </button>
    </div>
  </form>
</dialog>

