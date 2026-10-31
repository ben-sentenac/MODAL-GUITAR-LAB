import type { SoloNote } from "./GuitarNeck";
import { computeTimeGrid, getNoteGridPlacement, getSoloEndBeat } from "./music/solo";

type GuitarTabProps = {
    solo: SoloNote[]
}

export function GuitarTab({ solo }: GuitarTabProps) {
    const stringLabels = ["e", "B", "G", "D", "A", "E"];
    const canDisplayTab = solo.length > 0;

    const stepBeats = 0.5;

    const totalBeats = Math.max(4, getSoloEndBeat(solo));

    const timeGridCells = computeTimeGrid(totalBeats, stepBeats);
    const gridStartCells = timeGridCells.slice(0, -1);
    return (
        <div className="guitar-tab-container">
            <div className="startbeat-container">
                <div className="guitar-tab-row">
                    <span className="guitar-tab-label"></span>
                    <div className="startbeat-cells">
                        {gridStartCells.map((startCell) => (
                            <span className="guitar-tab-col" key={startCell}>{startCell}</span>
                        ))}
                    </div>
                </div>
            </div>
            {
                Array.from({ length: 6 }, (_, i) =>
                    <div className="guitar-tab-row" key={i}>
                        <span className="guitar-tab-label">{stringLabels[i]} |</span>
                        <div className="guitar-tab-notes" style={
                            {
                                width: `${gridStartCells.length * 1.5}rem`,
                                gridTemplateColumns: `repeat(${gridStartCells.length},1.5rem)`
                            }}>
                            {
                                solo.filter((note) => note.stringPos === i + 1)
                                    .map((note) => {
                                        const placement = getNoteGridPlacement(note,stepBeats);
                                        return (
                                        <span
                                        key={note.startBeat}
                                        style={
                                            { gridColumn: `${placement.columnStart}/ span ${placement.columnSpan}` }
                                        }
                                        className="guitar-tab-col">{note?.fret}</span>
                                    )
                                })
                            }
                        </div>
                    </div>

            )}
            {
                !canDisplayTab && <div>Aucune note enregistrée</div>
            }
        </div>
    );
}
