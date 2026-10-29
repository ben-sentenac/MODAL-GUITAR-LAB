import { describe, it, expect } from 'vitest';
import { addSoloNote, computeTabCells, computeTabColumns, getNextStartBeat } from './solo';
import type { SoloNote } from '../GuitarNeck';

describe('addSoloNote', () => {
    it('returns array contain note without modify the original array', () => {
        const solo: SoloNote[] = [];
        const note: SoloNote = {
            stringPos: 1,
            fret: 3,
            startBeat: 0,
            durationBeats: 1
        };

        const updatedSolo = addSoloNote(solo, note);
        expect(updatedSolo).toEqual([note]);
        expect(updatedSolo).not.toBe(solo);
    });
});

describe('getNextStartBeat', () => {
    it('returns 0 when empty array', () => {
        expect(getNextStartBeat([])).toBe(0);
    });
    it('returns the rigth startBeat value', () => {
        const solo: SoloNote[] = [{
            stringPos: 1,
            fret: 3,
            startBeat: 0,
            durationBeats: 1.5
        }];

        expect(getNextStartBeat(solo)).toBe(1.5);
    })
});


describe('computeTabCells', () => {
    it('returns the rigth tabCell structure', () => {
        const note: SoloNote = {
            stringPos: 2,
            fret: 5,
            startBeat: 0,
            durationBeats: 1
        };

        expect(computeTabCells(note, 6)).toEqual(["-", "5", "-", "-", "-", "-"]);
    });
});
describe('computeTabColumns', () => {
    it('returns an array of tabCells', () => {
        const solo: SoloNote[] = [
            { stringPos: 2, fret: 5, startBeat: 0, durationBeats: 1 },
            { stringPos: 1, fret: 3, startBeat: 1, durationBeats: 1 },
            { stringPos: 6, fret: 0, startBeat: 2, durationBeats: 1 }
        ];

        const result = [
            ["-", "5", "-", "-", "-", "-"],
            ["3", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "0"]
        ];

        expect(computeTabColumns(solo)).toEqual(result);
    });
});
