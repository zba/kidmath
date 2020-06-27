<script>
import {nextTasks} from './data/progress';
import { flip } from 'svelte/animate';
import { dndzone } from 'svelte-dnd-action';
import Tasks from './components/Tasks';
import Answers from './components/Answers';
import shuffle from 'lodash/shuffle';
import {getLevel} from './data/progress';
import Speech from 'speak-tts';
const soundEnabled = Boolean(localStorage.sound);
const speech = new Speech();
if (soundEnabled) {
	speech.init({
		lang: 'ru-RU'
	}).then((data)=>{
		console.log(data);
	}).catch(e=>console.error(e));
}
window._speech = speech
// import html2canvas from 'html2canvas';
// import canvasToImage from 'canvas-to-image';
// import blobToBase64 from 'base64-blob';
// import 'share-api-polyfill';

let tasks;
let answers;
let level;
let next;
let timer;
let inGame = true;
let done;
let finishDrag;
let finishDragResolve = () => {};
document.addEventListener('correct', solved);
document.addEventListener('incorrect', solved);
document.addEventListener('done', ()=>clearTimeout(timerTimeout));
document.addEventListener('showNext', ()=>{done = true})
document.addEventListener('dragStarted', dragStarted);
document.addEventListener('dragFinalized', dragEnded);


function dragStarted () {
	console.debug('dragStarted')
	finishDrag = finishDrag || new Promise(resolve => finishDragResolve = resolve);
};


function dragEnded () {
	console.debug('dragEnd');
	finishDrag = null;
	setTimeout(() =>  {
		finishDragResolve();
	},100);
};

nextLevel();
function solved() {
	level = getLevel();
	next = true;
}
let timerTimeout;
let lowTime;
async function tick(time) {
	if (!timer) {
		return setTimeout(()=>tick(time), 100);
	}
	if (time < 0) {
		await finishDrag;
		document.dispatchEvent(new CustomEvent('done'));
		return;
	}
	lowTime = false;
	if (time < 5) {
		lowTime = true;
	}
	timer.style.width = time * 10;
	timerTimeout = setTimeout(()=>{tick(time - 0.1)}, 100);
}

function nextLevel() {
	tick(30);
	document.dispatchEvent(new CustomEvent('nextLevel'));
	tasks = nextTasks();
	level = getLevel();
	next = false;
	done = false;
	tasks = nextTasks();
	answers = shuffle([...tasks]);
	tasks.shift();
	inGame = false;
	setTimeout(()=>inGame=true, 0);
}
async function screenShot() {
	const canvas = await html2canvas(body);
	const image = canvasToImage(canvas, {name: 'solution', type:  'jpg', quality: 0.8 });
	console.log(blobToBase64(image));
	navigator.share({
		title: 'Мое решение',
		text: '',
		utl: blobToBase64(image)
	})
}

</script>
<style>
.App {
	display: flex;
	flex-direction: column;
}
.timer {
	background: green;
	height: 50px;
}
.lowTime {
	background: red;
}
button {
	font-size: 20px;
}
</style>
<div class="App">
	<div>Уровень: {level.level}</div>
	<div>Ошибок: {level.levelMiss}</div>
	<div>Правильных: {level.levelSolves}</div>
	{#if inGame}
		<Tasks speech={speech} tasks={tasks}/>
	{/if}
	{#if !next}
		<Answers class="answers" tasks={answers}/>
	{/if}
	{#if !next}
		<div bind:this={timer} class:lowTime={lowTime} class="timer"></div>
	{/if}

	{#if done}
		<button class:hidden={!next} on:click={nextLevel}>Дальше</button>
	{/if}
</div>

<!--button onclick={()=>screenShot()}>Отправить</button-->
