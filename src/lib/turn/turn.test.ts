import { randomDraw } from "./transition"
import { treasury } from "./treasury"
import { drawTurn, guessTurn, selectTurn } from "./turn"

// Card drawing turn tests
test("drawCardsTurn.constructor", ()=> {
    expect(()=>{new drawTurn(0, new treasury(), [0, 0], [0, 1, 2]).assertValid()}).toThrow("repeated index")
    expect(()=>{new drawTurn(0, new treasury(), [1, 1], [0, 1, 2]).assertValid()}).toThrow("repeated index")
    expect(()=>{new drawTurn(0, new treasury(), [0, 1], [0, 0, 1]).assertValid()}).toThrow("repeated index")
    expect(()=>{new drawTurn(0, new treasury(), [0, 1], [0, 1, 0]).assertValid()}).toThrow("repeated index")
    expect(()=>{new drawTurn(0, new treasury(), [0, 1], [1, 0, 0]).assertValid()}).toThrow("repeated index")
    expect(()=>{new drawTurn(0, new treasury(), [0, -1], [0, 1, 2]).assertValid()}).toThrow("negative index -1")
    expect(()=>{new drawTurn(0, new treasury(), [0, 0.5], [0, 1, 2]).assertValid()}).toThrow("non integer index 0.5")
    // max index tests asssume a given word list length
    expect(()=>{new drawTurn(0, new treasury(), [1525, 1], [0, 1, 2]).assertValid()}).toThrow("index 1525 out of range (max 1524)")
    expect(()=>{new drawTurn(0, new treasury(), [1524, 1], [0, 1, 2]).assertValid()}).not.toThrow()
    expect(()=>{new drawTurn(0, new treasury(), [0, 1], [1347, 1, 2]).assertValid()}).toThrow("index 1347 out of range (max 1346)")
    expect(()=>{new drawTurn(0, new treasury(), [0, 1], [1346, 1, 2]).assertValid()}).not.toThrow()
})

test("drawCardsTurn.explain", ()=> {
    expect(new drawTurn(0, new treasury(), [0, 1], [0, 1, 2]).explain()).toBe(`The fixed words randomly chosen for this round were ["people", "history"] and the options randomly chosen for this round were ["abandoned", "able", "absolute"]`)
})

test("randomDraw", () => {
    for (let i = 0; i < 100; i++) {
        expect(() => { randomDraw(0, new treasury()) }).not.toThrow()
    }
})

// select turn tests
test("selectTurn.explain", () => {
    expect(new selectTurn(0, new treasury(), [0, 1], [0, 1], [0, 1, 2]).explain()).toBe(
        "Player 1 has selected their word pairings."
    )
})

// guess turn tests
test("guessTurn.explain", () => {
    expect(new guessTurn(0, new treasury(), [0, 1], [0, 1], [0, 1], [0, 1, 2]).explain()).toBe(
`Player 2 selected (people, abandoned) and (history, able) for their word pairings.
Player 1 guessed that the word pairings were (people, abandoned) and (history, able).
The players agreed on both word pairs so they split the coins.`
    )
})