import { describe, it, expect } from "vitest";
import { isCharacteristicInterval } from "./scales";


describe('isCharacteristicInterval', () => {
    it('find the major six of dorian mode', () => {
        expect(isCharacteristicInterval(40, 49, "dorian")).toBe(true);
    });
    it('not find the major six of dorian mode', () => {
        expect(isCharacteristicInterval(40, 48, "dorian")).toBe(false);
    });
    it('return false if characteristic interval is not defined yet', () => {
        expect(isCharacteristicInterval(40, 48, "phrygian")).toBe(false);
    });
});
