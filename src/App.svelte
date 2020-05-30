<script>
import {nextTasks} from './data/progress';
import { flip } from 'svelte/animate';
import { dndzone } from 'svelte-dnd-action';
import Tasks from './components/Tasks';
import Answers from './components/Answers';
import shuffle from 'lodash/shuffle';
import {getLevel} from './data/progress';
let tasks = nextTasks();
let answers = shuffle([...tasks]);
let level = getLevel();
let next;
let inGame = true;
document.addEventListener('correct', solved);
document.addEventListener('incorrect', solved);
function solved() {
	level = getLevel();
	next = true;
}
function nextLevel() {
	document.dispatchEvent(new CustomEvent('nextLevel'));
	tasks = nextTasks();
	level = getLevel();
	next = false;
	tasks = nextTasks();
	answers = shuffle([...tasks]);
	inGame = false;
	setTimeout(()=>inGame=true, 0);
}
</script>
<div>Уровень: {level.level}</div>
<div>Ошибок: {level.levelMiss}</div>
<div>Правильных: {level.levelSolves}</div>
{#if inGame}
<Tasks tasks={tasks}/>
{#if !next}
<Answers tasks={answers}/>
{/if}
{/if}
{#if next}
<button class:hidden={!next} on:click={nextLevel}>Дальше</button>
{/if}
