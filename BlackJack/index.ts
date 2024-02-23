/**
 * Thanh Do
 * Aiden Dickson
 * 14 February 2024
 * Project 1: Black Jack
 */ 


import readline from 'readline-sync';

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
	
	cardValue: number = 0;
	cardString: string = "";
	
	/**
	 * Initializes cardValue and cardString by using a passed index
	 * to calculate the card's rank and suit. The rank then determines
	 * the cardValue. 
	 * 
	 * The rank and suit of the card is converted into a string
	 * that initializes cardString.
	 */ 
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

	/**
	 *  Takes the cardString field and prints it to console
	 */
	printCard(): void {
		console.log(this.cardString);
	}

}

class Participant {

	name: string = "";
	deck: Card[] = [];
	score: number = 0;
	numberOfAces: number = 0;

	constructor(name: string) {
		this.name = name;
	}

	/**
	 * Takes a card object and pushes it to the deck field,
	 * updates the comma-separated deckString field with the card's string,
	 * increases the score by the card's value, and it takes into account
	 * for busts by decreasing the value of aces by 10.
	 */ 
	add(card: Card): void {
		// Add card to deck
		this.deck.push(card);
		// Update score
		this.score += card.cardValue;
		if (card.cardValue == 11) this.numberOfAces++;
		// Downgrade any aces if it's a bust
		if (this.isBust() && this.numberOfAces > 0) {
			this.numberOfAces--;
			this.score -= 10;;
		}
	}

	/**
	 * Takes a boolean parameter to check if some print elements should
	 * be hidden. If hidden is false, print the name, cards, and score.
	 * If hidden is true, print the name and one card.
	 */
	printStatus(hidden: boolean): void {
		if (hidden) {
			console.log(this.name+"'s Cards:");
			this.deck[0].printCard();
			console.log("Hidden Card")
		}
		else {
			console.log(this.name+"'s Cards:");
			for (let card of this.deck) {
				card.printCard();
			}
			console.log(this.name+"'s Score:",this.score);
		}
	}

	/**
	 * Sets all fields to their default values. The cards that were in
	 * the deck will be returned as a Card[] array so that it can 
	 * be pushed back into the gameDeck.
	 */ 
	reset(): Card[] {
		this.score = 0;
		this.numberOfAces = 0;
		// Copy the cards in deck into tempDeck
		let tempDeck: Card[] = this.deck;
		// Empty deck
		this.deck = [];
		return tempDeck;
	}

	/**
	 * Returns a boolean that checks if this object has busted.
	 * A bust is true if the score is above 21 points,
	 * otherwise, bust is false.
	 */ 
	isBust(): boolean {
		return this.score > 21;
	}

}

class Game {

	gameDeck: Card[] = [];
	discardedCards: Card[] = [];
	dealer: Participant;
	player: Participant;

	/**
	 * Creates two Participant objects: the dealer and the player.
	 * The field gameDeck is initialize by pushing 52 Card objects
	 * into the array. Then a title screen for Black Jack is printed.
	 */ 
	constructor() {
		// Initialize Dealer and Player
		this.dealer = new Participant("Dealer");
		this.player = new Participant("Player");

		// Initialize gameDeck with all 52 cards
		for (let i=0; i < 52; i++) {
			this.gameDeck.push(new Card(i));
		}
		this.shuffle();

		console.log("----------------------------------------------------");
		console.log("\n\n----  |    ---   --- |   /    -----  ---   --- |   /");
		console.log("|   | |   |   | |    |  /       |   |   | |    |  /");
		console.log("|---  |   |---| |    |--        |   |---| |    |-- ");
		console.log("|   | |   |   | |    |  \\       |   |   | |    |  \\");
		console.log("----  --- |   |  --- |   \\    --    |   |  --- |   \\\n\n");
		console.log("----------------------------------------------------\n\n");

	}

	/**
	 * Shuffles the indices of the 52-card gameDeck
	 */ 
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

