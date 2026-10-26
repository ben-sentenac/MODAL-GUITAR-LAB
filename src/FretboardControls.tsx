import { getTonicName, SCALES, CHROMATIC_SCALE, type ScaleName } from "./music/scales";
import { FretBoardLegend } from "./FretboardLegend";
import type { ChangeEventHandler } from "react";

type FreatBoardControlsProps = {
    tonic: number;
    onTonicChange: ChangeEventHandler<HTMLSelectElement>;
    scaleName: ScaleName;
    onScaleChange:ChangeEventHandler<HTMLSelectElement>;
    displayMode: "notes" | "intervals";
    onDisplayModeChange:ChangeEventHandler<HTMLSelectElement>;
    comparisonScale: ScaleName | null;
    onComparisonScaleChange:ChangeEventHandler<HTMLSelectElement>;
}


export function FretboardControls({tonic,onTonicChange,
    scaleName,onScaleChange,
    displayMode,onDisplayModeChange,
    comparisonScale,onComparisonScaleChange
}: FreatBoardControlsProps) {
    return (
        <>
            <div className="tonic-option">
                <label className="option-label" htmlFor="tonic-select">
                    Tonique
                </label>
                <select
                    onChange={onTonicChange}
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
                    onChange={onScaleChange}
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
                    onChange={onDisplayModeChange}
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
                    onChange={onComparisonScaleChange}
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
            <FretBoardLegend isComparing={comparisonScale !== null} />
        </>
    )
}
