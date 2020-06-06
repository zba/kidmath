<script>
	import { each } from 'svelte/internal';
	import TaskAnswer from './TaskAnswer';
	export let tasks;
	document.addEventListener('done', done);
	function done() {
		document.removeEventListener('done', done);
		console.log('done', tasks.find(task=>task.answered != task.result))
		if(tasks.find(task=>task.answered != task.result)) {
			setTimeout(() => 	document.dispatchEvent(new CustomEvent('incorrect')));
			return;
		}
		setTimeout(() => 	document.dispatchEvent(new CustomEvent('correct')));
}
</script>
<style>
.task {
	border: 1px solid red;
	display: flex;
	font-size: 40px;
}
.question {
	display: flex;
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
