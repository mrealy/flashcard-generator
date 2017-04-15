// variables =================================================
var inquirer = require("inquirer");
var fs = require("fs");
var newCard;
var basicCounter = -1;
var clozeCounter = -1;
var basicRemaining = true;
var clozeRemaining = true;



// ===========================================================

// constructor for basic card =============================
var basicCard = function(question, answer) {
	this.question = question;
	this.answer = answer;
	this.askQuestion = function() {
		console.log('Q: ' + this.question);
	}
}

basicCard.prototype.showAnswer = function() {
	console.log(this.answer);
}

// constructor for cloze card =============================
var clozeCard = function(fullText, answer) {
	this.fullText = fullText;
	this.answer = answer;
	// stores fullText minus cloze string into "partial" string variable
	var partial = fullText.slice(answer.length, fullText.length);
	
	this.showPartial = function() {
		console.log('...' + partial);
	}
}

clozeCard.prototype.showCloze = function() {
	console.log('The answer was: ' + this.cloze);
}

clozeCard.prototype.showFullText = function() {
	console.log(this.fullText);
}

// ================================================================

// constructor variables =======================================
var card1 = new basicCard(
	'Who was the first President of the United States?', 'George Washington');

var card2 = new clozeCard(
	'George Washington was the first President of the United States.', 'George Washington');



function chooseCardType () {
  if ((basicRemaining === false) && (clozeRemaining === false)) {
  	console.log('You\'re all out of cards!');
  } else {
	  console.log('===========================================================================')	
	  console.log('Basic card - Question on front, answer on back.');
	  console.log('Cloze card - Partial sentence that has had answer (or "cloze") text removed.');
	  console.log('===========================================================================')
	  inquirer.prompt([{
	    type: "list",
	    message: "What type of card would you like to study with?",
	    name: 'choice',
	    choices: ['Basic card', 'Cloze card']
	  }]).then(function(card) {
	    console.log('You selected ' + card.choice);
	    console.log('---------------------------------------------------------------------------');
	    if (card.choice === 'Basic card') {
	    	readBasic();
	    	basicCounter++;
	    } else if (card.choice === 'Cloze card') {
	    	readCloze();
	    	clozeCounter++;
	    }
	  });
  } 
};

chooseCardType();

function basicQuestion () {
	newCard.askQuestion();
	answerPrompt();
	
}

function readBasic () {
	fs.readFile('basicDeck.txt', 'utf8', function(error, data) {
		if (error) {
			console.log(error);
		}

		var cardArray = data.split(';');
		var deckCount = cardArray.length;

		if (basicCounter < deckCount) {
			var sides = cardArray[basicCounter].split(',');

			newCard = new basicCard(sides[0], sides[1]);
			basicQuestion();
		} else {
			console.log('You already went through all of the basic cards, maybe try studying with some cloze cards!');
			basicRemaining = false;
			next();
		}

	});
}

function readCloze () {
	fs.readFile('clozeDeck.txt', 'utf8', function(error, data) {
		if (error) {
			console.log(error);
		}

		var cardArray = data.split(';');
		var deckCount = cardArray.length;

		if (clozeCounter < deckCount) {
			var sides = cardArray[clozeCounter].split(',');

			newCard = new clozeCard(sides[0], sides[1]);
			clozeQuestion();
		} else {
			console.log('You already went through all of the cloze cards, maybe try studying with some basic cards!');
			clozeRemaining = false;
			next();
		}

	});
}

function clozeQuestion () {
	console.log('Prompt:');
	newCard.showPartial();
	answerPrompt();
}

function answerPrompt () {
	inquirer.prompt([{
		type: 'input',
		name: 'answer',
		message: 'Your answer:'
	}]).then(function(answer) {
	    console.log('---------------------------------------------------------------------------');
		if (answer.answer === newCard.answer) {
			console.log('Correct!');
			next();
		} else {
			console.log('Woops! The correct answer was ' + newCard.answer + '.');
			next();
		}
	});
}

function next () {
	inquirer.prompt([{
		type: 'confirm',
		name: 'continue',
		message: 'Press enter to continue',
		default: false
	}]).then(function() {
		console.log('===========================================================================');
		console.log('\n');
		chooseCardType();
	});
}
