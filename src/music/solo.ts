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
