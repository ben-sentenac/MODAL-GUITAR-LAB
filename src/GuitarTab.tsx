import type { SoloNote } from "./GuitarNeck";
import { computeTabColumns } from "./music/solo";

type GuitarTabProps = {
    solo: SoloNote[]
}

export function GuitarTab({ solo }: GuitarTabProps) {

    const tabColumns = computeTabColumns(solo);
    const stringLabels = ["e", "B", "G", "D", "A", "E"];
    const canDisplayTab = solo.length > 0;

    const startBeatCells = solo.map((soloNote, soloIndex) =>
    (
        <span key={soloIndex} className="guitar-tab-col">
            {soloNote.startBeat}
        </span>
    ));
    return (
        <div className="guitar-tab-container">
            {
                canDisplayTab ? <>
                    <div className="startbeat-container">
                        <div className="guitar-tab-row">
                            <span className="guitar-tab-label"></span>
                            <div className="startbeat-cells">
                                {startBeatCells}
                            </div>
                        </div>
                    </div>
                    {
                        Array.from({ length: 6 }, (_, i) =>
                            <div className="guitar-tab-row" key={i}>
                                <span className="guitar-tab-label">{stringLabels[i]} |</span>
                                <div className="guitar-tab-notes">
                                    {
                                        tabColumns.map((column, columnIndex) =>
                                            <span className="guitar-tab-col" key={columnIndex}>
                                                {
                                                    column[i] === "-" ?
                                                        "" :
                                                        <span>{column[i]}</span>
                                                }
                                            </span>
                                        )}
                                </div>

                            </div>)
                    }
                    </> : <div>Aucune note enregistrée</div>

            }
        </div>
    );
}
