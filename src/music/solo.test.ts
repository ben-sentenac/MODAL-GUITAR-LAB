import { describe, it, expect } from 'vitest';
import { addSoloNote, computeTabCells, computeTabColumns, getNextStartBeat, computeTimeGrid, getNotesAtBeat, getSoloEndBeat } from './solo';
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


describe('computeTimeGrid', () => {
    it('returns the right grid structure', () => {
        expect(computeTimeGrid(4, 1)).toEqual([0, 1, 2, 3, 4]);
        expect(computeTimeGrid(4, 0.5)).toEqual([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]);
        expect(computeTimeGrid(4, 0.25)).toEqual([0, 0.25, 0.5, 0.75, 1, 1.25, 1.50, 1.75, 2, 2.25, 2.50, 2.75, 3, 3.25, 3.50, 3.75, 4]);
    });
    it('keeps the last partial subdivision', () => {
        expect(computeTimeGrid(4, 3)).toEqual([0, 3, 4]);
    });
});

describe('getNotesAtBeat', () => {
    it('returns the expected notes at given beat', () => {
        const solo: SoloNote[] = [
            { stringPos: 2, fret: 5, startBeat: 0, durationBeats: 1 },
            { stringPos: 1, fret: 3, startBeat: 2, durationBeats: 1 },
            { stringPos: 6, fret: 0, startBeat: 2, durationBeats: 1 }
        ];
        expect(getNotesAtBeat(solo, 2)).toEqual([
            { stringPos: 1, fret: 3, startBeat: 2, durationBeats: 1 },
            { stringPos: 6, fret: 0, startBeat: 2, durationBeats: 1 }
        ]);
    })
});

describe('getSoloEndBeat', () => {
    it('returns the rigth solo end beat', () => {
        const solo: SoloNote[] = [
            { stringPos: 1, fret: 0, startBeat: 0, durationBeats: 1 },
            { stringPos: 2, fret: 3, startBeat: 2, durationBeats: 4 },
            { stringPos: 3, fret: 5, startBeat: 4, durationBeats: 1 }
        ];

        expect(getSoloEndBeat(solo)).toBe(6);
    });

 it('returns 0 with empty solo', () => {
        expect(getSoloEndBeat([])).toBe(0);
    });

});
