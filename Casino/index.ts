abstract class Gambler {
    readonly name: string = "";
    protected _balance: number = 0;
    protected _bet: number = 0;
    protected _targetBalance: number = 0;


    constructor(name: string, balance: number, initialBet: number) {
        this.name = name;
        this._balance = balance;
        this._bet = initialBet;
    }

    isFinished():boolean {
        return this.hitTarget() || this.bankrupt();
    }

    hitTarget():boolean {
        return this._balance >= this._targetBalance ? true : false;
    }

    bankrupt():boolean {
        return this._balance <= 0 ? true : false;
    }

    abstract updateStatus(moneyEarned: number): void;

    get balance(): number{return this._balance}
    get bet(): number{return this._bet}
}

class StableGambler extends Gambler {

    _targetBalance = 2 * this._balance;

    updateStatus(moneyEarned: number): void {
        this._balance += moneyEarned;
    }

}

class HighRiskGambler extends Gambler {

    _targetBalance = 5 * this._balance;
    private _yoloAmount = 10;

    updateStatus(moneyEarned: number): void {
        this._balance += moneyEarned;
        this.balance > this._yoloAmount ? this._bet = this._balance/2 : this._bet = this.balance;
    }

}

class StreakGambler extends Gambler {

    private _minBet = 0;
    private _winMultiplier = 1;
    private _lossMultiplier = 1;

    constructor(
        name: string,
        balance: number,
        initialBet: number,
        minBet: number,
        winMultiplier: number,
        lossMultiplier: number,
        targetBalance: number) {

        super(name, balance, initialBet);
        this._targetBalance = targetBalance;
        this._minBet = minBet;
        this._winMultiplier = winMultiplier;
        this._lossMultiplier = lossMultiplier;
    }

    updateStatus(moneyEarned: number): void {
        this._balance += moneyEarned;
        if (moneyEarned === 0) {
            this._bet *= this._lossMultiplier;
            if (this.bet < this._minBet) this._bet = this._minBet;
        } else {
            this._bet *= this._winMultiplier;
        }
    }
}

abstract class Game {
    
    readonly name: string = "";

    protected players: Map<Gambler, number>;

    constructor(casino: Casino) {
        this.players = new Map<Gambler, number>;
    }

    addPlayer(player:Gambler, bet:number): void {
        this.players.set(player, bet);
    }

    abstract simulateGame(): void;
}

class Casino {
    /** a list of games offered in the casino */
    private _games: Game[];      

    /** a set of guests to the casino */
    private _gamblers: Set<Gambler>;

    /** how much money the casino made today */
    private _profits: number; 

    /** the maximum number of rounds to play */
    private _maxRounds: number;
    private _currentRound: number;

    public constructor( maxRounds: number ) {
        this._games = [
            new TailsIWin( this ),
            new GuessTheNumber( this ),
            new OffTrackGuineaPigRacing( this ),
        ];

        this._profits = 0;

        this._gamblers = new Set([
            // Argument 2 is the amount they start with, 
            // Arg 3 is how much they bet
            new StableGambler( "Alice", 100, 15 ),

            // Argument 2 is the amount they start with
            // Arg 3 is how much they start betting
            // the target is to make 5 times their starting balance, but 
            // you don't see that here because it's calculated inside the 
            // constructor instead of being passed as an argument.
            new HighRiskGambler( "Bob", 50, 10 ),

            // Arg 4 is the minimum amount they will bet 
            // Arg 5 is how much they multiply their bet by when they win
            // Arg 6 is how much they multiply their bet by when they lose
            // Arg 7 is their target. How much they want to make. 
            new StreakGambler( "Camille", 200, 10, 10, 2, 0.5, 500 ),
        ]);

        this._maxRounds = maxRounds;
        this._currentRound = 0;
    }

    

    /**
     * Add profit to the casino for the day.
     * @param amount The amount of profit to add. If negative, it counts as a
     * loss.
     */
    public addProfit( amount: number ): void {
        this._profits += amount;
    }

    /** For each game: have each gambler who is still present play.
     * Starts by printing how much money each gambler has. 
     * If a gambler runs out of money or hits their target, they leave.
     * Then, plays the game with all players.
     */
    public simulateOneRound(): void {
        const startingProfit = this._profits;

        console.log( "-----------------------" );
        console.log( "beginning round", this._currentRound );
        for( let game of this._games ) {
            this.determineWhoIsStillPlaying();

            // add each player who is still playing to the game.
            // have them use the bet size determined by their personality.
            for( let player of this._gamblers ) {
                game.addPlayer( player, player.bet );
            }

            const gameStartingProfit = this._profits;
            game.simulateGame();
            console.log( 
                "casino made", 
                this._profits - gameStartingProfit, "on this game.")
            console.log();
        }
        console.log( 
            "round complete. casino made: ", this._profits - startingProfit );
        console.log( "total profit:", this._profits );
        console.log( "-----------------------" );
    }

    /**
     * Run the simulation until either the maximum number of games is reached,
     * or no one is left in the casino.
     */
    public simulate(): void {
        while( this._currentRound < this._maxRounds && this._gamblers.size > 0 ) {
            this.simulateOneRound();
            console.log();
            this._currentRound++;
        }

        console.log( "simulation complete" );
    }

    /**
     * Update and list the people who are still playing.
     */
    private determineWhoIsStillPlaying() {
        const gamblersWhoLeft: Gambler[] = [];
        
        // update and list of who is still playing
        for( let gambler of this._gamblers.keys() ) {
            console.log( gambler.name, ": ", gambler.balance );
            
            if( gambler.isFinished() ) {
                // add this person to the list of gamblers to remove.
                // don't remove it right away: removing an element from a 
                // collection that we are iterating over is usually a bad
                // idea.
                gamblersWhoLeft.push( gambler );
            }

            // now, print why the person left if they did so
            if( gambler.hitTarget() ) {
                console.log( 
                    gambler.name, 
                    "has hit their target! They leave the casino..."
                );
            }
            else if( gambler.bankrupt() ) {
                console.log( 
                    gambler.name,
                    "has gone bankrupt! They leave the casino..."
                );
            }
        }

        // remove the gamblers who left from the set
        for( let leaver of gamblersWhoLeft ) {
            this._gamblers.delete( leaver );
        }
    }
}