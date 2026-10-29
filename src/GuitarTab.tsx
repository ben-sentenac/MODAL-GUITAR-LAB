import type { SoloNote } from "./GuitarNeck";
import { computeTabColumns } from "./music/solo";

type GuitarTabProps = {
    solo: SoloNote[]
}

export function GuitarTab({ solo }: GuitarTabProps) {

    const tabColumns = computeTabColumns(solo);
    const stringLabels = ["e", "B", "G", "D", "A", "E"];
    return (
        <div className="guitar-tab-container">
            {
                solo.length ?
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

                    </div>) : <div>Aucune note enregistrée</div>

            }
        </div>
    );
}
