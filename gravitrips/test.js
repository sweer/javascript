var chai = require('chai');

var expect = chai.expect;

var Game = require('./gravitrips');

describe('Game', function() { 
	it('new Game shall start with X move', function() { 
		var game = new Game();
		expect(game.stateText()).to.equal("X move");
	});

	it('second move is O', function() { 
		var game = new Game();
		game.makeMove(0);
		expect(game.stateText()).to.equal("O move");
	});

	it('horizontal win X row 0 leftmost', function() { 
		var game = new Game();
		game.makeMove(0); game.makeMove(0); // OX
		game.makeMove(1); game.makeMove(1); // OX
		game.makeMove(2); game.makeMove(2); // OX
		game.makeMove(3); // X

		expect(game.stateText()).to.equal("X won!");
	});

	it('horizontal win X row 0 rightmost', function() { 
		var game = new Game();
		game.makeMove(3); game.makeMove(3); // OX
		game.makeMove(4); game.makeMove(4); // OX
		game.makeMove(5); game.makeMove(5); // OX
		game.makeMove(6); // X

		expect(game.stateText()).to.equal("X won!");
	});


	it('horizontal win O row 1', function() { 
		var game = new Game();
		game.makeMove(0); game.makeMove(0); 
		game.makeMove(1); game.makeMove(1); 
		game.makeMove(2); game.makeMove(2); 
		game.makeMove(4); game.makeMove(3); 
		game.makeMove(5); game.makeMove(3);

		expect(game.stateText()).to.equal("O won!");
	});

	it('vertical win X column 0 lower', function() { 
		var game = new Game();
		game.makeMove(0); game.makeMove(1); 
		game.makeMove(0); game.makeMove(1); 
		game.makeMove(0); game.makeMove(1); 
		game.makeMove(0); 

		expect(game.stateText()).to.equal("X won!");
	});

	it('vertical win O column 0 upper', function() { 
		var game = new Game();
		game.makeMove(0); game.makeMove(1); 
		game.makeMove(0); game.makeMove(1);
		game.makeMove(1); game.makeMove(0);
		game.makeMove(1); game.makeMove(0);
		game.makeMove(1); game.makeMove(0);
		game.makeMove(2); game.makeMove(0);

		expect(game.stateText()).to.equal("O won!");
	});





	it('horizontal almost win X row 0 leftmost', function() { 
		var game = new Game();
		game.makeMove(0); game.makeMove(0); // OX
		game.makeMove(1); game.makeMove(1); // OX
		game.makeMove(2); game.makeMove(2); // OX

		expect(game.stateText()).to.equal("X move");
	});

	it('horizontal almost win X row 0 rightmost', function() { 
		var game = new Game();
		game.makeMove(2); game.makeMove(3); // OX
		game.makeMove(4); game.makeMove(4); // OX
		game.makeMove(5); game.makeMove(5); // OX
		game.makeMove(6); // X

		expect(game.stateText()).to.equal("O move");
	});


	it('vertical almost win X column 0 lower', function() { 
		var game = new Game();
		game.makeMove(0); game.makeMove(1); 
		game.makeMove(0); game.makeMove(1); 
		game.makeMove(0); game.makeMove(1); 

		expect(game.stateText()).to.equal("X move");
	});

	it('vertical almost win O column 0 upper', function() { 
		var game = new Game();
		game.makeMove(0); game.makeMove(1); 
		game.makeMove(0); game.makeMove(1);
		game.makeMove(0); game.makeMove(1);
		game.makeMove(1); game.makeMove(0);
		game.makeMove(1); game.makeMove(0);
		game.makeMove(1); 

		expect(game.stateText()).to.equal("O move");
	});

	it('main diagonal 0,0 the last', function() { 
		var game = new Game();
		game.makeMove(1); game.makeMove(1); 
		game.makeMove(2); game.makeMove(2);
		game.makeMove(1); game.makeMove(2);
		game.makeMove(3); game.makeMove(3);
		game.makeMove(3); game.makeMove(3);
		game.makeMove(5); game.makeMove(0);

		expect(game.stateText()).to.equal("O won!");
	});

	it('reverse diagonal rightmost the last', function() { 
		var game = new Game(); 
		game.makeMove(5); game.makeMove(4);
		game.makeMove(5); game.makeMove(4);
		game.makeMove(4); game.makeMove(3);
		game.makeMove(3); game.makeMove(3);
		game.makeMove(3); game.makeMove(0);
		game.makeMove(6);

		expect(game.stateText()).to.equal("X won!");
	});


	it('reverse diagonal topmost the last', function() { 
		var game = new Game();
		game.setField([ ['.', '.', '.', '.', 'X', 'O'], 
					    ['.', '.', '.', '.', 'O', 'X'], 
						['.', 'X', 'X', 'O', 'X', 'X'], 
						['.', 'O', 'X', 'X', 'O', 'X'], 
						['.', 'O', 'O', 'O', 'X', 'O'], 
						['.', 'O', 'X', 'O', 'X', 'O'], 
						['.', '.', '.', '.', 'X', 'O'] ]);  
		game.makeMove(4); game.makeMove(2);

		expect(game.stateText()).to.equal("O won!");
	});

	it('out of bounds main diagonal regression', function() { 
		var game = new Game();
		game.setField([ ['.', '.', '.', '.', '.', '.'], 
					    ['.', '.', '.', '.', 'O', 'X'], 
						['.', '.', 'X', 'O', 'O', 'O'], 
						['.', '.', 'O', 'X', 'X', 'X'], 
						['.', '.', '.', '.', 'O', 'X'], 
						['.', '.', '.', '.', '.', '.'], 
						['.', '.', '.', '.', '.', '.'] ]);  
		game.makeMove(0); 

		expect(game.stateText()).to.equal("O move");
	});




});