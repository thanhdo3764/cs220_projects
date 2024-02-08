import * as readline from 'readline-sync';

enum Rank {
	Ace,
	Two,
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight,
	Nine,
	Ten,
	Jack,
	Queen,
	King,
}

enum Suit {
	Spades,
	Clubs,
	Diamonds,
	Hearts,
}

class Card {
	
	cardValue: number;
	cardString: string;
	
	constructor(cardIndex: number) {
		// Calculate the rank and suit of the card
		let cardRank: Rank = (cardIndex % 13);
		let cardSuit: Suit = Math.floor(cardIndex / 13);

		// Determine the value of the card
		switch (true) {
			case (cardRank === 0):
				this.cardValue = 11;
				break;
			case (cardRank > 0 && cardRank < 10):
				this.cardValue = cardRank + 1;
				break;
			case (cardRank >= 10):
				this.cardValue = 10;
				break;
		}
		// Convert card into a string
		this.cardString = Rank[cardRank]+" of "+Suit[cardSuit];
	}

	printCard(): void {
		console.log(this.cardString);
	}

}

class Participant {

	name: string = "";
	deck: Card[] = [];
	deckString: string = "";
	score: number = 0;

	constructor(name: string) {
		this.name = name;
	}

	add(card: Card): void {
		// Add a comma to separate cards in deckString
		if (this.deck.length !== 0) this.deckString += ", ";
		this.deckString += card.cardString;
		// Add card to deck
		this.deck.push(card);
		// Update score
		this.score += card.cardValue;
	}

	printStatus(hidden: boolean): void {
		if (hidden) console.log(this.name+"'s Cards:",this.deck[0].cardString,"and one hidden card");
		else {
			console.log(this.name+"'s Cards:",this.deckString,"\n"+this.name+"'s Score:",this.score);
		}
	}

	reset(): Card[] {
		this.deckString = "";
		this.score = 0;
		// Copy the cards in deck into tempDeck
		let tempDeck: Card[] = [];
		tempDeck.concat(this.deck);
		// Empty deck
		this.deck = [];
		return tempDeck;
	}

	isBust(): boolean {
		return this.score > 21;
	}

}

class Game {

	gameDeck: Card[] = [];
	dealer: Participant;
	player: Participant;

	constructor() {
		// Initialize Dealer and Player
		this.dealer = new Participant("Dealer");
		this.player = new Participant("Player");

		// Initialize gameDeck with all 52 cards
		for (let i=0; i < 52; i++) {
			this.gameDeck.push(new Card(i));
		}

		console.log("----------------------------------------------------");
		console.log("\n\n----  |    ---   --- |   /    -----  ---   --- |   /");
		console.log("|   | |   |   | |    |  /       |   |   | |    |  /");
		console.log("|---  |   |---| |    |--        |   |---| |    |-- ");
		console.log("|   | |   |   | |    |  \\       |   |   | |    |  \\");
		console.log("----  --- |   |  --- |   \\    --    |   |  --- |   \\\n\n");
		console.log("----------------------------------------------------\n\n");

	}

	shuffle(): void {
		// Choose two random cards and swap. Repeat 100 times.
		for (let i = 0; i < 100; i++) {
			let firstCardIndex: number = Math.floor(Math.random()*52);
			let secondCardIndex: number = Math.floor(Math.random()*52);
			let temp = this.gameDeck[firstCardIndex];
			this.gameDeck[firstCardIndex] = this.gameDeck[secondCardIndex];
			this.gameDeck[secondCardIndex] = temp;
		}
	}

	hostGame(): void {

		this.shuffle();

		// Give Dealer 2 cards and print 1
		this.dealer.add(this.gameDeck.pop());
		this.dealer.add(this.gameDeck.pop());
		this.dealer.printStatus(true);
		console.log("\n");

		// Give Player 2 cards and print both
		this.player.add(this.gameDeck.pop());
		this.player.add(this.gameDeck.pop());
		this.player.printStatus(false);

		// Player's turn
		console.log("\n-------------------\n   Player's Turn\n-------------------");
		while(this.player.score !== 21) {
			let move: string = "";

			// Keep asking for a valid input
			while(move!='h' && move!='s'){
				move = readline.question("\nType 'h' to hit or 's' to stay: ");
			}
			if (move === 's') break;

			// Add card to player's deck
			let cardDealt = this.gameDeck.pop();
			this.player.add(cardDealt);
			console.log("Player was dealt a",cardDealt.cardString+"\n");
			this.player.printStatus(false);

			// Stop game if player busted
			if (this.player.isBust()) {
				console.log("\nPlayer busted. Dealer wins!");
				return; 
			} 
		}

		// Dealer's turn
		console.log("\n-------------------\n   Dealer's Turn\n-------------------");
		while(this.dealer.score < 17) {
			// Add card to dealer's deck
			let cardDealt = this.gameDeck.pop();
			this.dealer.add(cardDealt);
			console.log("\nDealer was dealt a",cardDealt.cardString+"\n");
			this.dealer.printStatus(false);

			// Stop game if dealer busted
			if (this.dealer.isBust()) {
				console.log("\nDealer busted. Player wins!");
				return; 
			} 
		}

		// Print the result of the game
		console.log("\nPlayer scored",this.player.score,"and Dealer scored",this.dealer.score);
		switch (true) {
			case (this.player.score == this.dealer.score):
				console.log("The scores are tied and both push");
				break;
			case (this.player.score <= this.dealer.score):
				console.log("Dealer wins!");
				break;
			case (this.player.score >= this.dealer.score):
				console.log("Player wins!");
				break;
		}


	}
}
let x: Game = new Game();
x.hostGame();
















