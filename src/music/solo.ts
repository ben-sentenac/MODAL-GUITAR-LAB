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
