import { Card, RegularKeywords } from "@/app/constants"
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
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: "end"}}>
                    <span>
                        {card.ap || card.hp ? `${card.ap ?? "0"}AP ${card.hp ?? "0"}HP` : ""}
                    </span>
                    <span style={{fontSize: "small"}}>
                        {card.source ?? ""}
                        <br/>
                        {card.illustrator ? `Illust: ${card.illustrator}` : ""}
                    </span>
                </div>
                <hr/>
                <div>
                    {card.effects?.map((effect) => {
                        const separator = "SEPARATOR"
                        const description_separator = "DESCRIPTION OF EFFECT"
                        let split_effect: Array<string> = [effect]

                        for (const keyword of RegularKeywords) {
                            let kw_regex = RegExp(`(${keyword.name})`)
                            // Remove description if it's there
                            effect = effect.split(keyword.description)[0]

                            split_effect = effect.split(kw_regex)
                            if (split_effect.length > 1) {
                                effect = split_effect.map((eff) => eff.match(kw_regex) ? `${eff}${description_separator}${keyword.description}` : eff).join(separator)
                            }
                        }

                        return <span key={effect}>
                                {effect.split(separator).map((eff) => {
                                    let splt = eff.split(description_separator)
                                    if (splt.length > 1)
                                        return <span key={splt[0]} className="effect" data-effect-tooltip={splt[1]}>{splt[0]}</span>
                                    return eff 
                                })}
                                <br/>
                            </span>
                    })}
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