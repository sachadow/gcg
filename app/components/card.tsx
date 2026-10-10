import { Card } from "@/app/constants"
import Image from "next/image"
import "./card.css"

export default function CardComponent({card}: {card: Card}) {
  return (
    <div className="size-36 relative">
        <Image src={"/img/" + card.full_id + ".webp"} alt={card.full_id} 
            fill loading="lazy" sizes="100%"
            style={{objectFit: "cover", objectPosition: "top -5px right 0px"}}/>
        <div className="card_text_container">
            <div className="flex flex-row justify-between">
                <div className={"cost_level_container p-1 pl-2 pr-1.5 " + card.color}>
                    <span className={"level_text " + card.color}>L{card.level}</span>
                    <br/>
                    <span className={"cost_text " + card.color}>C{card.cost}</span>
                </div>
                <div className={"type_container relative type_text p-1 pl-0.5 pr-0.5 " + card.color}>
                    {card.type}
                </div>
            </div>
            <div className="bottom_container flex flex-row">
                <div className="name_text pl-2 pb-2">
                    {card.name.length > 30 ? card.name.replace(/(.{25})..+/, "$1…") : card.name}
                </div>
                { (card.ap || card.hp) ?
                    <div className="flex flex-row stats_container pl-1">
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