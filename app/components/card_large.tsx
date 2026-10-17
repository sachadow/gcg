import { Card } from "@/app/constants"
import "./card_large.css"

export default function CardLargeComponent({card}: {card: Card}) {
    return (
    <div className="big_card_container">
        <div className="image_container">
            <img src={"img/" + card.full_id + ".webp"} alt={card.full_id} loading="lazy"/>
        </div>
        <div className="text_container">
            <div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <span>
                        <b>{card.name}</b>
                        <br/>
                        {`Level ${card.level} Cost ${card.cost}`}
                    </span>
                    {`${card.full_id} ${card.rarity}`}
                    <br/>
                    {`${card.color} ${card.type}`}
                </div>
                <hr/>
                <div>
                    {card.effects?.map((effect) => 
                    <span key={effect}>
                        {effect} <br/>
                    </span>)}
                </div>
            </div>
            <div>
                <hr/>
                <div>
                    Traits: {card.traits?.join(" / ")}
                </div>
                {card.type == "UNIT" ?
                    <div>
                        <hr/>
                        Link: {card.link?.join(" / ")}
                    </div>
                    : ""
                }
            </div>
        </div>
        <br/>
    </div>
  )
}