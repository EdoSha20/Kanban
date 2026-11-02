
<script>
  let { addIssue } = $props();

  let dialog;
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
      storyPoints: points,
      priority: priority,
      lane: 'Backlog'
    });

    dialog.close();
  }
</script>

<dialog bind:this={dialog} class="m-auto w-96 bg-white p-6 shadow-lg">
  <h2 class="mb-4 text-xl font-bold">New Issue</h2>

  <form onsubmit={(e) => { e.preventDefault(); save(); }}>
    <input
      placeholder="Title"
      bind:value={title}
      required
      class="mb-3 w-full border p-2"
    />

    <textarea
      placeholder="Description"
      bind:value={description}
      class="mb-3 w-full border p-2"
    ></textarea>

    <label for="due">Due Date</label>
    <input
      id="due"
      type="date"
      bind:value={dueDate}
      required
      class="mb-3 w-full border p-2"
    />

    <label for="points">Story Points</label>
    <input
      id="points"
      type="number"
      min="1"
      bind:value={points}
      class="mb-3 w-full border p-2"
    />

    <label for="priority">Priority</label>
    <select
      id="priority"
      bind:value={priority}
      class="mb-4 w-full border p-2"
    >
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
    </select>

    <div class="flex justify-end gap-2">
      <button type="button" onclick={() => dialog.close()} class="border px-3 py-2">
        Cancel
      </button>
      <button type="submit" class="bg-black px-3 py-2 text-white">
        Save
      </button>
    </div>
  </form>
</dialog>
