import { nouns } from "../nouns";
import { adjectives } from "../adjectives";
import { assertIndexInRange, assertNaturalNumber, assertNoRepeats, assertValidCardPair } from "./assertions";
import type { treasury } from "./treasury";

export type turn = drawTurn | selectTurn | guessTurn | doneTurn

// A draw cards turn represents a random selection of a set of words from our two word lists
export class drawTurn {
    // existing state
    turn: number;
    treasury: treasury;

    // new state
    fixed: [number, number];
    options: [number, number, number];

    constructor(turn: number, treasury: treasury, fixed: [number, number], options: [number, number, number]) {
        this.options = options
        this.fixed = fixed
        this.turn = turn
        this.treasury = treasury
    }

    // the fixed and asserts must be sets of unique natural numbers
    assertValid() {
        assertNoRepeats(this.fixed)
        assertNoRepeats(this.options)
        this.fixed.forEach((i: number) => { assertIndexInRange(i, nouns) })
        this.options.forEach((i: number) => { assertIndexInRange(i, adjectives) })
        this.fixed.concat(this.options).forEach((i: number) => { assertNaturalNumber(i) })
    }

    kind():string { return "draw" }

    explain():string {
        return `The fixed words randomly chosen for this round were ${this.wordsOf(this.fixed, nouns)} and the options randomly chosen for this round were ${this.wordsOf(this.options, adjectives)}`
    }

    // Util function to find the words represented by indices
    private wordsOf(indices: Array<number>, wordList: Array<string>):string {
        return "[" + indices.map((i) => {return `"${wordList[i]}"`}).join(", ") + "]"
    }
}

export class selectTurn {
    // existing state
    turn: number;
    treasury: treasury;
    fixed: [number, number];
    options: [number, number, number];    

    // new state
    selection: [number, number];
    
    constructor(turn: number, treasury: treasury, selection: [number, number], fixed: [number, number], options: [number, number, number]) {
        this.selection = selection;

        this.turn = turn
        this.treasury = treasury
        this.fixed = fixed;
        this.options = options;
    }

    assertValid() {
        assertValidCardPair(this.selection)
    }

    kind():string { return "select" }

    explain():string {
        return `Player ${1 + (this.turn % 2)} selected (${nouns[0]}, ${adjectives[this.selection[0]]}) and (${nouns[1]}, ${adjectives[this.selection[1]]}) for their word pairings.`
    }
}

export class guessTurn {
    // existing state
    turn: number;
    treasury: treasury;
    selection: [number, number];
    fixed: [number, number];
    options: [number, number, number];    
 
    // new state
    guess: [number, number];

    constructor(turn: number, treasury: treasury, guess: [number, number], selection: [number, number], fixed: [number, number], options: [number, number, number]) {
        this.guess = guess

        this.turn = turn
        this.treasury = treasury
        this.fixed = fixed;
        this.options = options;
        this.selection = selection;
    }

    assertValid() {
        assertValidCardPair(this.guess)
    }

    kind():string { return "guess" }

    explain():string {
        // note that in order to find the number of the last player we add 1 rather than subtracting 1. The two are equivalent in proper modular arithmetic, but in JS
        // -1 % 2 === -1, so we have to add 1, which relies on the (correct) assumption that play always alternates each turn.
        return `Player ${1 + ((this.turn + 1)% 2)} selected (${nouns[0]}, ${adjectives[this.selection[0]]}) and (${nouns[1]}, ${adjectives[this.selection[1]]}) for their word pairings.
Player ${1 + (this.turn % 2)} guessed that the word pairings were (${nouns[0]}, ${adjectives[this.guess[0]]}) and (${nouns[1]}, ${adjectives[this.guess[1]]}).`
    }
}

export class doneTurn {
    turn: number;
    treasury: treasury;

    constructor(turn: number, treasury: treasury) {
        this.turn = turn
        this.treasury = treasury;
    }

    assertValid(){}

    kind():string { return "done" }

    explain():string {
        return `The game ended with ${this.treasury.a} coins for Player 1, ${this.treasury.b} coins for Player 2, and ${this.treasury.burned()} coins burned.`
    }
}