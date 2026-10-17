import { Card } from "@/app/constants"
import "./card.css"

export default function CardComponent({card, onCardClick}: {card: Card, onCardClick?: Function}) {
    const noClick = () => {
        console.log("Clicked... but nothing to do!")
    }
    if (onCardClick === undefined)
        onCardClick = noClick
    
    return (
    <div className="card_container" onClick={() => onCardClick()}>
        <img src={process.env.PAGES_BASE_PATH || '' + "/img_thumb/" + card.full_id + ".webp"} alt={card.full_id} 
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
  )
}