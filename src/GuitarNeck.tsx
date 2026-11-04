import { useEffect, useRef, useState } from "react";
import { getFullNoteName, getMidiNote, midiToFrequency } from "./music/notes";
import {
    CHROMATIC_SCALE,
    getIntervalLabel,
    getTonicName,
    isNoteInScale,
    isCharacteristicInterval,
    type NoteName,
    type ScaleName,
    getScaleComparisonStatus
} from "./music/scales";
import { FretboardControls } from "./FretboardControls";
import { scheduleAttack, scheduleRelease } from "./music/audio";
import { addSoloNote, getNextStartBeat } from "./music/solo";
import { GuitarTab } from "./GuitarTab";

export type GuitarString = {
    pos: 1 | 2 | 3 | 4 | 5 | 6;
    openMidi: number;
}

type SelectedPosition = {
    stringPos: GuitarString['pos'];
    fret: number;
}

export type SoloNote = {
    stringPos: GuitarString['pos'];
    fret: number;
    startBeat: number;
    durationBeats: number;
}


function cellIsSelected(pos: number, fret: number, selectedPosition: SelectedPosition | null) {
    if (selectedPosition) {
        if (pos === selectedPosition.stringPos && fret === selectedPosition.fret) return true
    }
    return false;
}

function buildOutput(selectedPosition: SelectedPosition | null, selected: GuitarString | undefined, tonic: number, scaleName: ScaleName) {
    if (selectedPosition && selected) {
        const midi = getMidiNote(selected.openMidi, selectedPosition.fret);
        const note = getFullNoteName(midi);
        const scaleStatus = isNoteInScale(midi, tonic, scaleName) ? 'Dans la gamme' : 'Hors gamme'
        return (<div className="selected-note-output-legend">
            {
                `NOTE: ${note} MIDI: ${midi} ${scaleStatus}
            SCALE: ${getTonicName(tonic)} ${scaleName}`
            }
        </div>);
    }
    return (
        <div className="selected-note-output-legend">
            Aucune note séléctionée
        </div>)
}

function playTestTone(audioContext: AudioContext, midi: number) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(midiToFrequency(midi), audioContext.currentTime);

    const startTime = audioContext.currentTime;

    const gain = audioContext.createGain();

    const gainParam = gain.gain;
    scheduleAttack(gainParam, startTime);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    const stopTime = startTime + 1;
    scheduleRelease(gainParam, stopTime);

    oscillator.start(startTime);

    oscillator.stop(stopTime);
    oscillator.addEventListener('ended', () => {
        gain.disconnect();
        oscillator.disconnect();
    });
}