	/**
	 * Adds a card to the participant, prints the card dealt
	 * and prints the participant's status
	 */
	 dealCard(participant: Participant, numberOfCards: number, 
	 	shouldPrint:boolean, hidden: boolean): void {

	 	for(let i=0; i<numberOfCards; i++) {
	 		let cardDealt = this.gameDeck.pop()!;
			participant.add(cardDealt);
			if (shouldPrint) console.log("\n"+participant.name,"was dealt a",cardDealt.cardString+"\n");
	 	}
	 	participant.printStatus(hidden);
	 } 

	/**
	 * Infinitely prompts the user to play or quit. This will be the
	 * method that users outside of the class will interact with to
	 * start a game. If the user types 'q',then it essentially 
	 * quits the program. 
	 * 
	 * If the user types 'p', then the player and dealer are reset 
	 * with their cards discarded into discardedCards.
	 * If gameDeck has less than 30 cards, then gameDeck will push its 
	 * discarded cards and shuffle. After these checks,
	 * hostGame will commence.
	 */
	mainMenu(): void {
		while (true) {
			console.log("\n-------------------\n     MAIN MENU\n-------------------");
			let option: string = "";
			while (option !== 'q' && option !== 'p') {
				option = readline.question("Type 'p' to play a game or 'q' to quit: ");
			}
			// Quit mainMenu if q is entered
			if (option === 'q') return;
			// Put cards used last game into discardedCards
			this.discardedCards.push(...this.player.reset());
			this.discardedCards.push(...this.dealer.reset());
			// Re-add discardedCards to gameDeck and shuffle
			if (this.gameDeck.length < 30) {
				this.gameDeck.push(...this.discardedCards);
				this.shuffle();
				this.discardedCards = [];
			}
			this.hostGame();
		}
	}

	/**
	 * Starts a game of Black Jack. The game starts by dealing and
	 * revealing one of Dealer's cards and both of Player's cards and
	 * their score.
	 * 
	 * Player's turn starts by infinitely asking for a hit or stay.
	 * If the user inputs 'h', then a card is added to Player's deck, and
	 * their fields are updated and printed. However, Player could also stay
	 * if 's' is inputted. Every time a card is dealt, busts and black jacks
	 * are taken into account.
	 * 
	 * Dealer's turn starts and they must hit until their score is at least 17.
	 * Busts and black jacks are taken into account.
	 * 
	 * If both Player and Dealer end with the same score, it's a push.
	 * Else, whoever has the higher score wins. However, if the Player
	 * busts, they will lose, and a Dealer busting is a win for Player if
	 * Player hasn't busted yet. 
	 */ 
	hostGame(): void {

		console.log("\n-------------------\nSTARTING GAME . . .\n-------------------\n");

		// Give Dealer 2 cards and print 1
		this.dealCard(this.dealer, 2, false, true)

		// Give Player 2 cards and print both
		console.log("\n");
		this.dealCard(this.player, 2, false, false)

		// Player's turn
		console.log("\n-------------------\n   PLAYER'S TURN\n-------------------");
		while(this.player.score !== 21) {
			console.log("");
			let move: string = "";
			// Keep asking for a valid input
			while(move!='h' && move!='s'){
				move = readline.question("Type 'h' to hit or 's' to stay: ");
			}
			if (move === 's') break;
			// Add card to player's deck
			this.dealCard(this.player, 1, true, false);
			// Stop game if player busted
			if (this.player.isBust()) {
				console.log("\nPlayer busted. Dealer wins!");
				return; 
			} 
		}
		if (this.player.score === 21) console.log("\nBLACK JACK!");

		// Dealer's turn
		console.log("\n-------------------\n   DEALER'S TURN\n-------------------\n");
		this.dealer.printStatus(false);
		while(this.dealer.score < 17) {
			// Add card to dealer's deck
			this.dealCard(this.dealer, 1, true, false);
			// Stop game if dealer busted
			if (this.dealer.isBust()) {
				console.log("\nDealer busted. Player wins!");
				return; 
			} 
		}
		if (this.dealer.score === 21) console.log("\nBLACK JACK!");

		// Print the result of the game
		console.log("\nPlayer scored",this.player.score,"and Dealer scored",this.dealer.score,"\n");
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

let myGame: Game = new Game();
myGame.mainMenu();