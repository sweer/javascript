var chai = require('chai');

var expect = chai.expect;

var Game = require('./gravitrips');

describe('Game', function() { 
	it('new Game shall start with X move', function() { 
		var game = new Game();
		expect(game.stateText()).to.equal("X move");
	});
});