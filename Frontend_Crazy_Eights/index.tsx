import readline from 'readline-sync';
import React, { StrictMode, Component, ReactNode } from "react";
import { createRoot } from "react-dom/client";

enum Rank {
	Ace = 0x1,
	Two = 0x2,
	Three = 0x3,
	Four = 0x4,
	Five = 0x5,
	Six = 0x6,
	Seven = 0x7,
	Eight = 0x8,
	Nine = 0x9,
	Ten = 0xA,
	Jack = 0xB,
	Queen = 0xD,
	King = 0xE,
}

enum Suit {
	Spades = 0xA0,
	Clubs = 0xD0,
	Diamonds = 0xC0,
	Hearts = 0xB0,
}

class Card {
	
	suit: Suit;
	rank: Rank;
	cardString: string = "";
	
	constructor(cardIndex: number) {
		// Calculate the rank and suit of the card
		this.suit = cardIndex & 0x000F0;
		this.rank = cardIndex & 0x0000F;

		// Convert card into a string
		this.cardString =  String.fromCodePoint(0x1F000 | this.suit | this.rank)+" "+Rank[this.rank]+" of "+Suit[this.suit];
	}

	/**
	 *  Takes the cardString field and prints it to console
	 */
	printCard(): void {
		console.log(this.cardString);
	}

}

class Participant {

	name: string = "";
	hand: Card[] = [];
	handIndex: number = 0;

	constructor(name: string) {

		this.name = name;
	
	}
	/**
	 * Sets the handIndex to a playable card depending on the given
	 * rank and suit and returns true or false otherwise
	 */
	hasPlayableCard(rank: Rank, suit: Suit): boolean {
		// Loops through the hand to find a playable card
		for (let i=0; i<this.hand.length; i++) {
			if (this.hand[i].suit === suit || this.hand[i].rank === rank || this.hand[i].rank === Rank.Eight) {
				this.handIndex = i;
				return true;
			}
		}
		return false;

	}

	/**
	 * Remove and return the card at handIndex depending on the,
	 * rank and suit, otherwise, return undefined.
	 */ 
	playCard(rank: Rank, suit: Suit): Card | undefined {

		let cardInHand = this.hand[this.handIndex];
		
		// If the card has the same suit, rank, or is an eight, play card.
		if (cardInHand.suit === suit || cardInHand.rank === rank || cardInHand.rank === Rank.Eight) {
			let removedCard = this.hand.splice(this.handIndex,1);
			this.handIndex = 0;
			console.log(this.name, "played a",removedCard[0].cardString);
			return removedCard[0];
		}
		return undefined;

	}

	/**
	 * Add a card to hand, and set the handIndex to this card
	 */ 
	add(card: Card): void {

		this.hand.push(card);
		this.handIndex = this.hand.length-1;

	}

	/**
	 * Cycles to the next card in hand
	 */ 
	cycleCard(): void {

		this.handIndex++;
		if (this.handIndex >= this.hand.length) this.handIndex = 0;
		console.log(this.name,"is holding the",this.hand[this.handIndex].cardString);

	}

	/**
	 * Check if the participant has an empty hand
	 */ 
	hasWon(): boolean {
		return this.hand.length == 0;
	}

	/**
	 * Print the cards in hand
	 */ 
	printHand(): void {

		console.log(this.name+"'s Cards:");
		for (let card of this.hand) {
			card.printCard();
		}

	}

}

class Game {

	stock: Card[] = [];
	pile: Card[] = [];
	participants: Participant[] = []
	topCard: Card = this.pile[0];
	turn:number = 0;

	constructor() {

		this.participants.push(new Participant("Player"));
		this.participants.push(new Participant("Bot 1"));
		this.participants.push(new Participant("Bot 2"));
		this.participants.push(new Participant("Bot 3"));

		// Initialize gameDeck with all 52 cards
		for (let suit=0xA0; suit <= 0xD0; suit+=0x10) {
			for (let rank=0x01; rank <= 0x0E; rank+=0x01) {
				if (rank===0x0C) continue;
				this.stock.push(new Card(0x1F000|suit|rank));
			}
		}
		this.shuffleStock();
		console.log("-------------");
		console.log("Crazy Eight's");
		console.log("-------------\n");

	}

	/**
	 * Shuffles the cards in stock
	 */ 
	shuffleStock(): void {
		// Choose two random cards and swap. Repeat 51 times.
		for (let i = 0; i < 51; i++) {
			let firstCardIndex: number = Math.floor(Math.random()*this.stock.length);
			let secondCardIndex: number = Math.floor(Math.random()*this.stock.length);
			let temp = this.stock[firstCardIndex];
			this.stock[firstCardIndex] = this.stock[secondCardIndex];
			this.stock[secondCardIndex] = temp;
		}
	}

