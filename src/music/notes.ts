
export function checkMidiRange(midi: number):void {
    if (!Number.isInteger(midi) || midi < 0 || midi > 127) {
        throw new RangeError('MIDI note must be an integer between 0 and 127');
    }
}

export function getMidiNote(openStringMidi: number, fretNumber: number): number {
    return openStringMidi + fretNumber;
}

export function getNoteName(midi: number): string {

    checkMidiRange(midi);

    const NOTES = [
        "C", "C#", "D", "D#", "E", "F",
        "F#", "G", "G#", "A", "A#", "B"
    ];

    const note = NOTES[midi % NOTES.length];

    if (typeof note !== 'string') {
        throw new Error('Note introuvable');
    }
    return note;
}

export function getOctave(midi: number): number {
    checkMidiRange(midi);
    const octave = Math.floor(midi/12) -1;
    return octave;
}

export function getFullNoteName(midi:number):string {
    const note = getNoteName(midi);
    const octave = getOctave(midi);

    return `${note}${octave}`;
}

export function midiToFrequency(midi:number):number {
    checkMidiRange(midi);
   return  440 * 2 ** ((midi - 69)/12);
}
