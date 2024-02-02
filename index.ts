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
				this.cardValue = 1;
				break;
			case (cardRank > 0 && cardRank < 10):
				this.cardValue = cardRank + 1;
				break;
			case (cardRank >= 10):
				this.cardValue = 10;
				break;
		}

		this.cardString = Rank[cardRank] + " of " + Suit[cardSuit] + " with a value of " + this.cardValue + "\n";
	}

	printCard(): void {
		console.log(this.cardString);
	}

}

class Deck {

	deckOfCards: Card[] = [];
	
	constructor() {
		for (let i:number=0; i < 52; i++) {
			this.deckOfCards.push(new Card(i));
		}
	}

	printDeck(): void {
		for (let c of this.deckOfCards) {
			c.printCard();
		}
	}
}

let x:Deck = new Deck();
x.printDeck();
