import { describe, it, expect } from "vitest";
import { checkMidiRange, getFullNoteName, getMidiNote, getNoteName, getOctave, midiToFrequency } from "./notes";

describe('checkMidiRange', () => {
    it('throws a RangeError if argument is not an integer between 0 and 127 inclusive', () => {
        const message = 'MIDI note must be an integer between 0 and 127';
        expect(() => checkMidiRange(-1)).toThrow(RangeError);
        expect(() => checkMidiRange(1.5)).toThrow(message);
        expect(() => checkMidiRange(128)).toThrow(message);
        expect(() => checkMidiRange(NaN)).toThrow(message);
        expect(() => checkMidiRange(Infinity)).toThrow(message);
        expect(() => checkMidiRange(-Infinity)).toThrow(message);
    });
    it('not throws a RangeError for 0 and 127', () => {
        expect(() => checkMidiRange(0)).not.toThrow();
        expect(() => checkMidiRange(127)).not.toThrow();
    })
});

describe('getMidiNote', () => {
    it('returns the right midi note when add open string midi and fret number', () => {
        expect(getMidiNote(40, 3)).toBe(43);
    });
});

describe('getNoteName', () => {
    it('returns the rigth note name from given number', () => {
        expect(getNoteName(44)).toBe('G#');
        expect(getNoteName(52)).toBe('E');
        expect(getNoteName(0)).toBe('C');
        expect(getNoteName(127)).toBe('G');
    });

    it('trhows when invalid midi range', () => {
        expect(() => getNoteName(128)).throw('MIDI note must be an integer between 0 and 127');
    });
});
describe('getOctave', () => {
    it('returns the rigth ocatve number from given number', () => {
        expect(getOctave(44)).toBe(2);
        expect(getOctave(78)).toBe(5);
        expect(getOctave(127)).toBe(9);
        expect(getOctave(0)).toBe(-1);
    });

    it('trhows when invalid midi range', () => {
        expect(() => getOctave(128)).throw('MIDI note must be an integer between 0 and 127');
    });
});
describe('getFullNoteName', () => {
    it('returns the rigth note name from given number', () => {
        expect(getFullNoteName(40)).toBe('E2');
        expect(getFullNoteName(78)).toBe('F#5');
        expect(getFullNoteName(127)).toBe('G9');
        expect(getFullNoteName(0)).toBe('C-1');
    });

    it('trhows when invalid midi range', () => {
        expect(() => getFullNoteName(128)).throw('MIDI note must be an integer between 0 and 127');
    });
});

describe('midiToFrequency', () => {
    const cases:[number,RangeErrorConstructor][] = [
        [128,RangeError],
        [-1,RangeError],
        [NaN,RangeError],
        [Infinity,RangeError],
        [-Infinity,RangeError]
    ]
    it.each(cases)('throws RangeError for invalid MIDI values', (number,errorType) => {
        expect(() => midiToFrequency(number)).toThrow(errorType);
    });
    it.each(
        [
            [40,82.41],
            [57,220],
            [69,440],
            [81,880]
        ]
    )('must return the rigth frequency', (midi,freq) => {
        expect(midiToFrequency(midi)).toBeCloseTo(freq);
    });
});
