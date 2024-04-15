"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    constructor(cardIndex) {
        this.cardString = "";
        // Calculate the rank and suit of the card
        this.suit = cardIndex & 0x0000F;
        this.rank = cardIndex & 0x000F0;
        // Convert card into a string
        this.cardString = String.fromCodePoint(0x1F000 | this.suit | this.rank);
    }
    /**
     *  Takes the cardString field and prints it to console
     */
    printCard() {
        console.log(this.cardString, Rank[cardRank], "of", Suit[cardSuit]);
    }
}
const cardBase = 0x1F000;
let cardSuit = Suit.Hearts;
let cardRank = Rank.King;
let c = new Card(cardBase | cardSuit | cardRank);
c.printCard();
