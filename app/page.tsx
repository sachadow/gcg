'use client'
import { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component-19";

import Cards from "@/app/data/gundam_cards101026.json";
import Tokens from "@/app/data/gundam_tokens12102026.json";
import { Card, Option } from "@/app/constants";
import CardComponent from "./components/card";

import "./page.css";

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

  const [selected_sources, set_selected_sources] = useState([])

  const [all_cards, set_all_cards] = useState([... Cards, ... Tokens])

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

  const selectedFilter = ((key: string, new_filter: Array<Option>) =>
  {
    console.log(new_filter)
    set_current_filter({...current_filter, [key]: new_filter.map((filter: Option) => filter.value)})
  })

  const includeTokens = ((e: any) => {
    set_all_cards(e.target.checked ? [... Cards, ...Tokens] : Cards)
  })

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center">
        <div className="flex flex-col" style={{width: "100%"}}>
          <div className="dropdown_parent_container">
            <span>
              Color: <MultiSelect
                className="dark_text" 
                hasSelectAll={false}
                options={Array.from(colors, (source) => ({value: source, label: source}))}
                value={Array.from(current_filter.color, (source) => ({value: source, label: source}))}
                labelledBy="Colors"
                onChange={(new_select: Array<Option>) => selectedFilter("color", new_select)}/>
            </span>
            <span>
              Series: <MultiSelect
                className="dark_text"
                hasSelectAll={false}
                options={Array.from(sources, (source) => ({value: source, label: source}))}
                value={Array.from(current_filter.source, (source) => ({value: source, label: source}))}
                labelledBy="Series"
                onChange={(new_select: Array<Option>) => selectedFilter("source", new_select)}/>
            </span>
            <span>
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
            <input type='checkbox' id="tokens" defaultChecked onChange={includeTokens}/> 
            <label htmlFor="tokens"> Include tokens</label>
          </span>
          
          <br/>
          {shown_cards.length} results
        </div>
        <div className="flex flex-row flex-wrap cards_container" style={{gap: "2px"}}>
          {sorted_cards.map((card) => <CardComponent key={card.full_id} card={card}/>)}
        </div>
      </main>
    </div>
  );
}
