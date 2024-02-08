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
        this.cardIndex = cardIndex;
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
        // Copy the cards in deck into tempDeck
        var tempDeck = [];
        tempDeck.concat(this.deck);
        // Empty deck
        this.deck = [];
        return tempDeck;
    };
    return Participant;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.gameDeck = [];
        // Initialize Dealer and Player
        this.dealer = new Participant("Dealer");
        this.player = new Participant("Player");
        // Initialize gameDeck with all 52 cards
        for (var i = 0; i < 52; i++) {
            this.gameDeck.push(new Card(i));
        }
        console.log("\n\n----  |    ---   --- |   /    -----  ---   --- |   /");
        console.log("|   | |   |   | |    |  /       |   |   | |    |  /");
        console.log("|---  |   |---| |    |--        |   |---| |    |-- ");
        console.log("|   | |   |   | |    |  \\       |   |   | |    |  \\");
        console.log("----  --- |   |  --- |   \\    --    |   |  --- |   \\\n\n");
    }
    Game.prototype.shuffle = function () {
        for (var i = 0; i < 100; i++) {
            var firstCardIndex = Math.floor(Math.random() * 52);
            var secondCardIndex = Math.floor(Math.random() * 52);
            var temp = this.gameDeck[firstCardIndex];
            this.gameDeck[firstCardIndex] = this.gameDeck[secondCardIndex];
            this.gameDeck[secondCardIndex] = temp;
        }
    };
    Game.prototype.hostGame = function () {
        this.shuffle();
        // Give Dealer 2 cards and print 1
        this.dealer.add(this.gameDeck.pop());
        this.dealer.add(this.gameDeck.pop());
        this.dealer.printStatus(true);
        console.log("\n");
        // Give Player 2 cards and print both
        this.player.add(this.gameDeck.pop());
        this.player.add(this.gameDeck.pop());
        this.player.printStatus(false);
        console.log("\n");
        // Keep playing until a win or bust for player
        while (this.player.score <= 21) {
            var move = "";
            // Keep asking for a valid input
            while (move != 'h' && move != 's') {
                move = readline.question("Type 'h' to hit or 's' to stay: ");
            }
            if (move === 's')
                break;
            var cardDealt = this.gameDeck.pop();
            this.player.add(cardDealt);
            console.log(this.player.name, "was dealt a", cardDealt.cardString + "\n");
            this.player.printStatus(false);
            console.log("\n");
        }
    };
    return Game;
}());
var x = new Game();
x.hostGame();
