const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// script.test.js


const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom;
let document;

describe('Tic Tac Toe Game', () => {
	beforeEach(() => {
		dom = new JSDOM(html, { runScripts: 'dangerously' });
		document = dom.window.document;
		global.document = document;
		global.window = dom.window;
		require('./script');
	});

	test('hello world!', () => {
		expect(1 + 1).toBe(2);
	});

	test('should initialize the board correctly', () => {
		const cells = document.querySelectorAll('.cell');
		expect(cells.length).toBe(9);
		cells.forEach(cell => {
			expect(cell.textContent).toBe('');
		});
		const statusText = document.getElementById('status');
		expect(statusText.textContent).toBe("Player X's turn");
	});

	test('should handle cell click and update the board state', () => {
		const cell = document.querySelector('[data-index="0"]');
		cell.click();
		expect(cell.textContent).toBe('X');
		expect(cell.style.backgroundColor).toBe('green');
		const statusText = document.getElementById('status');
		expect(statusText.textContent).toBe("Player O's turn");
	});

	test('should detect a win', () => {
		const cells = document.querySelectorAll('.cell');
		cells[0].click(); // X
		cells[1].click(); // O
		cells[3].click(); // X
		cells[4].click(); // O
		cells[6].click(); // X - win
		const statusText = document.getElementById('status');
		expect(statusText.textContent).toBe('Congratulations. You win!');
		expect(statusText.style.color).toBe('green');
	});

	test('should detect a tie', () => {
		const cells = document.querySelectorAll('.cell');
		cells[0].click(); // X
		cells[1].click(); // O
		cells[2].click(); // X
		cells[4].click(); // O
		cells[3].click(); // X
		cells[5].click(); // O
		cells[7].click(); // X
		cells[6].click(); // O
		cells[8].click(); // X - tie
		const statusText = document.getElementById('status');
		expect(statusText.textContent).toBe("It's a tie!");
		expect(statusText.style.color).toBe('blue');
	});

	test('should reset the game', () => {
		const resetButton = document.getElementById('reset-button');
		resetButton.click();
		const cells = document.querySelectorAll('.cell');
		cells.forEach(cell => {
			expect(cell.textContent).toBe('');
		});
		const statusText = document.getElementById('status');
		expect(statusText.textContent).toBe("Player X's turn");
	});
});