'use client'
import { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component-19";

import Cards from "@/app/data/gundam_cards17102026.json";
import Tokens from "@/app/data/gundam_tokens17102026.json";
import { Card, Option } from "@/app/constants";
import CardComponent from "./components/card";

import "./page.css";
import CardLargeComponent from "./components/card_large";

interface Sorter {
  type: string,
  asc: boolean
}
const emptySorter: Sorter = {
  type: "level",
  asc: true
}
const emptyFilter = {
  set: [],
  set_number: [],
  full_id: [],
  rarity: [],
  name: [],
  level: [],
  cost: [],
  color: [],
  type: [],
  effects: [],
  zones:  [],
  traits: [],
  link: [],
  ap: [],
  hp: [],
  source: [],
  image_link: [],
  illustrator: []
}

export default function Home() {

  let sets: Array<string> = [... new Set(Cards.map((card) => card.set))]
  let colors: Array<string> = ["Blue", "Green", "Red", "Purple", "White"]
  let rarities: Array<string> = ["C", "U", "R", "LR"]
  let sources: Array<string> = [... new Set(Cards.map((card) => card.source))]
  sources.sort()
  let illustrators: Array<string> = [... new Set(Cards.map((card) => card.illustrator))]
  illustrators = illustrators.sort().filter((val) => val != "")
  let types: Array<string> = ["UNIT", "PILOT", "BASE", "COMMAND", "TOKEN"]
  let zones: Array<string> = ["Space", "Earth"]
  let traits: Array<string> = [... new Set(Cards.flatMap((card) => card.traits))]
  traits.sort()

  const [selected_card, set_selected_card] = useState({} as Card)
  const [related_cards, set_related_cards] = useState([] as Card[])
  const [display_related, set_display_related] = useState(false)


  const [all_cards, set_all_cards] = useState(Cards as Card[])

  const [current_filter, set_current_filter] = useState(emptyFilter)
  const [current_sort, set_current_sort] = useState(emptySorter)
  // shown_cards is a list of all the cards that are shown, not in order
  const [shown_cards, set_shown_cards] = useState(all_cards)
  // sorted_cards is the final list as it is displayed
  const [sorted_cards, set_sorted_cards] = useState(shown_cards)

  // sort cards when the shown cards are modified (e.g different filter was applied)
  // or when the sorting parameters change
  useEffect(() => {
    set_sorted_cards(shown_cards.toSorted((a: Card, b: Card) => {
      let type = current_sort.type as keyof Card

      if (type == "rarity")
        return ((rarities.indexOf(a[type]) - rarities.indexOf(b[type])) * (current_sort.asc ? 1 : -1)) 

      if (!b[type])
        return 1
      if (!a[type])
        return -1

      let val =  current_sort.asc ? 
          a[type] > b[type] :
          a[type] < b[type]
      return val ? 1 : -1
      }))
  }, [shown_cards, current_sort])

  useEffect(() => {
    set_shown_cards(all_cards.filter((card: Card) => {
      for (const [k, value] of Object.entries(card)) {
        let key = k as keyof Card
        
        if (current_filter[key].length > 0) {
          if (value == null)
            return false

          if (Array.isArray(value)) {
            if (!value.some((cardval) => current_filter[key].some((filterval) => filterval == cardval)))
              return false
          }
          else {
            if (!current_filter[key].some((filterval) => filterval == value))
              return false
          }
        }
      }
      return true
    }))
  }, [current_filter, all_cards])

  const selectedSort = ((e: any) => {
    let new_sort: string = e.target.value
    set_current_sort({... current_sort, type: new_sort})
  })
  const changeSortAsc = (() => {
    set_current_sort({... current_sort, asc: !current_sort.asc})
  })

  const changeDisplayRelated = (() => {
    set_display_related(!display_related)
  })

  const selectedFilter = ((key: string, new_filter: Array<Option>) =>
  {
    set_current_filter({...current_filter, [key]: new_filter.map((filter: Option) => filter.value)})
  })

  const includeTokens = ((e: any) => {
    set_all_cards(e.target.checked ? [... Cards, ...Tokens] : [... Cards])
  })

  useEffect(() => {
    if (!("full_id" in selected_card) || !selected_card["full_id"])
      return

    // this is a mess, my bad
    set_related_cards(all_cards.filter((card: Card) => {
      if (Array.isArray(selected_card.link)) {
        if (selected_card.type == "UNIT")
          return (card.type == "PILOT" &&
            selected_card.link.some((link_condition: string) => {
              if (link_condition[0] == "[") {
                link_condition = link_condition.slice(1, -1)
                return card.name.includes(link_condition) ||
                  card.effects!.some((effect: string) => effect.includes("This card's name is also treated as") && effect.includes(link_condition))
              }
              if (link_condition[0] == "(") {
                link_condition = link_condition.split(" Trait")[0]
                return card.traits!.some((trait: string) => link_condition == trait)
              }
            }) ||
            (card.type == "COMMAND" &&
              selected_card.link.some((link_condition: string) => {
                if (link_condition[0] == "[") {
                  link_condition = link_condition.slice(1, -1)
                  return card.effects!.some((effect: string) => effect.includes("【Pilot】") && effect.includes(link_condition))
                }
                if (link_condition[0] == "(") {
                  link_condition = link_condition.split(" Trait")[0]
                  return card.traits!.some((trait: string) => link_condition == trait  && (card.ap || card.hp))
                }
              })))
        else
          return card.type == "UNIT" &&
            card.link!.some((link_condition: string) => {
              if (link_condition[0] == "[") {
                link_condition = link_condition.slice(1, -1)
                return selected_card.name.includes(link_condition) ||
                  selected_card.effects!.some((effect: string) => (effect.includes("This card's name is also treated as") || effect.includes("【Pilot】")) && effect.includes(link_condition))
              }
              if (link_condition[0] == "(") {
                link_condition = link_condition.split(" Trait")[0]
                return selected_card.traits!.some((trait: string) => link_condition == trait)
              }
            })
      }
      return false
    }))
  }, [selected_card])

  return (
    <div style={{display: "flex", justifyContent: "center", fontFamily: "Segoe UI"}}>
      <main style={{display: "flex", flexBasis: "1", flexDirection: "column", alignItems: "center", justifyContent: "center",
            width: "1024px", maxWidth: "95%", marginTop: "20px", marginBottom: "20px"}}>
        <div style={{display: "flex", flexDirection: "column", width: "100%"}} >
          {"full_id" in selected_card && selected_card["full_id"] ?
            <>
              <CardLargeComponent card={selected_card as Card}/>
              <button onClick={changeDisplayRelated}>{display_related ? "Hide links" : "Display links"}</button>
              {
                display_related ?
                  <>
                    Cards this links with ({related_cards.length} results):
                    <div className="cards_container" style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "2px"}}>
                      {related_cards.map((card) => <CardComponent key={card.full_id} card={card} onCardClick={() => set_selected_card(card)}/>)}
                    </div>
                  </> : ""
              }
            </>
          : ""}
          <div className="dropdown_parent_container">
            <span className="dropdown_select">
              Color: <MultiSelect
                className="dark_text" 
                hasSelectAll={false}
                options={Array.from(colors, (source) => ({value: source, label: source}))}
                value={Array.from(current_filter.color, (source) => ({value: source, label: source}))}
                labelledBy="Colors"
                onChange={(new_select: Array<Option>) => selectedFilter("color", new_select)}/>
            </span>
            <span className="dropdown_select">
              Series: <MultiSelect
                className="dark_text"
                hasSelectAll={false}
                options={Array.from(sources, (source) => ({value: source, label: source}))}
                value={Array.from(current_filter.source, (source) => ({value: source, label: source}))}
                labelledBy="Series"
                onChange={(new_select: Array<Option>) => selectedFilter("source", new_select)}/>
            </span>
            <span className="dropdown_select">
              Illustrator: <MultiSelect
                className="dark_text"
                hasSelectAll={false}
                options={Array.from(illustrators, (source) => ({value: source, label: source}))}
                value={Array.from(current_filter.illustrator, (source) => ({value: source, label: source}))}
                labelledBy="Illustrator"
                onChange={(new_select: Array<Option>) => selectedFilter("illustrator", new_select)}/>
            </span>
          </div>
          <span>
            Sort by <select value={current_sort.type} onChange={selectedSort}>
              <option value="set">Set</option>
              <option value="set_number">Set number</option>
              <option value="rarity">Rarity</option>
              <option value="name">Name</option>
              <option value="level">Level</option>
              <option value="cost">Cost</option>
              <option value="color">Color</option>
              <option value="type">Type</option>
              <option value="ap">AP</option>
              <option value="hp">HP</option>
              <option value="source">Source</option>
            </select>
            <button onClick={changeSortAsc}>{current_sort.asc ? "↑ Ascending" : "↓ Descending"}</button>
          </span>
          <span>
            <input type='checkbox' id="tokens" onChange={includeTokens}/> 
            <label htmlFor="tokens"> Include tokens</label>
          </span>
          
          <br/>
          {shown_cards.length} results
        </div>
        <div className="cards_container" style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "2px"}}>
          {sorted_cards.map((card) => <CardComponent key={card.full_id} card={card} onCardClick={() => set_selected_card(card)}/>)}
        </div>
      </main>
    </div>
  );
}
