type FretBoardLegendProps = {
    isComparing:boolean;
}

export function FretBoardLegend({isComparing}:FretBoardLegendProps) {

    const legendItems = [
        {
            label:'Note selectionnée',
            color:'--selected-color'
        },
        {
            label:'Tonique',
            color:'--tonic-color'
        },
        {
            label:isComparing ? 'Mode principal uniquement' : 'Degré caractéristique',
            color:'--characteristic-color'
        },
        {
            label:isComparing ? 'Note commune' : 'Note de la gamme',
            color:'--in-scale-color'
        },
       ...(isComparing ? [{ label:'Mode comparé uniquement', color: '--comparison-scale-color'}] : [])
    ];

    return (
        <div className="fretboard-legend">
           {
            legendItems.map((item) => (
                <div className="legend-item">
                    <div style={{backgroundColor:`var(${item.color})`}} className="legend-color"></div>
                    <div className="legend-label">{item?.label}</div>
                </div>
            ))
           }
        </div>
    )
}
