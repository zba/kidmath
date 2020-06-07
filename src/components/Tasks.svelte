<script>
	import { each } from 'svelte/internal';
	import TaskAnswer from './TaskAnswer';
	export let tasks;
	export let speech;
	const soundEnabled = Boolean(localStorage.sound);
	document.addEventListener('done', done);
	async function done() {
		document.removeEventListener('done', done);
		console.log('done', tasks.find(task=>task.answered != task.result))
		if(tasks.find(task => task.answered != task.result)) {
			setTimeout(() => 	document.dispatchEvent(new CustomEvent('incorrect')));
		} else {
			setTimeout(() => 	document.dispatchEvent(new CustomEvent('correct')));
		}
		if (soundEnabled) {
			await speak();
		}
		document.dispatchEvent(new CustomEvent('showNext'));
}
async function speak(i = 0) {
	console.log('speak')
	if (i >= tasks.length) {
		return;
	}
	const task=tasks[i];
	console.log(tasks, i);
	tasks[i].speaking = true;
	const correct = task.result === task.answered;
	speech.setPitch(correct ? 1 : 0.8);
	speech.setRate(correct ? 2 : 0.8);
	await speech.speak({
		text: `${task.task} = ${task.result}`,
			listeners: {onend: ()=>console.log('end')}
	});
	tasks[i].speaking = false;
	await speak(i + 1);
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
.speaking {
	background: lightsteelblue;
}
</style>

<section>
{#each tasks as task}
<div class="task" class:speaking = {task.speaking}>
	<div class="question">{task.task} = </div>
	<TaskAnswer task={task}/>
</div>
{/each}

</section>
