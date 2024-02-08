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
	
	cardIndex: number;
	cardValue: number;
	cardString: string;
	
	constructor(cardIndex: number) {

		this.cardIndex = cardIndex;

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

		this.cardString = Rank[cardRank]+" of "+Suit[cardSuit];
	}

	printCard(): void {
		console.log(this.cardString);
	}

}

class Game {

	gameDeck: Card[] = [];

	constructor() {
		// Initialize gameDeck with all 52 cards
		for (let i=0; i < 52; i++) {
			this.gameDeck.push(new Card(i));
		}

		console.log("\n\n----  |    ---   --- |   /    -----  ---   --- |   /")
		console.log("|   | |   |   | |    |  /       |   |   | |    |  /")
		console.log("|---  |   |---| |    |--        |   |---| |    |-- ")
		console.log("|   | |   |   | |    |  \\       |   |   | |    |  \\")
		console.log("----  --- |   |  --- |   \\    --    |   |  --- |   \\\n\n")

	}

	shuffle(): void {
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

		let dealerCards: Card[] = [];
		let playerCards: Card[] = [];
		
		let dealerScore: number = 0;
		let playerScore: number = 0;

		let playerCardsString: string = "";

		// Give Dealer 2 cards and print 1
		for (let i=0; i<2; i++) {
			let card = this.gameDeck.pop();
			dealerCards.push(card);
			dealerScore += card.cardValue;
		}
		console.log("\nDealer's Cards: "+dealerCards[0].cardString+" and one hidden card");
		
		// Give Player 2 cards and print both
		for (let i=0; i<2; i++) {
			let card = this.gameDeck.pop();
			playerCards.push(card);
			playerScore += card.cardValue;
			playerCardsString += card.cardString + ", "
		}
		console.log("\nPlayer's Cards: " + playerCardsString);
		console.log("Player's Score: "+playerScore)

	}
}
let x: Game = new Game();
x.hostGame();
















