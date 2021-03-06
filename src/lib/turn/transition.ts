import { nouns } from "../nouns";
import { adjectives } from "../adjectives";
import { drawTurn, guessTurn, selectTurn } from "./turn";
import type { treasury } from "./treasury";

export function randomDraw(turnNumber: number, t: treasury):drawTurn {
    let fixedL = nouns.length
    let optsL = adjectives.length
    let options: [number, number, number] = [0,0,0];
    let fixed: [number, number] = [0,0];
    while (options.length != new Set(options).size) {
        options = [Math.floor(Math.random() * optsL), Math.floor(Math.random() * optsL), Math.floor(Math.random() * optsL)]
    }
    while (fixed.length != new Set(fixed).size) {
        fixed = [Math.floor(Math.random() * fixedL), Math.floor(Math.random() * fixedL)]
    }
    
    return new drawTurn(turnNumber, t, fixed, options)
}

export function newSelect(draw: drawTurn, selection: [number, number]) {
    return new selectTurn(
        draw.turn + 1,
        draw.treasury,
        selection, draw.fixed,
        draw.options
    )
}

export function newGuess(select: selectTurn, guess: [number, number]) {
    return new guessTurn(
        select.turn + 1,
        select.treasury.nextAllocation(select.selection, guess, select.turn% 2 === 0).allocation,
        guess,
        select.selection,
        select.fixed,
        select.options
    )
}