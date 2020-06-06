<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	export let tasks;
	const originalTasks = [...tasks];
	const flipDurationMs = 300;
	let draggingTimeout;
	function handleDndConsider(e) {
		tasks = e.detail.items;
		clearTimeout(draggingTimeout);
	}
	function handleDndFinalize(e) {
		tasks = e.detail.items;
		clearTimeout(draggingTimeout);
		draggingTimeout = setTimeout( () => {
				if (tasks.length < 2) {
					console.log(tasks);
					document.dispatchEvent(new CustomEvent('done'));
				}
			}, 100);
	}
</script>

<style>
	section {
		padding: 0.3em;
		border: 1px solid black;
		display: flex;
		flex-wrap: wrap;
		min-height: 100px;
	}
	div {
		font-size: 30px;
		display: block;
		padding: 0.9em;
		height: 30px;
		border: 1px solid blue;
		margin: 0;
	}
</style>
<section use:dndzone={{items: tasks, flipDurationMs}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
	{#each tasks as task (task.id)}
		<div animate:flip="{{duration: flipDurationMs}}">
			{task.result}
		</div>
	{/each}
</section>
