<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	export let task;
	let items=[];
	let done;
	let dropFromOthersDisabled;
	let correct;
	document.addEventListener('done', () => done=true)
	const flipDurationMs = 300;
	function handleDndConsider(e) {
			items = e.detail.items;
			// dropFromOthersDisabled = Boolean(items.length);
	}
	function handleDndFinalize(e) {
			items = e.detail.items;
			task.answered = (items[0] || {}).result;
			dropFromOthersDisabled = Boolean(items.length);
			if (items[0]) {
				correct = task.result === task.answered;
			}
	}
	document.addEventListener('nextLevel', items = []);
</script>
<style>
.answer {
	padding: 10px;
	border: 1px solid green;
	min-width: 30px;
	min-height: 30px;
}
.answerResult {
	padding: 10px;
	border: 1px solid green;
}
	.incorrect {
		background: red;
	}
</style>

<div class:incorrect={done && !correct}  class="answer" use:dndzone={{items, flipDurationMs, dropFromOthersDisabled}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
	{#each items as answer (answer.id)}
		<div animate:flip="{{duration: flipDurationMs}}" class="answerResult">{answer.result}</div>
	{/each}
</div>
