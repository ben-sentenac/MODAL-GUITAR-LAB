import { describe, it, expect } from "vitest";
import { getIntervalLabel, getIntervalSemitones, getScaleComparisonStatus, getTonicName, isCharacteristicInterval, isNoteInScale, type ScaleComparisonStatus, type ScaleName } from "./scales";


describe('getTonicName', () => {
    it('returns the right name given the tonic number', () => {
        expect(getTonicName(78)).toBe('F#');
        expect(getTonicName(40)).toBe('E');
        expect(getTonicName(0)).toBe('C');
        expect(getTonicName(127)).toBe('G');
    });
    it('throws when invalid midi range', () => {
        expect(() => getTonicName(128)).throw('MIDI note must be an integer between 0 and 127');
    });
});
describe('isNoteInScale', () => {
    it('returns true, if given F is in the E phrygian scale', () => {
        expect(isNoteInScale(41, 40, 'phrygian')).toBe(true);
    });
    it('returns true, if given C# is in the E dorian scale', () => {
        expect(isNoteInScale(49, 40, 'dorian')).toBe(true);
    });
    it('returns true, if given F is in the A minor scale', () => {
        expect(isNoteInScale(41, 45, 'minor')).toBe(true);
    });
    it('returns true, if given E is in the F major scale', () => {
        expect(isNoteInScale(52, 41, 'major')).toBe(true);
    });

    it('returns false, if given F# is in the E phrygian scale', () => {
        expect(isNoteInScale(42, 40, 'phrygian')).toBe(false);
    });
    it('returns false, if given c is in the E dorian scale', () => {
        expect(isNoteInScale(48, 40, 'dorian')).toBe(false);
    });
    it('returns false, if given F# is in the A minor scale', () => {
        expect(isNoteInScale(42, 45, 'minor')).toBe(false);
    });
    it('returns false, if given D# is in the F major scale', () => {
        expect(isNoteInScale(51, 41, 'major')).toBe(false);
    });
    it('throws a range error when midiNote is 128', () => {
        expect(() => isNoteInScale(128, 41, 'major')).toThrow(RangeError);
    });
    it('throws a range error when midiNote is -1', () => {
        expect(() => isNoteInScale(40, -1, 'major')).toThrow(RangeError);
    });
});
describe('getIntervalSemiTones', () => {
    it('returns the right interval semitones given the tonic and a midi note', () => {
        expect(getIntervalSemitones(58, 40)).toBe(6);
    });
    it('retuns the right intervals no matters the ocatve', () => {
        const e2cSharp3 = getIntervalSemitones(40, 49);
        const e3cSharp4 = getIntervalSemitones(52, 61);
        expect(e2cSharp3).toBe(e3cSharp4);
        expect(e2cSharp3).toEqual(9);
    });
    it('return the same interval when tonic transposed up one octave', () => {
        expect(getIntervalSemitones(40, 49)).toBe(9);
        expect(getIntervalSemitones(52, 49)).toBe(9);
    });
});

describe('getIntervalLabel', () => {
    it('returns the right interval label given a tonic and a midi note', () => {
        expect(getIntervalLabel(40, 43)).toBe('b3');
        expect(getIntervalLabel(48, 52)).toBe('3');
        expect(getIntervalLabel(52, 43)).toBe('b3');
    });
    it.each([
        [40, 43, 'b3'],
        [52, 55, 'b3'],
        [52, 43, 'b3']]
    )('returns %s for tonic %i et note %i', (tonicMidi, noteMidi, expectedInterval) => {
        expect(getIntervalLabel(tonicMidi, noteMidi)).toBe(expectedInterval);
    });
});

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

    const cases: [
        ScaleComparisonStatus,
        number,
        number,
        ScaleName,
        ScaleName
    ][] = [
            ['comparison-only', 40, 48, "dorian", "minor"],
            ['main-only', 40, 49, "dorian", "minor"],
            ['common', 40, 52, "dorian", "minor"],
            ['outside', 40, 53, "dorian", "minor"]
        ]

    it.each(cases)('returns %s  when reverse comparison dorian/minor', (expectedStatus, tonicMidi, noteMidi, mainScale, comparisonScale) => {
        expect(getScaleComparisonStatus(tonicMidi, noteMidi, mainScale, comparisonScale)).toBe(expectedStatus)
    });
});
