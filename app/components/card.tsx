import { Card } from "@/app/constants"
import "./card.css"

export default function CardComponent({card, onCardClick, noToolTip}: {card: Card, onCardClick?: Function, noToolTip?: boolean}) {
    const noClick = () => {
        console.log("Clicked... but nothing to do!")
    }
    if (onCardClick === undefined)
        onCardClick = noClick
    
    // remove effect explanation because it clutters tooltips
    const effects_for_tooltip = card.effects?.map((effect) =>
        {
            let eff_array = effect.split("\n(")[0].split("> (")
            let return_value = eff_array[0]
            if (eff_array.length > 1)
                return_value = return_value + ">"
            return return_value
        })

    const tooltip_value = 
//        `${card.name}${card.ap || card.hp ? `\n${card.ap ?? 0}AP ${card.hp}HP` : ""}\n` +
        `${effects_for_tooltip && effects_for_tooltip[0] != "-" ? `${effects_for_tooltip.join("\n")}\n\n` : ""}` +
        `${card.traits && card.traits.length ? `Traits: ${card.traits?.join(' ')}\n`: ""}` +
        `${card.link && card.link[0] != "-" ? `Link: ${card.link.join(" ")}` : ""}`;

    return (
    <div className="card_container" {...(noToolTip ? {} : {"data-tooltip": `${tooltip_value}`} )} onClick={() => onCardClick()}>
        <div style={{width: "100%", height: "100%", position: "relative", overflow: "hidden"}}>
            <img src={"img_thumb/" + card.full_id + ".webp"} alt={card.full_id} 
                loading="lazy"
                style={{position: "absolute", objectFit: "cover", objectPosition: "top -5px right 0px"}}/>
            <div className="card_text_container">
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <div className={"cost_level_container " + card.color} style={{padding: "3px 3px 3px 5px"}}>
                        <span className={"level_text " + card.color}>L{card.level ?? 0}</span>
                        <br/>
                        <span className={"cost_text " + card.color}>C{card.cost ?? 0}</span>
                    </div>
                    <div className={"type_container relative type_text " + card.color} style={{padding: "5px 3px 5px 3px"}}>
                        {card.type}
                    </div>
                </div>
                <div className="bottom_container" style={{display: "flex", flexDirection: "row"}}>
                    <div className="name_text" style={{paddingLeft: "5px", paddingBottom: "5px"}}>
                        {card.name.length > 30 ? card.name.replace(/(.{25})..+/, "$1…") : card.name}
                    </div>
                    { (card.ap || card.hp) ?
                        <div className="stats_container" style={{display: "flex", flexDirection: "row", paddingLeft: "3px"}}>
                            <div>
                                {card.ap ?? 0}
                            </div>
                            <div>
                                {card.hp ?? 0}
                            </div>
                        </div> : ""
                    }
                </div>
            </div>
        
        </div>
    </div>
  )
}