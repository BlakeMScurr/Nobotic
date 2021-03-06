export const startingPot = 12;
export class treasury {
    pot: number;
    a: number;
    b: number;

    constructor() {
        this.pot = startingPot;
        this.a = 0;
        this.b = 0;
    }

    burned():number {
        return startingPot - (this.a + this.b + this.pot)
    }

    equals(t: treasury):boolean {
        return this.pot === t.pot && this.a === t.a && this.b == t.b
    }

    nextAllocation(selection: [number, number], guess: [number, number], aIsSelector: boolean):{allocation: treasury, explanation: string} {
        let nextAllocation = new treasury()
        nextAllocation.pot = this.pot
        nextAllocation.a = this.a
        nextAllocation.b = this.b
        let explanation = ""
        nextAllocation.pot -= 2

        let consensuses = 0
        selection.forEach((selection: number, i: number) => {
            if (selection === guess[i]) consensuses++
        })

        let selectorDelta = 0
        let guesserDelta = 0

        let selector = aIsSelector?"A":"B"
        let guesser = aIsSelector?"B":"A"
        switch(consensuses) {
            case 0:
                explanation = `The players bungled it and couldn't agree on either word pair, so the coins are burned.`
                break
            case 1:
                selectorDelta += 2
                explanation = `Player ${selector} bamboozled Player ${guesser} by having them guess only one word pair, so ${selector} gets all the coins.`
                break
            // agreement
            case 2:
                selectorDelta++
                guesserDelta++
                explanation = `The players agreed on both word pairs so they split the coins.`
                break
            default:
                throw new Error(`dev error: it should only be possible to have 0 to 2 consensuses, got ${consensuses}`)
        }

        if (aIsSelector) {
            nextAllocation.a += selectorDelta
            nextAllocation.b += guesserDelta
        } else {
            nextAllocation.a += guesserDelta
            nextAllocation.b += selectorDelta
        }

        return {allocation: nextAllocation, explanation: explanation}
    }
    
    validRoundAllocation(allocation: treasury, selection: [number, number], guess: [number, number], aIsSelector: boolean) {
        let next = this.nextAllocation(selection, guess, aIsSelector)
        if (!allocation.equals(next.allocation)) {
            throw new Error(`Next allocation should be ${
                Object.keys(next).map((key) => {return key + ": " + next[key]})
            }, not ${
                Object.keys(allocation).map((key) => {return key + ": " + allocation[key]})
            }`)
        }
    }
}