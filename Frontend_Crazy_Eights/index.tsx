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

class Card{
	
	suit: Suit;
	rank: Rank;
	cardString: string = "";
	
	constructor(cardIndex: number) {
		// Calculate the rank and suit of the card
		this.suit = cardIndex & 0x000F0;
		this.rank = cardIndex & 0x0000F;

		// Convert card into a string
		this.cardString =  String.fromCodePoint(0x1F000 | this.suit | this.rank);
	}

	renderCard(): ReactNode {
		let cardColor:string;
		(this.suit === Suit.Diamonds || this.suit === Suit.Hearts) ? cardColor="red" : cardColor="black";
		return <span style={{color:cardColor, margin:'auto'}}>{this.cardString}</span>;
	}

}

class Player {

	readonly name: string = "";
	private _hand: Card[] = [];
	private _handIndex: number = 0;

	constructor(name: string) {
		this.name = name;
	}

	get hand() {return this._hand;}
	get handIndex() {return this._handIndex;}

	/**
	 * Sets the handIndex to a playable card depending on the given
	 * rank and suit and returns true or false otherwise
	 */
	hasPlayableCard(rank: Rank, suit: Suit): boolean {
		for (let i=0; i<this._hand.length; i++) {
			if (this._hand[i].suit === suit || this._hand[i].rank === rank || this._hand[i].rank === Rank.Eight) {
				this._handIndex = i;
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

		let cardInHand = this._hand[this._handIndex];
		
		// If the card has the same suit, rank, or is an eight, play card.
		if (cardInHand.suit === suit || cardInHand.rank === rank || cardInHand.rank === Rank.Eight) {
			let removedCard = this.hand.splice(this._handIndex,1);
			this._handIndex = 0;
			return removedCard[0];
		}
		return undefined;

	}

	/**
	 * Add a card to hand, and set the handIndex to this card
	 */ 
	add(card: Card): void {
		this._hand.push(card);
		this._handIndex = this._hand.length-1;
	}

	/**
	 * Cycles to the next card in hand
	 */ 
	cycleCard(): void {
		this._handIndex = ++this._handIndex % this._hand.length;
	}

	/**
	 * Check if the participant has an empty hand
	 */ 
	hasWon(): boolean {
		return this._hand.length == 0;
	}

}

interface GameProps {}

class GameState {
	cardInHand: Card = new Card(0x1F0A1);
	playerCards: Card[] = [];
	topCard: Card = new Card(0x1F0A1);
	changingSuit: boolean = false;
	whoseTurn:number = 0;
	winner:string = "none";
}

class Game extends Component<GameProps, GameState> {

	private stock: Card[] = [];
	private pile: Card[] = [];
	private player: Player = new Player("Player");
	private participants: Player[] = []
	
	constructor(props:GameProps) {
		super(props);

		this.participants.push(this.player);
		this.participants.push(new Player("Bot 1"));
		this.participants.push(new Player("Bot 2"));
		this.participants.push(new Player("Bot 3"));

		// Initialize Deck with all 52 cards into stock
		for (let suit=0xA0; suit <= 0xD0; suit+=0x10) {
			for (let rank=0x01; rank <= 0x0E; rank+=0x01) {
				if (rank===0x0C) continue;
				this.stock.push(new Card(0x1F000|suit|rank));
			}
		}
		this.shuffleStock();
		// Deal 5 cards to all participants
		for (let i = 0; i < 5; i++) {
			for (let p of this.participants) {
				p.add(this.dealCard());
			}
		}
		// Place a starter card
		let starter:Card;
		while (true) {
			starter = this.stock.pop()!;
			this.pile.push(starter);
			if (starter.rank !== Rank.Eight) break;
		}
		// Set state
		let newState = new GameState();
		newState.cardInHand = this.player.hand[this.player.handIndex];
		newState.topCard = starter;
		newState.playerCards = this.player.hand;
		this.state = newState;
	}

	/**
	 * Renders html whenever this.state changes
	 */ 
	override render(): ReactNode {
		// Render for topCard
		let tc;
		if (this.state.winner === "none") {
			tc=this.state.topCard.renderCard();
		} else {
			tc=<span style={{fontSize:'80px', textAlign: 'center', margin:'auto'}}> {this.state.winner} </span>;
		}
		// Render for playerCards
		let s = [];
		for (let card of this.state.playerCards) {
			s.push(card.renderCard())!;
		}
		//Render for cardInHand
		let renderCardInHand;
		if (!!this.state.cardInHand) renderCardInHand = this.state.cardInHand.renderCard();
		
		return <div style={{display: 'grid'}}>
            <h1>Crazy Eights</h1>
            <div className = "topCard">
	            {tc}
        	</div>
        	<div className = "playerCards">
	            {renderCardInHand}
            </div>
            <div className ="playerCards">
            	{s}
            </div>
            <div style={{display: 'block', margin: 'auto'}}>
            <input type="button" className="button" value="Play Card" disabled={!!this.state.whoseTurn || this.state.winner !== "none"} onClick={()=> this.onClickPlay()}/>
            <input type="button" className="button" value="Cycle Card" disabled={!!this.state.whoseTurn || this.state.winner !== "none"} onClick={()=> this.onClickCycle()}/>
            <input type="button" className="button" value="Draw Card" disabled={!!this.state.whoseTurn || this.state.winner !== "none"} onClick={()=> this.onClickDraw()}/>
            </div>
            <div style={{display: 'block', margin: 'auto'}}>
                <input type="button" className="suitButton" id="s" value="♠" disabled={!this.state.changingSuit} onClick={()=> {this.switchSuit(0);this.botTurn();}}/>
                <input type="button" className="suitButton" id="c" value="♣" disabled={!this.state.changingSuit} onClick={()=> {this.switchSuit(1);this.botTurn();}}/>
                <input type="button" className="suitButton" id="d" value="♦" disabled={!this.state.changingSuit} onClick={()=> {this.switchSuit(2);this.botTurn();}}/>
                <input type="button" className="suitButton" id="h" value="♥" disabled={!this.state.changingSuit} onClick={()=> {this.switchSuit(3);this.botTurn();}}/>
			</div>
			</div>
	}

	/**
	 * Shuffles the cards in stock
	 */ 
	shuffleStock(): void {
		if (this.stock.length === 0) return;
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
	switchSuit(suitCmd:number): void{
		let card = new Card(0x1F000);
		switch(suitCmd) {
		// Spades
		case(0):
			card.suit=Suit.Spades;
			card.cardString = '♠';
			break;
		// Clubs
		case(1):
			card.suit=Suit.Clubs;
			card.cardString = '♣';
			break;
		// Diamonds
		case(2):
			card.suit=Suit.Diamonds;
			card.cardString = '♦';
			break;
		// Hearts
		case(3):
			card.suit=Suit.Hearts;
			card.cardString = '♥';
			break;
		}
		this.setState(() => ({topCard:card, changingSuit:false}));
	}

	/**
	 * Handles when the player clicks the "play card" button
	 */ 
	async onClickPlay() {
	    let cardInQuestion = this.player.playCard(this.state.topCard.rank, this.state.topCard.suit);
	    if (cardInQuestion === undefined) {
	        return;
	    }

	    this.pile.push(cardInQuestion);

		this.setState(() => ({
			cardInHand: this.player.hand[this.player.handIndex],
			topCard: cardInQuestion!,
			playerCards: this.player.hand,
			whoseTurn: 1,
		}));

	    if (this.player.hasWon()) {
	    	this.setState(() => ({winner:("Player Won")}));
	        return;
	    }
        // Ask for suit if player played an Eight
        if (cardInQuestion.rank === Rank.Eight) {
        	this.setState(() => ({changingSuit: true}));
        } else this.botTurn();

	}

	/**
	 * Simulates a bot's turn after the player's turn or another bot's turn
	 */ 
	async botTurn() {

		await this.delay(1000);
	    const bot = this.participants[this.state.whoseTurn];

	    // Bot draws cards until it's playable
	    while (!bot.hasPlayableCard(this.state.topCard.rank, this.state.topCard.suit)) {
	    	const dealtCard = this.dealCard();
	    	// Skip turn if there's no more cards to deal
			if (!dealtCard) {
				this.setState(() => ({
					whoseTurn: (this.state.whoseTurn+1)%4,
				}), () => {
					if (!!this.state.whoseTurn) this.botTurn();
				});
				return
			}
	    	bot.add(dealtCard);
	    }
	    const cardInQuestion = bot.playCard(this.state.topCard.rank, this.state.topCard.suit)!;
	    this.pile.push(cardInQuestion);
	    
	    // Finishes bots turn after setting state
	    const afterBotTurn = () => {
	    	// If Bot played an Eight, choose a random suit
	    	if (bot.hasWon()) {
	    	    this.setState(() => ({winner:("Bot "+((this.state.whoseTurn-1)%4)+" Won")}));
	    	    return;
	    	}

	    	if (cardInQuestion.rank === Rank.Eight) this.switchSuit(Math.floor(Math.random()*4));
	    	
	    	if (!!this.state.whoseTurn) this.botTurn();
	    }

	    this.setState(() => ({
	    	whoseTurn: (this.state.whoseTurn+1)%4,
			topCard: cardInQuestion,
		}), afterBotTurn)

	}

	/**
	 * Helper function to add delay between bot turns
	 */ 
	private delay = (ms:number) => {
	    return new Promise(resolve => setTimeout(resolve, ms));
	};

	/**
	 * Handles when "Cycle Card" button is clicked by
	 * cycling to the next card in Player's hand
	 */ 
	onClickCycle(): void {
		this.player.cycleCard();
		this.setState(() => ({
			cardInHand: this.player.hand[this.player.handIndex],
		}));
	}

	/**
	 * Handles when "Draw Card" button is clicked and draws a card from stock
	 */ 
	onClickDraw(): void {
		const dealtCard = this.dealCard();
		// Skip turn if there's no more cards to deal
		if (!dealtCard) {
			this.setState(() => ({
				whoseTurn: 1,
			}));
			this.botTurn();
			return
		}
		this.player.add(dealtCard);
		this.setState(() => ({
			cardInHand: this.player.hand[this.player.handIndex],
			playerCards: this.player.hand,
		}));
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

