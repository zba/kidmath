<script>
	import { each } from 'svelte/internal';
	import TaskAnswer from './TaskAnswer';
	export let tasks;
	document.addEventListener('done', () => {
		if(tasks.find(task=>task.answered != task.result)) {
			document.dispatchEvent(new CustomEvent('incorrect'));
			return;
		}
		setTimeout(() => 	document.dispatchEvent(new CustomEvent('correct')));
	});

</script>
<style>
section {
	display: flex;
	flex-wrap: wrap;
}
.task {
	border: 1px solid red;
	display: flex;
	font-size: 40px;
}
.question {
	padding: 10px;
}
</style>

<section>
{#each tasks as task}
<div class="task">
	<div class="question">{task.task} = </div>
	<TaskAnswer task={task}/>
</div>
{/each}

</section>
