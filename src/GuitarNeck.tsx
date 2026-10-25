import { useState } from "react";
import { getFullNoteName, getMidiNote } from "./music/notes";
import {
    CHROMATIC_SCALE,
    getIntervalLabel,
    getTonicName,
    isNoteInScale,
    isCharacteristicInterval,
    SCALES,
    type NoteName,
    type ScaleName,
    getScaleComparisonStatus
} from "./music/scales";
import { FretBoardLegend } from "./FretboardLegend";

type GuitarString = {
    pos: 1 | 2 | 3 | 4 | 5 | 6;
    openMidi: number;
}

type SelectedPosition = {
    stringPos: GuitarString['pos'];
    fret: number;
}

function cellIsSelected(pos: number, fret: number, selectedPosition: SelectedPosition | null) {
    if (selectedPosition) {
        if (pos === selectedPosition.stringPos && fret === selectedPosition.fret) return true
    }
    return false;
}

function buildOutput(selectedPosition: SelectedPosition, selected: GuitarString, tonic: number, scaleName: ScaleName) {
    const midi = getMidiNote(selected.openMidi, selectedPosition.fret);
    const note = getFullNoteName(midi);
    const scaleStatus = isNoteInScale(midi, tonic, scaleName) ? 'Dans la gamme' : 'Hors gamme'
    return <span>{`NOTE: ${note} MIDI: ${midi} ${scaleStatus} SCALE: ${getTonicName(tonic)} ${scaleName}`}</span>
}


function GuitarNeck() {

    const [selectedPosition, setSelectedPosition] = useState<SelectedPosition | null>(null);
    const [tonic, setTonic] = useState(4);
    const [scaleName, setScaleName] = useState<ScaleName>("minor");
    const [displayMode, setDisplayMode] = useState<"notes" | "intervals">("notes");
    const [comparisonScale, setComparisonScale] = useState<ScaleName | null>(null);

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

        setSelectedPosition({
            stringPos, fret
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


    return (
        <>
            <div className="options-container">
                <div className="tonic-option">
                    <label className="option-label" htmlFor="tonic-select">
                        Tonique
                    </label>
                    <select
                        onChange={handleTonicChange}
                        name="tonic"
                        value={getTonicName(tonic)}
                        id="tonic-select">
                        {
                            CHROMATIC_SCALE.map((tonic) => {
                                return (
                                    <option
                                        key={tonic}
                                        value={tonic}
                                    >
                                        {tonic}
                                    </option>
                                )
                            })
                        }
                    </select>
                    <div className="tonic-name">{getTonicName(tonic)}</div>
                </div>
                <div className="mode-option">
                    <label className="option-label" htmlFor="mode-select">
                        Gammes
                    </label>
                    <select
                        onChange={handleScaleChange}
                        value={scaleName}
                        name="mode"
                        id="mode-select"
                    >
                        {
                            Object.keys(SCALES).map((scale) => {
                                return (
                                    <option key={scale} value={scale}>{scale}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="display-mode-option">
                    <label className="option-label" htmlFor="display-mode-select">
                        Affichage
                    </label>
                    <select
                        name="display"
                        id="display-mode-select"
                        value={displayMode}
                        onChange={handleDisplayModeChange}
                    >
                        <option value="notes">Notes</option>
                        <option value="intervals">Intervalles</option>
                    </select>
                </div>
                <div className="comparison-mode-option">
                    <label className="option-label" htmlFor="comparison-select">
                        Comparer avec:
                    </label>
                    <select
                        name="comparison"
                        id="comparison-select"
                        value={comparisonScale ?? ''}
                        onChange={handleComparisonScaleChange}
                    >
                        <option value={''}>Aucune Comparaison</option>
                        {
                            Object.keys(SCALES).map((scale) => {
                                return (
                                    <option key={scale} value={scale}>{scale}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <FretBoardLegend isComparing={comparisonScale !== null}/>
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

                                        console.log(comparisonStatus);
                                        return (
                                            <div key={fret}
                                                className={`fret-cell
                                                ${isSelected ? 'is-selected' : ''}
                                                ${isInScale ? 'in-scale' : ''}
                                                ${isTonic ? 'is-tonic' : ''}
                                                ${isCharacteristic && comparisonScale === null ? 'is-characteristic' : ''}
                                                ${comparisonStatus === 'comparison-only' ? 'comparison-only' : ''}
                                                ${comparisonStatus === 'main-only' ? 'main-only' : '' }
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
                selectedPosition && selected ? buildOutput(selectedPosition, selected, tonic, scaleName) : <span>Aucune note séléctionée</span>

            }
        </>
    )

}


export default GuitarNeck;
