
import shuffle from 'lodash/shuffle';
let level = localStorage.getItem('level') || 0;
let levelSolves = 0;
let levelMiss = 0;
export const nextTasks = () => {
	const limit = 5;
	const operators = getOperators();
	const maxNumber = getMaxNumber() || 1;
	console.log(level, operators, maxNumber, getNumberOfOperators());
	return generateTasks({ operators, maxNumber }).slice(0, limit);
};
export const getLevel = () => {
	return { level, levelSolves, levelMiss };
}
let inGameEnd;
document.addEventListener('correct', () => {
	if (inGameEnd) {
		return;
	}
	inGameEnd = true;
	levelSolves++;
	if (levelSolves > 3) {
		level++;
		levelMiss = 0;
		levelSolves = 3; // to get next level there should be 3 prev correct answer
		saveLevel();
	}
});

document.addEventListener('incorrect', () => {
	if (inGameEnd) {
		return;
	}
	console.trace('incorrect');
	levelMiss++;
	levelSolves = 0;
	if (levelMiss > 3) {
		level--;
		if (level < 0) {
			level = 0;
		}
		levelMiss = 3;
		levelSolves = 0;
		saveLevel();
	}
});
document.addEventListener('nextLevel', () => inGameEnd = false);
function getMaxNumber() {
	return Math.floor(level / getNumberOfOperators() / 2);
}

function getNumberOfOperators() {
	const operators = Math.floor(level / 20) + 1;
	return operators > 4 ? 4 : operators;
}

function saveLevel() {
	localStorage.level = level;
}

const operations = {
	'+'(a, b) { return a + b; },
	'-'(a, b) { return a - b; },
	'*'(a, b) { return a * b; },
	'/'(a, b) { return b ? a / b : null; }
};
function getOperators() {
	console.log(Object.keys(operations))
	return Object.keys(operations).slice(0, getNumberOfOperators());
}

function generateTasks({ operators = ['+'], maxNumber = 10, onlyPositive = true, onlyInteger = true }) {
	const tasks = [];
	let id = 0;
	for (const operator of operators) {
		for (let i = 0; i <= maxNumber; i++) {
			for (let n = 0; n <= maxNumber; n++) {
				if (operations[operator]) {
					const result = operations[operator](i, n);
					const task = `${i} ${operator} ${n}`;
					if (result !== null &&
						(onlyPositive ? result >= 0 : true) &&
						(onlyInteger ? result === Math.ceil(result) : true)) {
						tasks.push({ task, result, answered: {}, id });
						id++;
					}
				}
			}
		}
	}
	return shuffle(tasks);
}
