'use client'
import { useState, useEffect } from "react";

import Cards from "@/app/data/gundam_cards101026.json";
import { Card } from "@/app/constants";
import CardComponent from "./components/card";

interface Sorter {
  type: string,
  asc: boolean
}
const emptySorter: Sorter = {
  type: "level",
  asc: true
}
const emptyFilter: Card = {
  set: "all",
  set_number: "all",
  full_id: "all",
  rarity: "all",
  name: "all",
  level: null,
  cost: null,
  color: null,
  type: "all",
  effects: null,
  zones:  null,
  traits: null,
  link: null,
  ap: null,
  hp: null,
  source: null,
  image_link: null,
  illustrator: null
}

export default function Home() {
  
  let sets: Array<string> = [... new Set(Cards.map((card) => card.set))]
  let colors: Array<string> = ["Blue", "Green", "Red", "Purple", "White"]
  let rarities: Array<string> = ["C", "U", "R", "LR"]
  let sources: Array<string> = [... new Set(Cards.map((card) => card.source))]
  sources.sort()
  let types: Array<string> = ["UNIT", "PILOT", "BASE", "COMMAND"]
  let zones: Array<string> = ["Space", "Earth"]
  let traits: Array<string> = [... new Set(Cards.flatMap((card) => card.traits))]
  traits.sort()

  const [current_filter, set_current_filter] = useState(emptyFilter)
  const [current_sort, set_current_sort] = useState(emptySorter)
  // shown_cards is a list of all the cards that are shown, not in order
  const [shown_cards, set_shown_cards] = useState(Cards)
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
    console.log(current_filter)
    set_shown_cards(Cards.filter((card: Card) => {
      for (const [k, value] of Object.entries(card)) {
        let key = k as keyof Card
        
        if (current_filter[key] != "all" && current_filter[key] != null) {
          if (value == null)
            return false

          if (Array.isArray(value)) {
            if (!value.some((cardval) => cardval == current_filter[key]))
              return false
          }
          else {
            if (value != current_filter[key])
              return false
          }
        }
      }
      return true
    }))
  }, [current_filter])

  const selectedSort = ((e: any) => {
    let new_sort: string = e.target.value
    set_current_sort({... current_sort, type: new_sort})
  })
  const changeSortAsc = (() => {
    set_current_sort({... current_sort, asc: !current_sort.asc})
  })

  const selectedFilter = ((key: string, e: any) =>
  {
    let new_source: string = e.target.value
    set_current_filter({...current_filter, [key]: new_source})
  })

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <span>
            Color: <select defaultValue="all" onChange={(e) => selectedFilter("color", e)}>
              <option value="all">All</option>
              {colors.map((color) =>
                <option key={color} value={color}>{color}</option>
              )}
            </select>
          </span>
          <span>
            Series: <select defaultValue="all" onChange={(e) => selectedFilter("source", e)}>
              <option value="all">All</option>
              {sources.map((source) =>
                <option key={source} value={source}>{source}</option>
              )}
            </select>
          </span>
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
            <button onClick={changeSortAsc}>{current_sort.asc ? "Ascending" : "Descending"}</button>
          </span>
          
          <br/>
          {shown_cards.length} results
        </div>
        <div className="flex flex-row flex-wrap" style={{gap: "1%"}}>
          {sorted_cards.map((card) => <CardComponent key={card.full_id} card={card}/>)}
        </div>
      </main>
    </div>
  );
}
