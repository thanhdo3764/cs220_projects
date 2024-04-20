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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.cardString = String.fromCodePoint(0x1F000 | this.suit | this.rank);
    }
    renderCard() {
        let cardColor;
        (this.suit === Suit.Diamonds || this.suit === Suit.Hearts) ? cardColor = "red" : cardColor = "black";
        return <span style={{ color: cardColor }}>{this.cardString}</span>;
    }
}
class Player {
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
        this.handIndex = ++this.handIndex % this.hand.length;
    }
    /**
     * Check if the participant has an empty hand
     */
    hasWon() {
        return this.hand.length == 0;
    }
}
class GameState {
    constructor() {
        this.cardInHand = new Card(0x1F0A1);
        this.playerCards = [];
        this.topCard = new Card(0x1F0A1);
        this.changingSuit = false;
        this.whoseTurn = 0;
    }
}
class Game extends react_1.Component {
    constructor(props) {
        super(props);
        this.stock = [];
        this.pile = [];
        this.player = new Player("Player");
        this.participants = [];
        this.whoseTurn = 0;
        /**
         * Helper function to add delay between bot turns
         */
        this.delay = (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        this.participants.push(this.player);
        this.participants.push(new Player("Bot 1"));
        this.participants.push(new Player("Bot 2"));
        this.participants.push(new Player("Bot 3"));
        // Initialize gameDeck with all 52 cards
        for (let suit = 0xA0; suit <= 0xD0; suit += 0x10) {
            for (let rank = 0x01; rank <= 0x0E; rank += 0x01) {
                if (rank === 0x0C)
                    continue;
                this.stock.push(new Card(0x1F000 | suit | rank));
            }
        }
        this.shuffleStock();
        // Deal 5 cards to all participants
        for (let i = 0; i < 5; i++) {
            for (let p of this.participants) {
                p.add(this.dealCard());
            }
        }
        // Place a starter card
        let starter;
        while (true) {
            starter = this.stock.pop();
            this.pile.push(starter);
            if (starter.rank !== Rank.Eight)
                break;
        }
        // Set state
        let newState = new GameState();
        newState.cardInHand = this.player.hand[this.player.handIndex];
        newState.topCard = starter;
        newState.playerCards = this.player.hand;
        this.state = newState;
    }
    /**
     * Renders html whenever this.state changes
     */
    render() {
        let s = [];
        for (let card of this.state.playerCards) {
            s.push(card.renderCard());
        }
        return <div style={{ display: 'grid' }}>
            <h1>Crazy Eights</h1>
            <div className="topCard">
            	{this.state.topCard.renderCard()}
        	</div>
        	<div className="playerCards">
	            {this.state.cardInHand.renderCard()}
            </div>
            <div className="playerCards" style={{ display: 'block', margin: 'auto' }}>
            	{s}
            </div>
            <div style={{ display: 'block', margin: 'auto' }}>
            <input type="button" className="button" value="Play Card" disabled={!!this.state.whoseTurn} onClick={() => this.onClickPlay()}/>
            <input type="button" className="button" value="Cycle Card" disabled={!!this.state.whoseTurn} onClick={() => this.onClickCycle()}/>
            <input type="button" className="button" value="Draw Card" disabled={!!this.state.whoseTurn} onClick={() => this.onClickDraw()}/>
            </div>
            <div style={{ display: 'block', margin: 'auto' }}>
                <input type="button" className="suitButton" id="s" value="♠" disabled={!this.state.changingSuit} onClick={() => { this.switchSuit('s'); this.botTurn(); }}/>
                <input type="button" className="suitButton" id="c" value="♣" disabled={!this.state.changingSuit} onClick={() => { this.switchSuit('c'); this.botTurn(); }}/>
                <input type="button" className="suitButton" id="d" value="♦" disabled={!this.state.changingSuit} onClick={() => { this.switchSuit('d'); this.botTurn(); }}/>
                <input type="button" className="suitButton" id="h" value="♥" disabled={!this.state.changingSuit} onClick={() => { this.switchSuit('h'); this.botTurn(); }}/>
			</div>
			</div>;
    }
    /**
     * Shuffles the cards in stock
     */
    shuffleStock() {
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
        let card = new Card(0x1F000);
        switch (suitCmd) {
            case (0):
            case ('s'):
                card.suit = Suit.Spades;
                card.cardString = '♠';
                break;
            case (1):
            case ('c'):
                card.suit = Suit.Clubs;
                card.cardString = '♣';
                break;
            case (2):
            case ('d'):
                card.suit = Suit.Diamonds;
                card.cardString = '♦';
                break;
            case (3):
            case ('h'):
                card.suit = Suit.Hearts;
                card.cardString = '♥';
                break;
        }
        this.setState(() => ({ topCard: card, changingSuit: false }));
    }
    /**
     * Handles when the player clicks the "play card" button
     */
    onClickPlay() {
        let cardInQuestion = this.player.playCard(this.state.topCard.rank, this.state.topCard.suit);
        if (cardInQuestion === undefined) {
            return;
        }
        this.whoseTurn = 1;
        this.pile.push(cardInQuestion);
        this.setState(() => ({
            cardInHand: this.player.hand[this.player.handIndex],
            topCard: cardInQuestion,
            playerCards: this.player.hand,
            whoseTurn: 1,
        }));
        // Ask for suit if player played an Eight
        if (cardInQuestion.rank === Rank.Eight) {
            this.setState(() => ({ changingSuit: true }));
        }
        else if (this.player.hasWon()) {
            console.log("Player has won!");
            return;
        }
        else {
            this.botTurn();
        }
    }
    /**
     * Simulates a bot's turn after the player's turn or another bot's turn
     */
    botTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delay(1000);
            const bot = this.participants[this.whoseTurn];
            // Bot draws cards until it's playable
            while (!bot.hasPlayableCard(this.state.topCard.rank, this.state.topCard.suit))
                bot.add(this.dealCard());
            const cardInQuestion = bot.playCard(this.state.topCard.rank, this.state.topCard.suit);
            this.pile.push(cardInQuestion);
            this.whoseTurn = (++this.whoseTurn) % 4;
            this.setState(() => ({
                topCard: cardInQuestion,
                whoseTurn: this.whoseTurn,
            }));
            // If Bot played an Eight, choose a random suit
            if (cardInQuestion.rank === Rank.Eight)
                this.switchSuit(Math.floor(Math.random() * 4));
            if (bot.hasWon()) {
                console.log(bot.name, "has won!");
                return;
            }
            if (!!this.whoseTurn)
                this.botTurn();
        });
    }
    /**
     * Handles when "Cycle Card" button is clicked by
     * cycling to the next card in Player's hand
     */
    onClickCycle() {
        this.player.cycleCard();
        this.setState(() => ({
            cardInHand: this.player.hand[this.player.handIndex],
        }));
    }
    /**
     * Handles when "Draw Card" button is clicked and draws a card from stock
     */
    onClickDraw() {
        this.player.add(this.dealCard());
        this.setState(() => ({
            cardInHand: this.player.hand[this.player.handIndex],
            playerCards: this.player.hand,
        }));
    }
}
const rootElem = document.getElementById('root');
if (rootElem == null) {
    alert('you forgot to put a root element in your HTML file.');
}
const root = (0, client_1.createRoot)(rootElem);
root.render(<react_1.StrictMode>
        <Game />
    </react_1.StrictMode>);
