"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline-sync");
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
var Card = /** @class */ (function () {
    function Card(cardIndex) {
        // Calculate the rank and suit of the card
        var cardRank = (cardIndex % 13);
        var cardSuit = Math.floor(cardIndex / 13);
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
    Card.prototype.printCard = function () {
        console.log(this.cardString);
    };
    return Card;
}());
var Participant = /** @class */ (function () {
    function Participant(name) {
        this.name = "";
        this.deck = [];
        this.deckString = "";
        this.score = 0;
        this.numberOfAces = 0;
        this.name = name;
    }
    Participant.prototype.add = function (card) {
        // Add a comma to separate cards in deckString
        if (this.deck.length !== 0)
            this.deckString += ", ";
        this.deckString += card.cardString;
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
    };
    Participant.prototype.printStatus = function (hidden) {
        if (hidden)
            console.log(this.name + "'s Cards:", this.deck[0].cardString, "and one hidden card");
        else {
            console.log(this.name + "'s Cards:", this.deckString, "\n" + this.name + "'s Score:", this.score);
        }
    };
    Participant.prototype.reset = function () {
        this.deckString = "";
        this.score = 0;
        this.numberOfAces = 0;
        // Copy the cards in deck into tempDeck
        var tempDeck = this.deck;
        // Empty deck
        this.deck = [];
        return tempDeck;
    };
    Participant.prototype.isBust = function () {
        return this.score > 21;
    };
    return Participant;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.gameDeck = [];
        this.discardedCards = [];
        // Initialize Dealer and Player
        this.dealer = new Participant("Dealer");
        this.player = new Participant("Player");
        // Initialize gameDeck with all 52 cards
        for (var i = 0; i < 52; i++) {
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
    Game.prototype.shuffle = function () {
        // Choose two random cards and swap. Repeat 100 times.
        for (var i = 0; i < 100; i++) {
            var firstCardIndex = Math.floor(Math.random() * 52);
            var secondCardIndex = Math.floor(Math.random() * 52);
            var temp = this.gameDeck[firstCardIndex];
            this.gameDeck[firstCardIndex] = this.gameDeck[secondCardIndex];
            this.gameDeck[secondCardIndex] = temp;
        }
    };
    Game.prototype.mainMenu = function () {
        var _a, _b, _c;
        while (true) {
            var option = "";
            while (option !== 'q' && option !== 'p') {
                option = readline.question("Type 'p' to play a game or 'q' to quit: ");
            }
            // Quit mainMenu if q is entered
            if (option === 'q')
                return;
            // Put cards used last game into discardedCards
            (_a = this.discardedCards).push.apply(_a, this.player.reset());
            (_b = this.discardedCards).push.apply(_b, this.dealer.reset());
            // Re-add discardedCards to gameDeck and shuffle
            if (this.gameDeck.length < 30) {
                (_c = this.gameDeck).push.apply(_c, this.discardedCards);
                this.shuffle();
                this.discardedCards = [];
            }
            this.hostGame();
        }
    };
    Game.prototype.hostGame = function () {
        console.log("\n-------------------\nStarting Game . . .\n-------------------\n");
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
        console.log("\n-------------------\n   Player's Turn\n-------------------");
        while (this.player.score !== 21) {
            console.log("");
            var move = "";
            // Keep asking for a valid input
            while (move != 'h' && move != 's') {
                move = readline.question("Type 'h' to hit or 's' to stay: ");
            }
            if (move === 's')
                break;
            // Add card to player's deck
            var cardDealt = this.gameDeck.pop();
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
        console.log("\n-------------------\n   Dealer's Turn\n-------------------\n");
        this.dealer.printStatus(false);
        while (this.dealer.score < 17) {
            // Add card to dealer's deck
            var cardDealt = this.gameDeck.pop();
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
    };
    return Game;
}());
var myGame = new Game();
myGame.mainMenu();
