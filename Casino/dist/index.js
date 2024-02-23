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
    get balance() { return this._balance; }
    get bet() { return this._bet; }
}
class StableGambler extends Gambler {
    constructor() {
        super(...arguments);
        this._targetBalance = 2 * this._balance;
    }
    updateStatus(moneyEarned) {
        this._balance += moneyEarned;
    }
}
class HighRiskGambler extends Gambler {
    constructor() {
        super(...arguments);
        this._targetBalance = 5 * this._balance;
        this._yoloAmount = 10;
    }
    updateStatus(moneyEarned) {
        this._balance += moneyEarned;
        this.balance > this._yoloAmount ? this._bet = this._balance / 2 : this._bet = this.balance;
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
    updateStatus(moneyEarned) {
        this._balance += moneyEarned;
        if (moneyEarned === 0) {
            this._bet *= this._lossMultiplier;
            if (this.bet < this._minBet)
                this._bet = this._minBet;
        }
        else {
            this._bet *= this._winMultiplier;
        }
    }
}
class Game {
    constructor(casino) {
        this.name = "";
        this.players = new Map;
    }
    addPlayer(player, bet) {
        this.players.set(player, bet);
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
