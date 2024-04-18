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

class Card extends Component{
	
	suit: Suit;
	rank: Rank;
	cardString: string = "";
	
	constructor(cardIndex: number) {
		super({});
		// Calculate the rank and suit of the card
		this.suit = cardIndex & 0x000F0;
		this.rank = cardIndex & 0x0000F;

		// Convert card into a string
		this.cardString =  String.fromCodePoint(0x1F000 | this.suit | this.rank);
	}

	renderCard(): ReactNode {
		let cardColor:string;
		(this.suit === Suit.Diamonds || this.suit === Suit.Hearts) ? cardColor="red" : cardColor="black";
		return <span className={"card"} style={{color:cardColor}}>{this.cardString}</span>;
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

}

interface GameProps {
	something?: number;
}

class GameState {

	cardInHand: Card = new Card(0x1F0A1);
	playerCards: Card[] = [];
	topCard: Card = new Card(0x1F0A1);

}

class Game extends Component<GameProps, GameState> {

	stock: Card[] = [];
	pile: Card[] = [];
	player: Participant = new Participant("Player");
	participants: Participant[] = []
	topCard: Card = this.pile[0];
	
	constructor(props:GameProps) {
		super(props);

		this.participants.push(this.player);
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
		this.hostGame();

		let newState = new GameState();
		newState.cardInHand = this.player.hand[this.player.handIndex];
		newState.topCard = this.topCard;
		newState.playerCards = this.player.hand;
		this.state = newState;

	}

	override render(): ReactNode {

		let s = [];

		for (let card of this.state.playerCards) {
			s.push(card.renderCard())!;
		}

		return <div>
            <p>Crazy Eights.</p>
            <div>
            	{this.state.topCard.renderCard()}
        	</div>
        	<div>
	            {this.state.cardInHand.renderCard()}
            </div>
            <div id = "cards">
            	{s}
            </div>
            <input type="button" value="Play Card" onClick={()=> this.onClickPlay()}/>
            <input type="button" value="Cycle Card" onClick={()=> this.onClickCycle()}/>
            <input type="button" value="Draw Card" onClick={()=> this.onClickDraw()}/>
			</div>
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
		let cardInQuestion = this.player.playCard(this.topCard.rank, this.topCard.suit);
		if (cardInQuestion === undefined) {
			return false;
		}
		this.topCard = cardInQuestion!;
		this.pile.push(this.topCard);

		this.updateState;

		// // Ask for suit if player played an Eight
		// if (this.topCard.rank === Rank.Eight) {
		// 	let newCmd = '';
		// 	while (newCmd !== 's' && newCmd !== 'c' && newCmd !== 'd' && newCmd !== 'h') {
		// 		newCmd = readline.question("Type (s)pades or (c)lubs or (d)iamonds or (h)earts: ");
		// 	}
		// 	this.topCard = this.switchSuit(newCmd);
		// }
		// if (this.player.hasWon()) {
		// 	console.log("Player has won!");
		// 	return true;
		// }
		
		//Bots' Turn
		for (let i = 1; i < 4; i++) {
			let bot = this.participants[i];
			// Bot draws cards until it's playable
			while (!bot.hasPlayableCard(this.topCard.rank, this.topCard.suit)) bot.add(this.dealCard());
			this.topCard = bot.playCard(this.topCard.rank, this.topCard.suit)!;
			this.pile.push(this.topCard);
			// If Bot played an Eight, choose a random suit
			if (this.topCard.rank === Rank.Eight) this.topCard = this.switchSuit(Math.floor(Math.random()*4));

			this.updateState();

			if (bot.hasWon()) {
				console.log(bot.name,"has won!");
				return true;
			}
		}
		return false;
	}

	onClickCycle(): void {
		this.player.cycleCard();

		this.updateState();
	}

	onClickDraw(): void {
		let cardDealt = this.dealCard();
		this.player.add(cardDealt);
		console.log("Player was dealt the", cardDealt.cardString);

		this.updateState();

		
	}

	updateState(): void {
		let newState = new GameState();
		newState.cardInHand = this.player.hand[this.player.handIndex];
		newState.topCard = this.topCard;
		newState.playerCards = this.player.hand;
		this.setState(newState);
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

	}

}

const rootElem = document.getElementById('root');

if( rootElem == null ) {
    alert('you forgot to put a root element in your HTML file.');
}

const root = createRoot( rootElem as HTMLElement );

root.render(
    <StrictMode>
        <Game/>
    </StrictMode>
);

