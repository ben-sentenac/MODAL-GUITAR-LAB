import type { SoloNote } from "../GuitarNeck";

export function addSoloNote(solo:SoloNote[],note:SoloNote):SoloNote[] {
    const updatedSolo = [...solo];
    updatedSolo.push(note);
    return updatedSolo;
}

export function getNextStartBeat(solo: SoloNote[]):number {
    const lastNote = solo.at(-1);
    return lastNote ? lastNote.startBeat + lastNote.durationBeats : 0;
}


export function computeTabCells(soloNote:SoloNote,nbStrings = 6):string[] {
    return Array.from({length:nbStrings}, (_,i) =>  {
        let tabCell:string;
        if(i+1 === soloNote.stringPos) {
            tabCell = String(soloNote.fret);
        } else {
            tabCell = "-";
        }
        return tabCell;
    });
}
export function computeTabColumns(solo:SoloNote[],nbStrings = 6):string[][] {
    return solo.map(soloNote => computeTabCells(soloNote,nbStrings))
}

export function computeTimeGrid(totalBeats:number,stepBeats:number):number[] {
    const exactSteps = totalBeats / stepBeats;
    const stepsCount = Math.ceil(exactSteps);

    const grid = Array.from({length:stepsCount + 1}, (_,i) => {
        const value = i * stepBeats;

        return Math.round(value * 1e6) / 1e6;
    });

    if(grid.length > 0) {
        grid[grid.length -1] = totalBeats;
    }

    return grid;
}

export function getNotesAtBeat(solo:SoloNote[],beat:number):SoloNote[] {
    return solo.filter((soloNote) => soloNote.startBeat === beat);
}

export function getSoloEndBeat(solo: SoloNote[]): number {
    return solo.reduce((acc,curr) => {
        const endBeat = curr.startBeat + curr.durationBeats;
        return Math.max(acc,endBeat);
    },0);
}

export type GridPlacement = {
    columnStart: number,
    columnSpan: number
}

export function getNoteGridPlacement(note:SoloNote,stepBeats:number = 1): GridPlacement {
    const gridOffset = 1;
    const subdivisionBeat = note.startBeat / stepBeats;
    return {
        columnStart:subdivisionBeat + gridOffset,
        columnSpan:note.durationBeats / stepBeats
    }
}
