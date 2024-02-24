"use strict";
class Gambler {
    /**
     * Initializes all but _targetBalance because it will be initialized
     * by children classes.
     */
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
    /**
     * The moneyEarned argument is added to the balance.
     * It doesn't allow the next bet to be more than the gambler has.
     */
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
        this._yoloAmount = 50;
    }
    /**
     * Updates balance, and the next bet will be half of the current balance.
     * But bet the rest of the balance if it's less than _yoloAmount.
     */
    updateBalance(moneyEarned) {
        this._balance += moneyEarned;
        this._balance > this._yoloAmount ? this._bet = this._balance / 2 : this._bet = this._balance;
    }
}
class StreakGambler extends Gambler {
    /**
     * Initializes the same argument as gambler and 4 additional arguments.
     * _minBet is the minimum bet allowed.
     * _winMultiplier is the bet multiplier for a win.
     * _lossMultiplier is the bet multiplier for a loss.
     */
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
    /**
     * Updates balance. The next bet will be multiplied depending if the
     * moneyEarned was a gain or loss. The balance must be greater than
     * the bet, which must be greater than the minBet.
     */
    updateBalance(moneyEarned) {
        this._balance += moneyEarned;
        if (moneyEarned <= 0) {
            this._bet *= this._lossMultiplier;
        }
        else {
            this._bet *= this._winMultiplier;
        }
        if (this._bet < this._minBet)
            this._bet = this._minBet;
        if (this._bet > this._balance)
            this._bet = this._balance;
    }
}
class MartingaleGambler extends Gambler {
    /**
     * Initializes the same argument as gambler and 4 additional arguments.
     * _minBet is the minimum bet allowed.
     * _winMultiplier is the bet multiplier for a win.
     * _lossMultiplier is the bet multiplier for a loss.
     */
    constructor(name, balance, initialBet, lossMultiplier, targetBalance) {
        super(name, balance, initialBet);
        this._lossMultiplier = 1;
        this._targetBalance = targetBalance;
        this._lossMultiplier = lossMultiplier;
    }
    /**
     * Updates balance. The next bet will be multiplied depending if the
     * moneyEarned was a gain or loss. The balance must be greater than the bet.
     */
    updateBalance(moneyEarned) {
        this._balance += moneyEarned;
        if (moneyEarned <= 0)
            this._bet *= this._lossMultiplier;
        if (this._bet > this._balance)
            this._bet = this._balance;
    }
}
class Game {
    constructor(casino) {
        this.name = "";
        this.gameCasino = casino;
        this.players = new Map;
    }
    addPlayer(player, bet) {
        this.players.set(player, bet);
    }
    /**
     * Prints out the name of the game and the list of players and their bets.
     * This method is used at the start of simulateGame();
     */
    printStart() {
        console.log("-".repeat(this.name.length) + "\n" + this.name + "\n" + "-".repeat(this.name.length) + "\n");
        for (let [player, bet] of this.players) {
            console.log("\t" + player.name, "bets $" + bet);
        }
    }
    /**
     * Updates the players and casino money, and the profit
     * results are printed for the player. This method should be
     * used in simulateGame.
     */
    gameResultHelper(isWin, player, playerProfit) {
        player.updateBalance(playerProfit);
        if (isWin)
            console.log("\t" + player.name, "won $" + (playerProfit));
        else
            console.log("\t" + player.name, "lost!");
        this.gameCasino.addProfit(-playerProfit);
        this.players.delete(player);
    }
}
class TailsIWin extends Game {
    constructor() {
        super(...arguments);
        this.name = "TAILS, I WIN";
    }
    /**
     * Players win if it's Heads. Tails is a loss.
     */
    simulateGame() {
        console.log();
        // Prints game name and book
        this.printStart();
        console.log();
        console.log("The dealer is flipping a coin...");
        // Chooses 0 or 1, where 0 is heads and 1 is tails
        const isHeads = !!Math.floor(Math.random() * 2);
        console.log("It's", isHeads ? "Heads!\n" : "Tails!\n");
        // Calculates and prints the game's result for each player
        for (let [player, bet] of this.players) {
            const playerProfit = isHeads ? bet * 0.9 : -bet;
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
    /**
     * Players must each make a guess. They win if they choose the
     * same number as the dealer.
     */
    simulateGame() {
        console.log();
        // Prints game name and book
        this.printStart();
        console.log();
        console.log("The dealer is choosing a number...");
        // Chooses a random integer between 0 and 4, inclusively
        const randomNumber = Math.floor(Math.random() * 5);
        console.log("The number was", randomNumber + "\n");
        // Calculates and prints the game's result for each player
        for (let [player, bet] of this.players) {
            // Player chooses from 0 to 4
            const playerGuess = Math.floor(Math.random() * 5);
            console.log(player.name, "guesses", playerGuess);
            const numbersMatch = playerGuess === randomNumber;
            // Player will gain profit if numbersMatch is true
            const playerProfit = numbersMatch ? bet * 3.5 : -bet;
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
    /**
     * The players that choose the correct winning pig wins.
     */
    simulateGame() {
        // The index represents the pig, and the value is the bet multiplier
        const pigMultiplier = [0.9, 2.8, 6.6, 6.6];
        console.log();
        // Prints game name and book
        this.printStart();
        console.log();
        console.log("The pigs are off...");
        // Chooses a random index in array of pigs to be chosen.
        // The repeated pigs simulate the pigs chance to win.
        const randomPig = [0, 0, 0, 0, 1, 1, 2, 3][Math.floor(Math.random() * 8)];
        console.log("The winning pig was", randomPig + "\n");
        // Calculates and prints the game's result for each player
        for (let [player, bet] of this.players) {
            // Player chooses a random pig from 0 to 3.
            const playerGuess = Math.floor(Math.random() * 4);
            console.log(player.name, "betted on pig", playerGuess);
            const numbersMatch = playerGuess === randomPig;
            // If Player guess the right pig, their profit increases depending on the pig
            const playerProfit = numbersMatch ? bet * pigMultiplier[playerGuess] : -bet;
            this.gameResultHelper(numbersMatch, player, playerProfit);
        }
        console.log();
    }
}
class GuessHigher extends Game {
    constructor() {
        super(...arguments);
        this.name = "GUESS HIGHER";
    }
    /**
     * Players must guess a number that's higher than the dealer's.
     * They closer the number, the more profit. If it's higher by 15,
     * they also lose.
     */
    simulateGame() {
        console.log();
        // Prints game name and book
        this.printStart();
        console.log();
        console.log("The dealer is choosing a number...");
        // Chooses a random integer between 0 and 99, inclusively
        const randomNumber = Math.floor(Math.random() * 100);
        console.log("The number was", randomNumber + "\n");
        // Calculates and prints the game's result for each player
        for (let [player, bet] of this.players) {
            // Player chooses from 0 to 99
            const playerGuess = Math.floor(Math.random() * 100);
            console.log(player.name, "guesses", playerGuess);
            let isWin = true;
            let playerProfit = -bet;
            const guessDifference = playerGuess - randomNumber;
            // Multiplies profit depending on how close the guess was
            switch (true) {
                case (guessDifference < 0 || guessDifference > 15):
                    isWin = false;
                    break;
                case (guessDifference == 0):
                    playerProfit = bet * 10.2;
                    break;
                case (guessDifference <= 5):
                    playerProfit = bet * 6.6;
                    break;
                case (guessDifference <= 15):
                    playerProfit = bet * 2.8;
                    break;
            }
            this.gameResultHelper(isWin, player, playerProfit);
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
            new GuessHigher(this)
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
            new HighRiskGambler("Bob", 1000, 10),
            // Arg 4 is the minimum amount they will bet 
            // Arg 5 is how much they multiply their bet by when they win
            // Arg 6 is how much they multiply their bet by when they lose
            // Arg 7 is their target. How much they want to make. 
            new StreakGambler("Camille", 200, 10, 10, 4, 0.5, 500),
            // Arg 4 is the loss multiplier
            // Arg 5 is the target
            new MartingaleGambler("Kevin", 300, 10, 2, 500)
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
            if (this._gamblers.size <= 0)
                break;
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
let x = new Casino(100);
x.simulate();
