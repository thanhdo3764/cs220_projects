var Rank;
(function (Rank) {
    Rank[Rank["Ace"] = (1 | "one")] = "Ace";
    Rank[Rank["Two"] = void 0] = "Two";
    Rank[Rank["Three"] = void 0] = "Three";
    Rank[Rank["Four"] = void 0] = "Four";
    Rank[Rank["Five"] = void 0] = "Five";
    Rank[Rank["Six"] = void 0] = "Six";
    Rank[Rank["Seven"] = void 0] = "Seven";
    Rank[Rank["Eight"] = void 0] = "Eight";
    Rank[Rank["Nine"] = void 0] = "Nine";
    Rank[Rank["Ten"] = void 0] = "Ten";
    Rank[Rank["Jack"] = void 0] = "Jack";
    Rank[Rank["Queen"] = void 0] = "Queen";
    Rank[Rank["King"] = void 0] = "King";
})(Rank || (Rank = {}));
var Suit;
(function (Suit) {
    Suit["Spades"] = "Spades";
    Suit["Clubs"] = "Clubs";
    Suit["Diamonds"] = "Diamonds";
    Suit["Hearts"] = "Hearts";
})(Suit || (Suit = {}));
var Card = /** @class */ (function () {
    function Card() {
        this.cardRank = Math.floor((Math.random() * 13) + 1);
        var randomInt = Math.floor(Math.random() * 4);
        switch (randomInt) {
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
    Card.prototype.printCard = function () {
        var str = this.cardSuit;
        console.log((this.cardRank + " of %s", str));
    };
    return Card;
}());
var Deck = /** @class */ (function () {
    function Deck() {
    }
    return Deck;
}());
var x = new Card();
x.printCard();
