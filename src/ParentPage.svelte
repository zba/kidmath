<script>
let level = Math.floor(localStorage.level);
let hasSound = Boolean(localStorage.sound);
let code = localStorage.code;
let codeEntered='';
let codePassed;
function setLevel(value) {
	localStorage.level=value
}
function checkCode() {
	if (code === codeEntered) {
		codePassed = 1;
	}
}
function setCode() {
	localStorage.code = codeEntered;
	location.reload();
}
</script>
<style>
.panel {
	padding: 20px;
	font-size: 20px;
	display: flex;
	flex-direction: column;
}
.space {
	height: 30px;
}
button {
	font-size: 20px;
}
</style>
<div class="panel">
{#if codePassed}
	<label>Уровень <input type="number" on:change={(e)=>setLevel(e.target.value)} value={level}/></label>
	<label>Звук <input type="checkbox" checked={hasSound} on:change={(e)=>localStorage.sound = e.target.checked ? 0 : ""}  /></label>
	<div class="space"></div>
{/if}
{#if !codePassed}
{#if code}
	<label>код <input type="password" bind:value={codeEntered}/></label>
	<div class="space"></div>
	<button on:click={checkCode}>Проверить</button>
{/if}
{/if}
<button on:click={()=>location.reload()}>Назад</button>
</div>
{#if !code || codePassed}
	<label>Новый код <input type="password" bind:value={codeEntered}/></label>
	<div class="space"></div>
	<button on:click={setCode}>Установить</button>

{/if}

