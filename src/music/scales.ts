import { checkMidiRange } from "./notes";

//distance semi-tone interval from tonic
export const CHROMATIC_SCALE = [
    "C",  // Do
    "C#", // Do#
    "D",  // Ré
    "D#", // Ré#
    "E",  // Mi
    "F",  // Fa
    "F#", // Fa#
    "G",  // Sol
    "G#", // Sol#
    "A",  // La
    "A#", // La#
    "B"   // Si
] as const;

export const SCALES = {
    "dorian":[0, 2, 3, 5, 7, 9, 10],
    "phrygian":[0, 1, 3, 5, 7, 8, 10],
    "major":[0, 2, 4, 5, 7, 9, 11],
    "minor":[0, 2, 3, 5, 7, 8, 10]
} as const;

export const INTERVALS = [
    "1","b2","2","b3","3","4","#4","5","b6","6","b7","7"
] as const;

export type NoteName = (typeof CHROMATIC_SCALE)[number];

export type ScaleName = keyof typeof SCALES;

export type ScaleInterval = (typeof INTERVALS)[number];

export type ScaleComparisonStatus =
    | "common"
    | "main-only"
    | "comparison-only"
    | "outside";


export const CHARACTERISTIC_INTERVALS:Partial<Record<ScaleName,number[]>> = {
    "dorian":[9],
    "phrygian":[1],
    "minor":[8,10],
    "major":[5,11]
}


function modulo(value: number, mod: number) {
    return ((value % mod) + mod) % mod;
}

export function getTonicName(tonic:number): NoteName {
    const tonicName = CHROMATIC_SCALE[modulo(tonic,12)];
    return tonicName ?? "C";
}

export function isNoteInScale(midiNote:number,tonic:number,scaleName:ScaleName):boolean {
    const distance = modulo((midiNote - tonic),12);
    return SCALES[scaleName].some((value) => value === distance);
}

export function getIntervalSemitones(tonicMidi:number,noteMidi:number): number {
    checkMidiRange(noteMidi);
    checkMidiRange(tonicMidi);
    return modulo(noteMidi - tonicMidi,12);
}

export function getIntervalLabel(tonic:number,noteMidi:number):ScaleInterval {
    const semiTone = getIntervalSemitones(tonic,noteMidi);
    if(!INTERVALS[semiTone]) throw new Error('[Invalid interval]: index is undefined');
    return INTERVALS[semiTone];
}

export function isCharacteristicInterval(tonicMidi:number,noteMidi:number,scaleName:ScaleName):boolean {
    const result = CHARACTERISTIC_INTERVALS[scaleName];
    return result?.includes(getIntervalSemitones(tonicMidi,noteMidi)) ?? false
}

export function getScaleComparisonStatus(
    tonicMidi:number,
    noteMidi:number,
    mainScale:ScaleName,
    comparisonScale: ScaleName
): ScaleComparisonStatus {
    checkMidiRange(noteMidi);
    checkMidiRange(tonicMidi);
    const main = isNoteInScale(noteMidi,tonicMidi,mainScale);
    const comparison = isNoteInScale(noteMidi,tonicMidi,comparisonScale);

    if(!comparison && !main) return "outside";
    if(comparison && !main) return "comparison-only";
    if(!comparison && main) return "main-only";
    return "common";

}