	/**
	 * Returns the top card from the stock. If stock was empty, take all 
	 * but the top card from the pile and shuffle it into the stock
	 */
	dealCard(): Card {

		if(this.stock.length === 0) {
	 		this.stock = this.pile.splice(0,this.pile.length-1);
	 		this.shuffleStock();
		}

 		return this.stock.pop()!;

	}

	/**
	 * Take a command to return a card with that suit.
	 * To be used when an Eight is played.
	 */ 
	switchSuit(suitCmd:string|number): Card {
		switch(suitCmd) {
		case(0):
		case ('s'):
			console.log("\nThe suit was switched to Spades!");
			return new Card(0x1F000|0xA0);
		case(1):
		case ('c'):
			console.log("\nThe suit was switched to Clubs!");
			return new Card(0x1F000|0xD0);
		case(2):
		case ('d'):
			console.log("\nThe suit was switched to Diamonds!");
			return new Card(0x1F000|0xC0);
		case(3):
		case ('h'):
			console.log("\nThe suit was switched to Hearts!");
			return new Card(0x1F000|0xB0);
		}
		return new Card(0x1F000|0xA0);
	}

	onClickPlay(): boolean {
		// Player Turn
		const player = this.participants[0];
		let cardInQuestion = player.playCard(this.topCard.rank, this.topCard.suit);
		if (cardInQuestion === undefined) {
			return false;
		}
		this.topCard = cardInQuestion!;
		this.pile.push(this.topCard);
		// Ask for suit if player played an Eight
		if (this.topCard.rank === Rank.Eight) {
			let newCmd = '';
			while (newCmd !== 's' && newCmd !== 'c' && newCmd !== 'd' && newCmd !== 'h') {
				newCmd = readline.question("Type (s)pades or (c)lubs or (d)iamonds or (h)earts: ");
			}
			this.topCard = this.switchSuit(newCmd);
		}
		if (player.hasWon()) {
			console.log("Player has won!");
			return true;
		}
		
		//Bots' Turn
		for (let i = 1; i < 4; i++) {
			let bot = this.participants[i];
			// Bot draws cards until it's playable
			while (!bot.hasPlayableCard(this.topCard.rank, this.topCard.suit)) bot.add(this.dealCard());
			this.topCard = bot.playCard(this.topCard.rank, this.topCard.suit)!;
			this.pile.push(this.topCard);
			// If Bot played an Eight, choose a random suit
			if (this.topCard.rank === Rank.Eight) this.topCard = this.switchSuit(Math.floor(Math.random()*4));

			if (bot.hasWon()) {
				console.log(bot.name,"has won!");
				return true;
			}
		}
		return false;
	}

	onClickCycle(): void {
		this.participants[0].cycleCard();
	}

	onClickDraw(): void {
		let cardDealt = this.dealCard();
		this.participants[0].add(cardDealt);
		console.log("Player was dealt the", cardDealt.cardString);
	}

	/**
	 * Simulates a game of Crazy Eights
	 */ 
	hostGame(): void {

		// Deal 5 cards to all participants
		for (let i = 0; i < 5; i++) {
			for (let p of this.participants) {
				p.add(this.dealCard());
			}
		}
		// Place a starter card 
		while (true) {
			this.topCard = this.stock.pop()!;
			this.pile.push(this.topCard);
			if (this.topCard.rank !== Rank.Eight) break;
		}

		let player = this.participants[0];

		// Loop through the participants' turn
		let cmd = '';
		let hasWinner = false;
		while(!hasWinner) {
			console.log("\nTop card is",this.topCard.cardString);
			player.printHand();
			console.log("\nPlayer is holding the", player.hand[player.handIndex].cardString);
			// Ask for command
			cmd = readline.question("Type (p)lace or (c)ycle or (d)raw: ");
			switch(cmd) {
			case ('p'):
				hasWinner = this.onClickPlay();
				break;
			case ('c'):
				this.onClickCycle();
				break;
			case ('d'):
				this.onClickDraw();
				break;
			}
		}

	}

	printGameStatus(): void {

		console.log("Card's in stock:");
		for (let card of this.stock) {
			card.printCard();
		}
		console.log("");

		console.log("Card's in pile:");
		for (let card of this.pile) {
			card.printCard();
		}
		console.log("");

		for (let p of this.participants) {
			p.printHand();
			console.log();
		}

	}

}


let g = new Game();
g.hostGame();
g.printGameStatus();