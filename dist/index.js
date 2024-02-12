"use strict";
/**
 * Thanh Do
 * Aiden Dickson
 * 14 February 2024
 * Project 1: Black Jack
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
var Rank;
(function (Rank) {
    Rank[Rank["Ace"] = 0] = "Ace";
    Rank[Rank["Two"] = 1] = "Two";
    Rank[Rank["Three"] = 2] = "Three";
    Rank[Rank["Four"] = 3] = "Four";
    Rank[Rank["Five"] = 4] = "Five";
    Rank[Rank["Six"] = 5] = "Six";
    Rank[Rank["Seven"] = 6] = "Seven";
    Rank[Rank["Eight"] = 7] = "Eight";
    Rank[Rank["Nine"] = 8] = "Nine";
    Rank[Rank["Ten"] = 9] = "Ten";
    Rank[Rank["Jack"] = 10] = "Jack";
    Rank[Rank["Queen"] = 11] = "Queen";
    Rank[Rank["King"] = 12] = "King";
})(Rank || (Rank = {}));
var Suit;
(function (Suit) {
    Suit[Suit["Spades"] = 0] = "Spades";
    Suit[Suit["Clubs"] = 1] = "Clubs";
    Suit[Suit["Diamonds"] = 2] = "Diamonds";
    Suit[Suit["Hearts"] = 3] = "Hearts";
})(Suit || (Suit = {}));
class Card {
    /**
     * Initializes cardValue and cardString by using a passed index
     * to calculate the card's rank and suit. The rank then determines
     * the cardValue.
     *
     * The rank and suit of the card is converted into a string
     * that initializes cardString.
     */
    constructor(cardIndex) {
        this.cardValue = 0;
        this.cardString = "";
        // Calculate the rank and suit of the card
        let cardRank = (cardIndex % 13);
        let cardSuit = Math.floor(cardIndex / 13);
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
        this.cardString = Rank[cardRank] + " of " + Suit[cardSuit];
    }
    /**
     *  Takes the cardString field and prints it to console
     */
    printCard() {
        console.log(this.cardString);
    }
}
class Participant {
    constructor(name) {
        this.name = "";
        this.deck = [];
        this.score = 0;
        this.numberOfAces = 0;
        this.name = name;
    }
    /**
     * Takes a card object and pushes it to the deck field,
     * updates the comma-separated deckString field with the card's string,
     * increases the score by the card's value, and it takes into account
     * for busts by decreasing the value of aces by 10.
     */
    add(card) {
        // Add card to deck
        this.deck.push(card);
        // Update score
        this.score += card.cardValue;
        if (card.cardValue == 11)
            this.numberOfAces++;
        // Downgrade any aces if it's a bust
        if (this.isBust() && this.numberOfAces > 0) {
            this.numberOfAces--;
            this.score -= 10;
            ;
        }
    }
    /**
     * Takes a boolean parameter to check if some print elements should
     * be hidden. If hidden is false, print the name, cards, and score.
     * If hidden is true, print the name and one card.
     */
    printStatus(hidden) {
        if (hidden) {
            console.log(this.name + "'s Cards:");
            this.deck[0].printCard();
            console.log("Hidden Card");
        }
        else {
            console.log(this.name + "'s Cards:");
            for (let card of this.deck) {
                card.printCard();
            }
            console.log(this.name + "'s Score:", this.score);
        }
    }
    /**
     * Sets all fields to their default values. The cards that were in
     * the deck will be returned as a Card[] array so that it can
     * be pushed back into the gameDeck.
     */
    reset() {
        this.score = 0;
        this.numberOfAces = 0;
        // Copy the cards in deck into tempDeck
        let tempDeck = this.deck;
        // Empty deck
        this.deck = [];
        return tempDeck;
    }
    /**
     * Returns a boolean that checks if this object has busted.
     * A bust is true if the score is above 21 points,
     * otherwise, bust is false.
     */
    isBust() {
        return this.score > 21;
    }
}
class Game {
    /**
     * Creates two Participant objects: the dealer and the player.
     * The field gameDeck is initialize by pushing 52 Card objects
     * into the array. Then a title screen for Black Jack is printed.
     */
    constructor() {
        this.gameDeck = [];
        this.discardedCards = [];
        // Initialize Dealer and Player
        this.dealer = new Participant("Dealer");
        this.player = new Participant("Player");
        // Initialize gameDeck with all 52 cards
        for (let i = 0; i < 52; i++) {
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
    shuffle() {
        // Choose two random cards and swap. Repeat 100 times.
        for (let i = 0; i < 100; i++) {
            let firstCardIndex = Math.floor(Math.random() * 52);
            let secondCardIndex = Math.floor(Math.random() * 52);
            let temp = this.gameDeck[firstCardIndex];
            this.gameDeck[firstCardIndex] = this.gameDeck[secondCardIndex];
            this.gameDeck[secondCardIndex] = temp;
        }
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
    mainMenu() {
        while (true) {
            console.log("\n-------------------\n     MAIN MENU\n-------------------");
            let option = "";
            while (option !== 'q' && option !== 'p') {
                option = readline_sync_1.default.question("Type 'p' to play a game or 'q' to quit: ");
            }
            // Quit mainMenu if q is entered
            if (option === 'q')
                return;
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
    hostGame() {
        console.log("\n-------------------\nSTARTING GAME . . .\n-------------------\n");
        // Give Dealer 2 cards and print 1
        this.dealer.add(this.gameDeck.pop());
        this.dealer.add(this.gameDeck.pop());
        this.dealer.printStatus(true);
        // Give Player 2 cards and print both
        console.log("\n");
        this.player.add(this.gameDeck.pop());
        this.player.add(this.gameDeck.pop());
        this.player.printStatus(false);
        // Player's turn
        console.log("\n-------------------\n   PLAYER'S TURN\n-------------------");
        while (this.player.score !== 21) {
            console.log("");
            let move = "";
            // Keep asking for a valid input
            while (move != 'h' && move != 's') {
                move = readline_sync_1.default.question("Type 'h' to hit or 's' to stay: ");
            }
            if (move === 's')
                break;
            // Add card to player's deck
            let cardDealt = this.gameDeck.pop();
            this.player.add(cardDealt);
            console.log("Player was dealt a", cardDealt.cardString + "\n");
            this.player.printStatus(false);
            // Stop game if player busted
            if (this.player.isBust()) {
                console.log("\nPlayer busted. Dealer wins!");
                return;
            }
        }
        if (this.player.score === 21)
            console.log("\nBLACK JACK!");
        // Dealer's turn
        console.log("\n-------------------\n   DEALER'S TURN\n-------------------\n");
        this.dealer.printStatus(false);
        while (this.dealer.score < 17) {
            // Add card to dealer's deck
            let cardDealt = this.gameDeck.pop();
            this.dealer.add(cardDealt);
            console.log("\nDealer was dealt a", cardDealt.cardString + "\n");
            this.dealer.printStatus(false);
            // Stop game if dealer busted
            if (this.dealer.isBust()) {
                console.log("\nDealer busted. Player wins!");
                return;
            }
        }
        if (this.dealer.score === 21)
            console.log("\nBLACK JACK!");
        // Print the result of the game
        console.log("\nPlayer scored", this.player.score, "and Dealer scored", this.dealer.score, "\n");
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
let myGame = new Game();
myGame.mainMenu();
