enum RankValue {
	Ace = 1,
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

type Rank = {rankInt:RankValue : rankString:string}
enum Suit {
	Spades = "Spades",
	Clubs = "Clubs",
	Diamonds = "Diamonds",
	Hearts = "Hearts",
}

class Card {
	
	cardRank:Rank;
	cardSuit:Suit;
	
	constructor() {
		this.cardRank = Math.floor((Math.random() * 13) + 1);
		let randomSuit:number = Math.floor(Math.random()*4);
		switch (randomSuit) {
			case 0:
				this.cardSuit = Suit.Spades;
				break;
			case 1:
				this.cardSuit = Suit.Clubs;
				break;
			case 2:
				this.cardSuit = Suit.Diamonds;
				break;
			case 3:
				this.cardSuit = Suit.Hearts;
				break;
		}
	}

	printCard(): void {
		let str : string = this.cardSuit;
		console.log((this.cardRank + " of %s", str));
	}

}

class Deck {
	
	constructor() {

	}
}

let x:Card = new Card();
x.printCard();
