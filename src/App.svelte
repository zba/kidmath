<script>
import Game from './Game';
import ParentPage from './ParentPage';
let started;
let parentPageShown;
function start() {
	console.log('!!!!');
	started = true;
}
function parentPage() {
	parentPageShown = true;
}
</script>
<style>
.startButton {
	width: 50%;
	height: 50%;
	font-size: 30px;
	display: flex;
	place-content: center;
	place-items: center;
	background: lightgreen;
	cursor: pointer;
}
.parentButton {
	background: lightsalmon;
}
</style>
<div>
	{#if started}
		<Game/>
	{/if}
	{#if !started}
	{#if !parentPageShown}
	<div class="startButton" on:click={start}>Начать</div>
	<div class="startButton parentButton" on:click={parentPage}>Родителям</div>
	{/if}
	{/if}
</div>
{#if parentPageShown}
	<ParentPage/>
{/if}
