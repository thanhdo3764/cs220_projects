"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
var Rank;
(function (Rank) {
    Rank[Rank["Ace"] = 1] = "Ace";
    Rank[Rank["Two"] = 2] = "Two";
    Rank[Rank["Three"] = 3] = "Three";
    Rank[Rank["Four"] = 4] = "Four";
    Rank[Rank["Five"] = 5] = "Five";
    Rank[Rank["Six"] = 6] = "Six";
    Rank[Rank["Seven"] = 7] = "Seven";
    Rank[Rank["Eight"] = 8] = "Eight";
    Rank[Rank["Nine"] = 9] = "Nine";
    Rank[Rank["Ten"] = 10] = "Ten";
    Rank[Rank["Jack"] = 11] = "Jack";
    Rank[Rank["Queen"] = 13] = "Queen";
    Rank[Rank["King"] = 14] = "King";
})(Rank || (Rank = {}));
var Suit;
(function (Suit) {
    Suit[Suit["Spades"] = 160] = "Spades";
    Suit[Suit["Clubs"] = 208] = "Clubs";
    Suit[Suit["Diamonds"] = 192] = "Diamonds";
    Suit[Suit["Hearts"] = 176] = "Hearts";
})(Suit || (Suit = {}));
class Card {
    constructor(cardIndex) {
        this.cardString = "";
        // Calculate the rank and suit of the card
        this.suit = cardIndex & 0x000F0;
        this.rank = cardIndex & 0x0000F;
        // Convert card into a string
        this.cardString = String.fromCodePoint(0x1F000 | this.suit | this.rank) + " " + Rank[this.rank] + " of " + Suit[this.suit];
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
        this.hand = [];
        this.handIndex = 0;
        this.name = name;
    }
    /**
     * Sets the handIndex to a playable card depending on the given
     * rank and suit and returns true or false otherwise
     */
    hasPlayableCard(rank, suit) {
        // Loops through the hand to find a playable card
        for (let i = 0; i < this.hand.length; i++) {
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
    playCard(rank, suit) {
        let cardInHand = this.hand[this.handIndex];
        // If the card has the same suit, rank, or is an eight, play card.
        if (cardInHand.suit === suit || cardInHand.rank === rank || cardInHand.rank === Rank.Eight) {
            let removedCard = this.hand.splice(this.handIndex, 1);
            this.handIndex = 0;
            console.log(this.name, "played a", removedCard[0].cardString);
            return removedCard[0];
        }
        return undefined;
    }
    /**
     * Add a card to hand, and set the handIndex to this card
     */
    add(card) {
        this.hand.push(card);
        this.handIndex = this.hand.length - 1;
    }
    /**
     * Cycles to the next card in hand
     */
    cycleCard() {
        this.handIndex++;
        if (this.handIndex >= this.hand.length)
            this.handIndex = 0;
        console.log(this.name, "is holding the", this.hand[this.handIndex].cardString);
    }
    /**
     * Check if the participant has an empty hand
     */
    hasWon() {
        return this.hand.length == 0;
    }
    /**
     * Print the cards in hand
     */
    printHand() {
        console.log(this.name + "'s Cards:");
        for (let card of this.hand) {
            card.printCard();
        }
    }
}
class Game {
    constructor() {
        this.stock = [];
        this.pile = [];
        this.participants = [];
        this.topCard = this.pile[0];
        this.turn = 0;
        this.participants.push(new Participant("Player"));
        this.participants.push(new Participant("Bot 1"));
        this.participants.push(new Participant("Bot 2"));
        this.participants.push(new Participant("Bot 3"));
        // Initialize gameDeck with all 52 cards
        for (let suit = 0xA0; suit <= 0xD0; suit += 0x10) {
            for (let rank = 0x01; rank <= 0x0E; rank += 0x01) {
                if (rank === 0x0C)
                    continue;
                this.stock.push(new Card(0x1F000 | suit | rank));
            }
        }
        this.shuffleStock();
        console.log("-------------");
        console.log("Crazy Eight's");
        console.log("-------------\n");
    }
    /**
     * Shuffles the cards in stock
     */
    shuffleStock() {
        // Choose two random cards and swap. Repeat 51 times.
        for (let i = 0; i < 51; i++) {
            let firstCardIndex = Math.floor(Math.random() * this.stock.length);
            let secondCardIndex = Math.floor(Math.random() * this.stock.length);
            let temp = this.stock[firstCardIndex];
            this.stock[firstCardIndex] = this.stock[secondCardIndex];
            this.stock[secondCardIndex] = temp;
        }
    }
    /**
     * Returns the top card from the stock. If stock was empty, take all
     * but the top card from the pile and shuffle it into the stock
     */
    dealCard() {
        if (this.stock.length === 0) {
            this.stock = this.pile.splice(0, this.pile.length - 1);
            this.shuffleStock();
        }
        return this.stock.pop();
    }
    /**
     * Take a command to return a card with that suit.
     * To be used when an Eight is played.
     */
    switchSuit(suitCmd) {
        switch (suitCmd) {
            case (0):
            case ('s'):
                console.log("\nThe suit was switched to Spades!");
                return new Card(0x1F000 | 0xA0);
            case (1):
            case ('c'):
                console.log("\nThe suit was switched to Clubs!");
                return new Card(0x1F000 | 0xD0);
            case (2):
            case ('d'):
                console.log("\nThe suit was switched to Diamonds!");
                return new Card(0x1F000 | 0xC0);
            case (3):
            case ('h'):
                console.log("\nThe suit was switched to Hearts!");
                return new Card(0x1F000 | 0xB0);
        }
        return new Card(0x1F000 | 0xA0);
    }
    onClickPlay() {
        // Player Turn
        const player = this.participants[0];
        let cardInQuestion = player.playCard(this.topCard.rank, this.topCard.suit);
        if (cardInQuestion === undefined) {
            return false;
        }
        this.topCard = cardInQuestion;
        this.pile.push(this.topCard);
        // Ask for suit if player played an Eight
        if (this.topCard.rank === Rank.Eight) {
            let newCmd = '';
            while (newCmd !== 's' && newCmd !== 'c' && newCmd !== 'd' && newCmd !== 'h') {
                newCmd = readline_sync_1.default.question("Type (s)pades or (c)lubs or (d)iamonds or (h)earts: ");
            }
            this.topCard = this.switchSuit(newCmd);
        }
        if (player.hasWon()) {
            console.log("Player has won!");
            return true;
        }
        //Bots' Turn
        for (let i = 1; i < 4; i++) {
            let bot = this.participants[i];
            // Bot draws cards until it's playable
            while (!bot.hasPlayableCard(this.topCard.rank, this.topCard.suit))
                bot.add(this.dealCard());
            this.topCard = bot.playCard(this.topCard.rank, this.topCard.suit);
            this.pile.push(this.topCard);
            // If Bot played an Eight, choose a random suit
            if (this.topCard.rank === Rank.Eight)
                this.topCard = this.switchSuit(Math.floor(Math.random() * 4));
            if (bot.hasWon()) {
                console.log(bot.name, "has won!");
                return true;
            }
        }
        return false;
    }
    onClickCycle() {
        this.participants[0].cycleCard();
    }
    onClickDraw() {
        let cardDealt = this.dealCard();
        this.participants[0].add(cardDealt);
        console.log("Player was dealt the", cardDealt.cardString);
    }
    /**
     * Simulates a game of Crazy Eights
     */
    hostGame() {
        // Deal 5 cards to all participants
        for (let i = 0; i < 5; i++) {
            for (let p of this.participants) {
                p.add(this.dealCard());
            }
        }
        // Place a starter card 
        while (true) {
            this.topCard = this.stock.pop();
            this.pile.push(this.topCard);
            if (this.topCard.rank !== Rank.Eight)
                break;
        }
        let player = this.participants[0];
        // Loop through the participants' turn
        let cmd = '';
        let hasWinner = false;
        while (!hasWinner) {
            console.log("\nTop card is", this.topCard.cardString);
            player.printHand();
            console.log("\nPlayer is holding the", player.hand[player.handIndex].cardString);
            // Ask for command
            cmd = readline_sync_1.default.question("Type (p)lace or (c)ycle or (d)raw: ");
            switch (cmd) {
                case ('p'):
                    hasWinner = this.onClickPlay();
                    break;
                case ('c'):
                    this.onClickCycle();
                    break;
                case ('d'):
                    this.onClickDraw();
                    break;
            }
        }
    }
    printGameStatus() {
        console.log("Card's in stock:");
        for (let card of this.stock) {
            card.printCard();
        }
        console.log("");
        console.log("Card's in pile:");
        for (let card of this.pile) {
            card.printCard();
        }
        console.log("");
        for (let p of this.participants) {
            p.printHand();
            console.log();
        }
    }
}
let g = new Game();
g.hostGame();
g.printGameStatus();
