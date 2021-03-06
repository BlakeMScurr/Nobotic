import { nouns } from "../nouns";
import { adjectives } from "../adjectives";
import { assertIndexInRange, assertNaturalNumber, assertNoRepeats, assertValidCardPair } from "./assertions/assertions";
import { treasury } from "./treasury";
import { plainToClass } from "class-transformer";

export type turn = nullTurn | drawTurn | selectTurn | guessTurn

// nullTurn represents that there is no game between two given addresses
export class nullTurn {
    turn: number;
    kind: string;
    treasury: treasury;
    constructor() {
        this.turn = 0
        this.kind = "null"
        this.treasury = new treasury()
    }

    assertValid() {}
    explain():string {
        return `There are no games between these players`
    }

    done():boolean {
        return false
    }
}


// A draw cards turn represents a random selection of a set of words from our two word lists
export class drawTurn {
    // existing state
    turn: number
    treasury: treasury
    kind: string

    // new state
    fixed: [number, number]
    options: [number, number, number]

    constructor(turn: number, treasury: treasury, fixed: [number, number], options: [number, number, number]) {
        this.options = options
        this.fixed = fixed
        this.turn = turn
        this.treasury = treasury
        this.kind = "draw"
    }

    // the fixed and asserts must be sets of unique natural numbers
    assertValid() {
        assertNoRepeats(this.fixed)
        assertNoRepeats(this.options)
        this.fixed.forEach((i: number) => { assertIndexInRange(i, nouns) })
        this.options.forEach((i: number) => { assertIndexInRange(i, adjectives) })
        this.fixed.concat(this.options).forEach((i: number) => { assertNaturalNumber(i) })
    }

    explain():string {
        return `The fixed words randomly chosen for this round were ${this.wordsOf(this.fixed, nouns)} and the options randomly chosen for this round were ${this.wordsOf(this.options, adjectives)}`
    }

    // Util function to find the words represented by indices
    private wordsOf(indices: Array<number>, wordList: Array<string>):string {
        return "[" + indices.map((i) => {return `"${wordList[i]}"`}).join(", ") + "]"
    }

    done():boolean {
        return false
    }
}

export class selectTurn {
    // existing state
    turn: number
    treasury: treasury
    fixed: [number, number]
    options: [number, number, number]
    kind: string

    // new state
    selection: [number, number];
    
    constructor(turn: number, treasury: treasury, selection: [number, number], fixed: [number, number], options: [number, number, number]) {
        this.selection = selection;

        this.turn = turn
        this.treasury = treasury
        this.fixed = fixed
        this.options = options
        this.kind = "select"
    }

    assertValid() {
        assertValidCardPair(this.selection)
    }

    explain():string {
        return `Player ${1 + (this.turn % 2)} has selected their word pairings.`
    }

    done():boolean {
        return false
    }
}

export class guessTurn {
    // existing state
    turn: number
    treasury: treasury
    selection: [number, number]
    fixed: [number, number]
    options: [number, number, number]
    kind: string;
 
    // new state
    guess: [number, number]

    constructor(turn: number, treasury: treasury, guess: [number, number], selection: [number, number], fixed: [number, number], options: [number, number, number]) {
        this.guess = guess

        this.turn = turn
        this.treasury = treasury
        this.fixed = fixed
        this.options = options
        this.selection = selection
        this.kind = "guess"
    }

    assertValid() {
        assertValidCardPair(this.guess)
    }

    explain():string {
        // note that in order to find the number of the last player we add 1 rather than subtracting 1. The two are equivalent in proper modular arithmetic, but in JS
        // -1 % 2 === -1, so we have to add 1, which relies on the (correct) assumption that play always alternates each turn.
        return `Player ${1 + ((this.turn + 1)% 2)} selected (${nouns[this.fixed[0]]}, ${adjectives[this.options[this.selection[0]]]}) and (${nouns[this.fixed[1]]}, ${adjectives[this.options[this.selection[1]]]}) for their word pairings.
Player ${1 + (this.turn % 2)} guessed that the word pairings were (${nouns[this.fixed[0]]}, ${adjectives[this.options[this.guess[0]]]}) and (${nouns[this.fixed[1]]}, ${adjectives[this.options[this.guess[1]]]}).
` + this.treasury.nextAllocation(this.selection, this.guess, (this.turn%2+1) === 0).explanation
    }


    done():boolean {
        return this.treasury.pot <= 0
    }
}

export function castTurn(obj):turn {
    let t: turn
    switch(obj.kind) {
        case "null":
            t = plainToClass(nullTurn, obj)
            break
        case "draw":
            t = plainToClass(drawTurn, obj)
            break
        case "select":
            t = plainToClass(selectTurn, obj)
            break
        case "guess":
            t = plainToClass(guessTurn, obj)
            break
        default:
            throw new Error(`Invalid turn kind ${obj.kind}`)
    }

    t.treasury = plainToClass(treasury, t.treasury)
    return t
}