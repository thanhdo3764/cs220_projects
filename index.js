"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var Game = /** @class */ (function () {
    function Game() {
        this.gameDeck = [];
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
        var dealerCards = [];
        var playerCards = [];
        var dealerScore = 0;
        var playerScore = 0;
        var playerCardsString = "";
        // Give Dealer 2 cards and print 1
        for (var i = 0; i < 2; i++) {
            var card = this.gameDeck.pop();
            dealerCards.push(card);
            dealerScore += card.cardValue;
        }
        console.log("\nDealer's Cards: " + dealerCards[0].cardString + " and one hidden card");
        // Give Player 2 cards and print both
        for (var i = 0; i < 2; i++) {
            var card = this.gameDeck.pop();
            playerCards.push(card);
            playerScore += card.cardValue;
            playerCardsString += card.cardString + ", ";
        }
        console.log("\nPlayer's Cards: " + playerCardsString);
        console.log("Player's Score: " + playerScore);
    };
    return Game;
}());
var x = new Game();
x.hostGame();
