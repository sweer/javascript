"use strict";

// ======================================================
// 		G 	A 	M 	E
// ======================================================

function Game() { 
	const WIDTH = 7;
	const HEIGHT = 6;
	const EMPTY = '.';
	const X = 'X';
	const O = 'O';
	const WON = 1;
	const DRAW = 2; 
	const RUNNING = 3;
	var field = new Array(WIDTH);
	var currentPlayer = X;
	var gameState = RUNNING;
	var view = null;

	this.width = function() { return WIDTH; };
	this.height = function() { return HEIGHT; };
	this.isX = function(value) { return value === X; };
	this.isO = function(value) { return value === O; };
	this.isEmpty = function(value) { return value === EMPTY; };
	this.getCell = function(x, y) { return field[x][y]; };
	this.setView = function(value) { view = value; };
	this.removeView = function() { view = null; };


	var emptyColumn = []; 
	for (var i=0; i<HEIGHT; i++) { 
		emptyColumn.push(EMPTY);
	}

	for (var i=0; i<WIDTH; i++) { 
		field[i] = emptyColumn.slice();
	}

	this.viewAnnounce = function(message) { 
		if (view != null) {
			view.announce(message);
		}
	}

	this.viewSetCell = function(move, y, currentPlayer) { 
		if (view != null) { 
			view.setCell(move, y, currentPlayer)
		}
	}

	this.stateText = function() { 
		if (gameState === RUNNING) { 
			return currentPlayer + " move";
		} else if (gameState === WON) { 
			return currentPlayer + " won!";
		} else { 
			return "It's a draw!";
		}
	}

	this.makeMove = function(move) {

		if (gameState != RUNNING) { 
			this.viewAnnounce("Game finished");
			return;
		}

		if (! (field[move][0] === EMPTY)) { 
			this.viewAnnounce("Can't drop in a full column");
			return;			
		}

		gameState = this.storeMove(move);
		
		if (gameState === RUNNING) {
			currentPlayer = currentPlayer === X ? O : X;
		};

		this.viewAnnounce(this.stateText());
	};

	this.storeMove = function(move) { 
		var y = 0; 
		while (y < HEIGHT && field[move][y] === EMPTY) { 
			y++;
		}
		y--; 
		field[move][y] = currentPlayer; 
		this.viewSetCell(move, y, currentPlayer);
		return this.moveResult(move, y);
	};

	this.moveResult = function(x, y) { 
		if (y === 0 && this.isDraw()) { 
			return DRAW; 
		}

		if (this.horizontalWin(x, y) 
			|| this.verticalWin(x, y) 
			// || this.mainDiagonalWin(x, y) || this.secondDiagonalWin(x, y)
			) { 
			return WON;
		}

		return RUNNING;
	};

	this.horizontalWin = function(x, y) { 
		var x1 = (x - 3) < 0 ? 0 : x - 3;
		var x2 = (x + 3) >= WIDTH ? WIDTH - 1 : x + 3;
		var count = 0;
		for (var i = x1; i <= x2; i++) { 
			if (field[i][y] === currentPlayer) { 
				count++;
			} else { 
				count = 0;
			}
			if (count == 4) { 
				return true;
			}
		}
		return false;
	}

	this.verticalWin = function(x, y) { 
		var y1 = (y - 3) < 0 ? 0 : y - 3;
		var y2 = (y + 3) >= WIDTH ? WIDTH - 1 : y + 3;
		var count = 0;
		for (var i = y1; i <= y2; i++) { 
			if (field[x][i] === currentPlayer) { 
				count++;
			} else { 
				count = 0;
			}
			if (count == 4) { 
				return true;
			}
		}
		return false;
	}



	this.isDraw = function() { 
		for (var x=0; x<WIDTH; x++) { 
			if (field[x][0] === EMPTY) { 
				return false;
			} 
		}
		return true;
	}

};

// ======================================================
// 		V 	I 	E 	W
// ======================================================

function View() { 
	this.field = null;
	this.game = null;
	this.controller = null;
	this.EMPTY = "_";
	this.X = "X";
	this.O = "O";
};

View.prototype = { 

	announce: function (message) {
		document.getElementById("announcement").innerHTML = message;
	},

	setCell: function(x, y, value) { 
		var data = this.EMPTY;
		if (this.game.isX(value)) {
			data = this.X; 
		} else if (this.game.isO(value)) {
			data = this.O; 
		};

		this.field.rows[y+1].cells[x].firstChild.data = data;
	},

	initialize: function() { 
		this.field = document.getElementById("field");

		var row = this.field.insertRow(0);
		for (var i=0; i<this.game.width(); i++) {
			this.addButtonCell(row, i);  
		}

	 	for (var y=0; y<this.game.height(); y++) {
			row = field.insertRow(y+1);
			for (var x=0; x<this.game.width(); x++) {
				var cell = row.insertCell(x);
				cell.innerHTML = this.EMPTY;
			}
	 	}
	},

	addButtonCell: function(row, n) { 
		var cell = row.insertCell(n);
		var button = document.createElement("button");
		button.setAttribute("class", "drop");
		button.setAttribute("type", "button");
		button.setAttribute("id", "button" + n);
		var cntr = this.controller;
		button.addEventListener("click", 
			function(event) { cntr.buttonClick(event) }, 
			false);
		cell.appendChild(button);
	},

	setController: function(controller) { this.controller = controller; },

	setGame: function(game) { this.game = game; }

};

// ======================================================
// 		C 	O 	N 	T 	R 	O 	L 	L 	E 	R
// ======================================================


function Controller() { 

};

Controller.prototype = { 

	buttonClick: function(event) { 
		var target = event.currentTarget;
		var move = target.id.substr(-1, 1);
		this.game.makeMove(move);
	},

	setGame: function(game) { this.game = game; },
	getGame: function() { return this.game; }

};

function onload() { 
	var game = new Game();
	var view = new View();
	var controller = new Controller(); 
	game.setView(view);
	view.setGame(game);
	view.setController(controller);
	controller.setGame(game);
	view.initialize(); 
};

if (typeof(module) != 'undefined') { 
	module.exports = Game;
};