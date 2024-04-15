import readline from 'readline-sync';

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
	
	/**
	 * Initializes cardValue and cardString by using a passed index
	 * to calculate the card's rank and suit. The rank then determines
	 * the cardValue. 
	 * 
	 * The rank and suit of the card is converted into a string
	 * that initializes cardString.
	 * 
	 * 0x1F0XY
	 */ 
	constructor(cardIndex: number) {
		// Calculate the rank and suit of the card
		this.suit = cardIndex & 0x0000F;
		this.rank = cardIndex & 0x000F0;

		// Convert card into a string
		this.cardString =  String.fromCodePoint(0x1F000 | this.suit | this.rank);
	}

	/**
	 *  Takes the cardString field and prints it to console
	 */
	printCard(): void {
		console.log(this.cardString,Rank[cardRank],"of",Suit[cardSuit]);
	}

}
const cardBase: number = 0x1F000;
let cardSuit: Suit = Suit.Hearts;
let cardRank: Rank = Rank.King;
let c:Card = new Card(cardBase|cardSuit|cardRank);
c.printCard();