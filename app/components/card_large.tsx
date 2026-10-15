import { Card } from "@/app/constants"
import Image from "next/image"
import "./card_large.css"

export default function CardLargeComponent({card}: {card: Card}) {
    return (
    <div className=" mb-5 flex flex-row gap-5">
        <div className="max-w-[300px] w-[50%]">
            <Image src={"/img/" + card.full_id + ".webp"} alt={card.full_id} 
                loading="lazy" height="1000" width="1000" className="w-full h-auto"/>
        </div>
        <div className="flex flex-col card-info-container justify-between w-[100%]">
            <div>
                <div className="flex flex-row justify-between">
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
    </div>
  )
}