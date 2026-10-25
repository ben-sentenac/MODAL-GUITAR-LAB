import { describe, it, expect } from "vitest";
import { isCharacteristicInterval } from "./scales";


describe('isCharacteristicInterval', () => {
    it('find the major six of dorian mode', () => {
        expect(isCharacteristicInterval(40, 49, "dorian")).toBe(true);
    });
    it('not find the major six of dorian mode', () => {
        expect(isCharacteristicInterval(40, 48, "dorian")).toBe(false);
    });
    it('must find the minor second in phrygian mode', () => {
        expect(isCharacteristicInterval(40, 41, "phrygian")).toBe(true);
    });
    it('must find the minor 6 of the minor mode', () => {
        expect(isCharacteristicInterval(40, 48, "minor")).toBe(true);
    });
    it('must find the minor 6 of the minor mode', () => {
        expect(isCharacteristicInterval(40, 50, "minor")).toBe(true);
    });
    it('must find the 4 of the major mode', () => {
        expect(isCharacteristicInterval(40, 44, "major")).toBe(true);
    })
    it('must find the major 7 of the major mode', () => {
        expect(isCharacteristicInterval(40, 51, "major")).toBe(true);
    })
});
