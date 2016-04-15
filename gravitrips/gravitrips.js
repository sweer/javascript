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
		return this.has4InRow(x, 3, 0, WIDTH-1, function(j) { 
			return field[j][y] === currentPlayer;
		});
	}

	this.verticalWin = function(x, y) { 
		return this.has4InRow(y, 3, 0, HEIGHT-1, function(j) { 
			return field[x][j] === currentPlayer;
		});
	}

	this.has4InRow = function(center, width, min, max, predicate) { 
		var j1 = (center - width) < min ? min : center - width;
		var j2 = (center + width) > max ? max : center + width;
		var count = 0;
		for (var j = j1; j <= j2; j++) { 
			if (predicate(j)) { 
				count++; 
			
				if (count == 4) { 
					return true;
				}

			} else { 
				count = 0; 
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