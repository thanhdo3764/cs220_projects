"use strict";
class Gambler {
    constructor(name, balance, initialBet) {
        this.name = "";
        this._balance = 0;
        this._bet = 0;
        this._targetBalance = 0;
        this.name = name;
        this._balance = balance;
        this._bet = initialBet;
    }
    isFinished() {
        return this.hitTarget() || this.bankrupt();
    }
    hitTarget() {
        return this._balance >= this._targetBalance ? true : false;
    }
    bankrupt() {
        return this._balance <= 0 ? true : false;
    }
    get bet() { return this._bet; }
    get balance() { return this._balance; }
}
class StableGambler extends Gambler {
    constructor() {
        super(...arguments);
        this._targetBalance = 2 * this._balance;
    }
    updateBalance(moneyEarned) {
        this._balance += moneyEarned;
        if (this._bet > this._balance)
            this._bet = this._balance;
    }
}
class HighRiskGambler extends Gambler {
    constructor() {
        super(...arguments);
        this._targetBalance = 5 * this._balance;
        this._yoloAmount = 20;
    }
    updateBalance(moneyEarned) {
        this._balance += moneyEarned;
        this._balance > this._yoloAmount ? this._bet = this._balance / 2 : this._bet = this._balance;
    }
}
class StreakGambler extends Gambler {
    constructor(name, balance, initialBet, minBet, winMultiplier, lossMultiplier, targetBalance) {
        super(name, balance, initialBet);
        this._minBet = 0;
        this._winMultiplier = 1;
        this._lossMultiplier = 1;
        this._targetBalance = targetBalance;
        this._minBet = minBet;
        this._winMultiplier = winMultiplier;
        this._lossMultiplier = lossMultiplier;
    }
    updateBalance(moneyEarned) {
        this._balance += moneyEarned;
        if (moneyEarned <= 0) {
            this._bet *= this._lossMultiplier;
            if (this._bet < this._minBet)
                this._bet = this._minBet;
        }
        else {
            this._bet *= this._winMultiplier;
        }
        if (this._bet > this._balance)
            this._bet = this._balance;
    }
}
class Game {
    constructor(casino) {
        this.name = "";
        this.pot = 0;
        this.gameCasino = casino;
        this.players = new Map;
    }
    addPlayer(player, bet) {
        this.players.set(player, bet);
        this.pot += bet;
    }
    printStart() {
        console.log("-".repeat(this.name.length) + "\n" + this.name + "\n" + "-".repeat(this.name.length) + "\n");
        for (let [player, bet] of this.players) {
            console.log("\t" + player.name, "bets $" + bet);
        }
    }
    gameResultHelper(isWin, player, playerProfit) {
        player.updateBalance(playerProfit);
        if (isWin)
            console.log("\t" + player.name, "won $" + (playerProfit));
        else
            console.log("\t" + player.name, "lost!");
        this.gameCasino.addProfit(-1 * playerProfit);
        this.players.delete(player);
    }
}
class TailsIWin extends Game {
    constructor() {
        super(...arguments);
        this.name = "TAILS, I WIN";
    }
    simulateGame() {
        console.log();
        this.printStart();
        console.log();
        console.log("The dealer is flipping a coin...");
        let isHeads = !!Math.floor(Math.random() * 2);
        console.log("It's", isHeads ? "Heads!\n" : "Tails!\n");
        for (let [player, bet] of this.players) {
            let playerProfit = isHeads ? bet * 1.9 - bet : -1 * bet;
            this.gameResultHelper(isHeads, player, playerProfit);
        }
        console.log();
    }
}
class GuessTheNumber extends Game {
    constructor() {
        super(...arguments);
        this.name = "GUESS THE NUMBER";
    }
    simulateGame() {
        let casinoProfit = 0;
        console.log();
        this.printStart();
        console.log();
        console.log("The dealer is choosing a number...");
        let randomNumber = Math.floor(Math.random() * 5);
        console.log("The number was", randomNumber + "\n");
        for (let [player, bet] of this.players) {
            let playerGuess = Math.floor(Math.random() * 5);
            console.log(player.name, "guesses", playerGuess);
            let numbersMatch = playerGuess === randomNumber;
            let playerProfit = numbersMatch ? bet * 4.5 - bet : -1 * bet;
            this.gameResultHelper(numbersMatch, player, playerProfit);
        }
        console.log();
    }
}
class OffTrackGuineaPigRacing extends Game {
    constructor() {
        super(...arguments);
        this.name = "OFF-TRACK GUINEA PIG RACING";
    }
    simulateGame() {
        let casinoProfit = 0;
        let pigMultiplier = [1.9, 3.8, 7.6, 7.6];
        console.log();
        this.printStart();
        console.log();
        console.log("The pigs are off...");
        let randomPig = [0, 0, 0, 0, 1, 1, 2, 3][Math.floor(Math.random() * 8)];
        console.log("The winning pig was", randomPig + "\n");
        for (let [player, bet] of this.players) {
            let playerGuess = Math.floor(Math.random() * 4);
            console.log(player.name, "betted on pig", playerGuess);
            let numbersMatch = playerGuess === randomPig;
            let playerProfit = numbersMatch ? bet * pigMultiplier[playerGuess] - bet : -1 * bet;
            this.gameResultHelper(numbersMatch, player, playerProfit);
        }
        console.log();
    }
}
class Casino {
    constructor(maxRounds) {
        this._games = [
            new TailsIWin(this),
            new GuessTheNumber(this),
            new OffTrackGuineaPigRacing(this),
        ];
        this._profits = 0;
        this._gamblers = new Set([
            // Argument 2 is the amount they start with, 
            // Arg 3 is how much they bet
            new StableGambler("Alice", 100, 15),
            // Argument 2 is the amount they start with
            // Arg 3 is how much they start betting
            // the target is to make 5 times their starting balance, but 
            // you don't see that here because it's calculated inside the 
            // constructor instead of being passed as an argument.
            new HighRiskGambler("Bob", 50, 10),
            // Arg 4 is the minimum amount they will bet 
            // Arg 5 is how much they multiply their bet by when they win
            // Arg 6 is how much they multiply their bet by when they lose
            // Arg 7 is their target. How much they want to make. 
            new StreakGambler("Camille", 200, 10, 10, 2, 0.5, 500),
        ]);
        this._maxRounds = maxRounds;
        this._currentRound = 0;
    }
    /**
     * Add profit to the casino for the day.
     * @param amount The amount of profit to add. If negative, it counts as a
     * loss.
     */
    addProfit(amount) {
        this._profits += amount;
    }
    /** For each game: have each gambler who is still present play.
     * Starts by printing how much money each gambler has.
     * If a gambler runs out of money or hits their target, they leave.
     * Then, plays the game with all players.
     */
    simulateOneRound() {
        const startingProfit = this._profits;
        console.log("-----------------------");
        console.log("beginning round", this._currentRound);
        for (let game of this._games) {
            this.determineWhoIsStillPlaying();
            // add each player who is still playing to the game.
            // have them use the bet size determined by their personality.
            for (let player of this._gamblers) {
                game.addPlayer(player, player.bet);
            }
            const gameStartingProfit = this._profits;
            game.simulateGame();
            console.log("casino made", this._profits - gameStartingProfit, "on this game.");
            console.log();
        }
        console.log("round complete. casino made: ", this._profits - startingProfit);
        console.log("total profit:", this._profits);
        console.log("-----------------------");
    }
    /**
     * Run the simulation until either the maximum number of games is reached,
     * or no one is left in the casino.
     */
    simulate() {
        while (this._currentRound < this._maxRounds && this._gamblers.size > 0) {
            this.simulateOneRound();
            console.log();
            this._currentRound++;
        }
        console.log("simulation complete");
    }
    /**
     * Update and list the people who are still playing.
     */
    determineWhoIsStillPlaying() {
        const gamblersWhoLeft = [];
        // update and list of who is still playing
        for (let gambler of this._gamblers.keys()) {
            console.log(gambler.name, ": ", gambler.balance);
            if (gambler.isFinished()) {
                // add this person to the list of gamblers to remove.
                // don't remove it right away: removing an element from a 
                // collection that we are iterating over is usually a bad
                // idea.
                gamblersWhoLeft.push(gambler);
            }
            // now, print why the person left if they did so
            if (gambler.hitTarget()) {
                console.log(gambler.name, "has hit their target! They leave the casino...");
            }
            else if (gambler.bankrupt()) {
                console.log(gambler.name, "has gone bankrupt! They leave the casino...");
            }
        }
        // remove the gamblers who left from the set
        for (let leaver of gamblersWhoLeft) {
            this._gamblers.delete(leaver);
        }
    }
}
let x = new Casino(5);
x.simulate();
