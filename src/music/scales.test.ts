import { describe, it, expect } from "vitest";
import { getScaleComparisonStatus, isCharacteristicInterval } from "./scales";


describe('isCharacteristicInterval', () => {
    it('returns true for the major sixth in dorian mode', () => {
        expect(isCharacteristicInterval(40, 49, "dorian")).toBe(true);
    });
    it('returns false for the minor sixth in dorian mode', () => {
        expect(isCharacteristicInterval(40, 48, "dorian")).toBe(false);
    });
    it('returns true for the minor second in phrygian mode', () => {
        expect(isCharacteristicInterval(40, 41, "phrygian")).toBe(true);
    });
    it('returns true for the minor 6 in the minor mode', () => {
        expect(isCharacteristicInterval(40, 48, "minor")).toBe(true);
    });
    it('returns true for the minor seventh in the minor mode', () => {
        expect(isCharacteristicInterval(40, 50, "minor")).toBe(true);
    });
    it('returns true for the fourth in the major mode', () => {
        expect(isCharacteristicInterval(40, 45, "major")).toBe(true);
    })
    it('returns true for the major seventh in the major mode', () => {
        expect(isCharacteristicInterval(40, 51, "major")).toBe(true);
    })
});

describe("getScaleComparisonStatus", () => {
    it("returns common for the tonic shared by minor and dorian", () => {
        expect(getScaleComparisonStatus(40, 52, "minor", "dorian")).toBe("common");
    });
    it("returns main-only when the note is only in the minor", () => {
        expect(getScaleComparisonStatus(40, 48, "minor", "dorian")).toBe("main-only");
    });
    it("returns comparison-only when the note not in minor but in the dorian", () => {
        expect(getScaleComparisonStatus(40, 49, "minor", "dorian")).toBe("comparison-only");
    });
    it("returns outside when the note is outside minor and dorian scale", () => {
        expect(getScaleComparisonStatus(40, 53, "minor", "dorian")).toBe("outside");
    });

});
