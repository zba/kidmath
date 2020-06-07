/* eslint-disable indent */
/* eslint-env browser */

import shuffle from 'lodash/shuffle';
let level = localStorage.getItem('level') || 0;
let levelSolves = 0;
let levelMiss = 0;
export const nextTasks = () => {
	const limit = 5;
	const operators = getOperators();
	console.log(level, operators, getNumberOfOperators());
	return generateTasks({ operators }).slice(0, limit + 1);
};
export const getLevel = () => {
	return { level, levelSolves, levelMiss };
};
let inGameEnd;
let inRowLevelUp = 0;
let inRowLevelDown = 0;
document.addEventListener('correct', () => {
	if (inGameEnd) {
		return;
	}
	inGameEnd = true;
	levelSolves++;
	if (levelSolves > 3) {
		inRowLevelUp++;
		if (inRowLevelUp > 2) {
			level = Math.round(level * 1.2);
			inRowLevelUp = 0;
		} else {
			level++;
		}
		inRowLevelDown = 0;
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
		inRowLevelDown++;
		if (inRowLevelDown > 3) {
			level = Math.floor(level / 2);
		} else {
			level--;
		}
		if (level < 0) {
			level = 0;
		}
		levelMiss = 3;
		levelSolves = 0;
		saveLevel();
	}
	inRowLevelUp = 0;
});
// eslint-disable-next-line no-return-assign
document.addEventListener('nextLevel', () => inGameEnd = false);
function getMaxNumber(operatorNumber) {
	return Math.floor(level / (operatorNumber + 1)) + 2;
}

function getNumberOfOperators() {
	const operators = Math.floor(level / 30) + 1;
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
	console.log(Object.keys(operations));
	return Object.keys(operations).slice(0, getNumberOfOperators());
}

function generateTasks({ operators = ['+'], maxNumber = 10, onlyPositive = true, onlyInteger = true }) {
	const tasks = [];
	let id = 0;
	for (let operatorNumber = 0; operatorNumber < operators.length; operatorNumber++) {
		const operator = operators[operatorNumber];
		for (let i = 0; i <= getMaxNumber(operatorNumber); i++) {
			for (let n = 0; n <= getMaxNumber(operatorNumber); n++) {
				if (operations[operator]) {
					const result = operations[operator](i, n);
					const task = `${i} ${operator} ${n}`;
					if (result !== null &&
						result < level + 10 &&
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
