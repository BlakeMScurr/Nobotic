import { randomWordSelect } from "./transition"
import { treasury } from "./treasury"
import { drawCardsTurn } from "./turn"

// Card drawing turn tests
test("drawCardsTurn.constructor", ()=> {
    expect(()=>{new drawCardsTurn(0, new treasury(), [0, 0], [0, 1, 2])}).toThrow("repeated index")
    expect(()=>{new drawCardsTurn(0, new treasury(), [1, 1], [0, 1, 2])}).toThrow("repeated index")
    expect(()=>{new drawCardsTurn(0, new treasury(), [0, 1], [0, 0, 1])}).toThrow("repeated index")
    expect(()=>{new drawCardsTurn(0, new treasury(), [0, 1], [0, 1, 0])}).toThrow("repeated index")
    expect(()=>{new drawCardsTurn(0, new treasury(), [0, 1], [1, 0, 0])}).toThrow("repeated index")
    expect(()=>{new drawCardsTurn(0, new treasury(), [0, -1], [0, 1, 2])}).toThrow("negative index -1")
    expect(()=>{new drawCardsTurn(0, new treasury(), [0, 0.5], [0, 1, 2])}).toThrow("non integer index 0.5")
    // max index tests asssume a given word list length
    expect(()=>{new drawCardsTurn(0, new treasury(), [1525, 1], [0, 1, 2])}).toThrow("index 1525 out of range (max 1524)")
    expect(()=>{new drawCardsTurn(0, new treasury(), [1524, 1], [0, 1, 2])}).not.toThrow()
    expect(()=>{new drawCardsTurn(0, new treasury(), [0, 1], [1347, 1, 2])}).toThrow("index 1347 out of range (max 1346)")
    expect(()=>{new drawCardsTurn(0, new treasury(), [0, 1], [1346, 1, 2])}).not.toThrow()
})

test("drawCardsTurn.explain", ()=> {
    expect(new drawCardsTurn(0, new treasury(), [0, 1], [0, 1, 2]).explain()).toBe(`The fixed words randomly chosen for this round were ["people", "history"] and the options randomly chosen for this round were ["abandoned", "able", "absolute"]`)
})

test("randomWordSelect", () => {
    for (let i = 0; i < 100; i++) {
        expect(() => { randomWordSelect(0) }).not.toThrow()
    }
})

// Selection turn tests