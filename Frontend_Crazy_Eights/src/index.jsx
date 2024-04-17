"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const react_1 = __importStar(require("react"));
const client_1 = require("react-dom/client");
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
    /**
     * Simulates the player's turn by asking for input until a card
     * is played. Return the card or suit played.
     */
    playerTurn(p, topCard) {
        let cmd = '';
        while (cmd !== 'p') {
            // Ask for command
            cmd = readline_sync_1.default.question("Type (p)lace or (c)ycle or (d)raw: ");
            switch (cmd) {
                case ('p'):
                    // Re-ask question if card was unplayable
                    let cardInQuestion = p.playCard(topCard.rank, topCard.suit);
                    if (cardInQuestion === undefined) {
                        cmd = '';
                        break;
                    }
                    topCard = cardInQuestion;
                    this.pile.push(topCard);
                    // Ask for suit if player played an Eight
                    if (topCard.rank === Rank.Eight) {
                        let newCmd = '';
                        while (newCmd !== 's' && newCmd !== 'c' && newCmd !== 'd' && newCmd !== 'h') {
                            newCmd = readline_sync_1.default.question("Type (s)pades or (c)lubs or (d)iamonds or (h)earts: ");
                        }
                        topCard = this.switchSuit(newCmd);
                    }
                    break;
                case ('c'):
                    p.cycleCard();
                    break;
                case ('d'):
                    p.add(this.dealCard());
                    console.log("Player was dealt the", p.hand[p.hand.length - 1].cardString);
                    break;
            }
        }
        return topCard;
    }
    /**
     * Simulates a game of Crazy Eights
     */
    hostGame() {
        let topCard;
        // Deal 5 cards to all participants
        for (let i = 0; i < 5; i++) {
            for (let p of this.participants) {
                p.add(this.dealCard());
            }
        }
        // Place a starter card 
        while (true) {
            topCard = this.stock.pop();
            this.pile.push(topCard);
            if (topCard.rank !== Rank.Eight)
                break;
        }
        // Loop until there is a winner
        let hasWinner = false;
        while (!hasWinner) {
            // Loop through the participants' turn
            for (let p of this.participants) {
                console.log("\nTop card is", topCard.cardString);
                // Player's Turn
                if (p.name === "Player") {
                    p.printHand();
                    console.log("\nPlayer is holding the", p.hand[p.handIndex].cardString);
                    // Question player for card to add
                    topCard = this.playerTurn(p, topCard);
                    // Bots' Turn
                }
                else {
                    // Bot draws cards until it's playable
                    while (!p.hasPlayableCard(topCard.rank, topCard.suit))
                        p.add(this.dealCard());
                    topCard = p.playCard(topCard.rank, topCard.suit);
                    this.pile.push(topCard);
                    // If Bot played an Eight, choose a random suit
                    if (topCard.rank === Rank.Eight)
                        topCard = this.switchSuit(Math.floor(Math.random() * 4));
                }
                if (p.hasWon()) {
                    console.log(p.name, "has won!");
                    hasWinner = true;
                    break;
                }
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
class MyListState {
    constructor() {
        this.nClicks = 0;
    }
}
class MyList extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = new MyListState();
        this.addClick = this.addClick.bind(this);
    }
    render() {
        var _a;
        const children = react_1.default.Children.toArray(this.props.children);
        const result = [];
        const nChildren = (_a = this.props.maxItems) !== null && _a !== void 0 ? _a : children.length;
        for (let child = 0; child < Math.min(nChildren, children.length); child++) {
            result.push(children[child]);
        }
        result.push(<li>You have clicked {this.state.nClicks} times.</li>);
        return <ul onClick={this.addClick}>{result}</ul>;
    }
    addClick() {
        let newState = new MyListState();
        newState.nClicks = this.state.nClicks + 1;
        this.setState(newState);
    }
}
class App extends react_1.Component {
    render() {
        return <div>
            <p>Crazy Eights</p>
            <MyList maxItems={2}>
                <li>one</li>
                <li>two</li>
                <li>three</li>
            </MyList>
        </div>;
    }
}
const rootElem = document.getElementById('root');
if (rootElem == null) {
    alert('you forgot to put a root element in your HTML file.');
}
const root = (0, client_1.createRoot)(rootElem);
root.render(<react_1.StrictMode>
        <App />
    </react_1.StrictMode>);
let g = new Game();
g.hostGame();
g.printGameStatus();