function GuitarNeck() {

    const [selectedPosition, setSelectedPosition] = useState<SelectedPosition | null>(null);
    const [tonic, setTonic] = useState(4);
    const [scaleName, setScaleName] = useState<ScaleName>("minor");
    const [displayMode, setDisplayMode] = useState<"notes" | "intervals">("notes");
    const [comparisonScale, setComparisonScale] = useState<ScaleName | null>(null);
    const [insertionDuration, setInsertionDuration] = useState<number>(1);

    const [solo, setSolo] = useState<SoloNote[]>([]);

    const audioCtxRef = useRef<AudioContext | null>(null);

    const validInsertionDuration = [
        0.5, 1, 2
    ] as const;

    const guitarStrings: GuitarString[] = [
        {
            pos: 1,
            openMidi: 64
        },
        {
            pos: 2,
            openMidi: 59
        },
        {
            pos: 3,
            openMidi: 55
        },
        {
            pos: 4,
            openMidi: 50
        },
        {
            pos: 5,
            openMidi: 45
        },
        {
            pos: 6,
            openMidi: 40
        },
    ];

    const handleFretClick = (stringPos: GuitarString['pos'], fret: number) => {
        if (typeof fret !== 'number' || fret < 0) {
            return;
        }
        const string = guitarStrings.find((string) => string.pos === stringPos);
        if (string) {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new AudioContext();
            }
            const midi = getMidiNote(string.openMidi, fret);
            playTestTone(audioCtxRef.current, midi);
        }

        setSelectedPosition({
            stringPos, fret
        });

        setSolo(previousSolo => {
            const lastNote = getNextStartBeat(previousSolo);
            const soloNote: SoloNote = {
                stringPos,
                fret,
                startBeat: lastNote,
                durationBeats: insertionDuration
            };
            return addSoloNote(previousSolo, soloNote);
        });
    }

    const handleInsertionDurationChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
        const noteDuration = Number(target.value);
        if (
            !validInsertionDuration.some(duration => duration === noteDuration)
        ) return;
        setInsertionDuration(noteDuration);
    }

    const handleTabNoteSelect = (note: SoloNote) => {
        const { fret, stringPos } = note;
        setSelectedPosition({
            fret,
            stringPos
        });
    }

    const handleTonicChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
        const noteName: NoteName = target.value as NoteName;
        const tonicNumber = CHROMATIC_SCALE.indexOf(noteName);
        setTonic(tonicNumber);
    }

    const handleScaleChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedScale = target.value as ScaleName;
        setScaleName(selectedScale);
    }

    const handleDisplayModeChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMode = target.value;
        if (selectedMode === "notes" || selectedMode === "intervals") {
            setDisplayMode(selectedMode);
        }
    }

    const handleComparisonScaleChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedComparison = target.value === '' ? null : target.value;
        if (
            selectedComparison === 'major'
            || selectedComparison === 'minor'
            || selectedComparison === 'dorian'
            || selectedComparison === 'phrygian'
            || selectedComparison === null
        ) {
            setComparisonScale(selectedComparison);
        }

    }

    const fretNumbers = Array.from({ length: 13 }, (_, i) => i);

    const selected = guitarStrings.find((string) => string.pos === selectedPosition?.stringPos);

    useEffect(() => {
        return () => {
            const audioContext = audioCtxRef.current;
            if (audioContext) {
                void audioContext.close().catch((err) => { console.error(err) });
            }
        }
    }, []);


    return (
        <>
            <div className="options-container">
                <FretboardControls
                    tonic={tonic}
                    onTonicChange={handleTonicChange}
                    scaleName={scaleName}
                    onScaleChange={handleScaleChange}
                    displayMode={displayMode}
                    onDisplayModeChange={handleDisplayModeChange}
                    comparisonScale={comparisonScale}
                    onComparisonScaleChange={handleComparisonScaleChange}
                />
            </div>
            <div className="g-neck-container">
                {/* display fret numbers*/}
                <div className="fretboard-headers">
                    <div className="header-cell empty"></div>
                    {
                        fretNumbers.map(fret => (
                            <div key={fret} className="header-cell">{fret}</div>
                        ))
                    }
                </div>
                { /* grid of string and case*/}
                <div className="fretboard-grid">
                    {
                        guitarStrings.map((string) => (
                            <div key={string.pos} className="string-row">
                                <div className="string-name">
                                    {getFullNoteName(string.openMidi)}
                                </div>
                                {/**case for string */}
                                {
                                    fretNumbers.map((fret) => {
                                        const isSelected = cellIsSelected(string.pos, fret, selectedPosition);
                                        const midiNote = getMidiNote(string.openMidi, fret);
                                        const label = displayMode === 'notes' ? getFullNoteName(midiNote) : getIntervalLabel(tonic, midiNote);
                                        const isInScale = isNoteInScale(midiNote, tonic, scaleName);
                                        const isCharacteristic = isCharacteristicInterval(tonic, midiNote, scaleName);
                                        const comparisonStatus = comparisonScale ? getScaleComparisonStatus(tonic, midiNote, scaleName, comparisonScale) : null;
                                        const note = isSelected || isInScale || comparisonStatus === 'comparison-only' ? label : "";
                                        const isTonic = midiNote % 12 === tonic % 12;

                                        return (
                                            <div key={fret}
                                                className={`fret-cell
                                                ${isSelected ? 'is-selected' : ''}
                                                ${isInScale ? 'in-scale' : ''}
                                                ${isTonic ? 'is-tonic' : ''}
                                                ${isCharacteristic && comparisonScale === null ? 'is-characteristic' : ''}
                                                ${comparisonStatus === 'comparison-only' ? 'comparison-only' : ''}
                                                ${comparisonStatus === 'main-only' ? 'main-only' : ''}
                                                `}
                                                onClick={() => handleFretClick(string.pos, fret)}
                                                data-note={note}
                                            >

                                                {/* phisical ligne */}
                                                <div
                                                    className="string-line"
                                                    style={{ '--i': string.pos } as React.CSSProperties}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                buildOutput(selectedPosition, selected, tonic, scaleName)

            }
            <div className="options-container">
                <div className="insertion-duration-container">
                    <label className="option-label" htmlFor="insertion-duration-select">
                        Durée d'insertion
                    </label>
                    <select
                        name="insertion-duration"
                        id="insertion-duration-select"
                        value={insertionDuration}
                        onChange={handleInsertionDurationChange}
                    >
                        {
                            validInsertionDuration.map(duration => (
                                <option key={duration} value={duration}>{duration}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <GuitarTab solo={solo} onNoteSelect={handleTabNoteSelect} />
        </>
    )

}


export default GuitarNeck;
