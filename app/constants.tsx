export interface Card {
  set: string,
  set_number: string,
  full_id: string,
  rarity: string,
  name: string,
  level?: number | null,
  cost?: number | null,
  color?: string | null,
  type: string,
  effects?: Array<string> | null,
  zones?: Array<string> | null,
  traits?: Array<string> | null,
  link?: Array<string> | null,
  ap?: number | null,
  hp?: number | null,
  source?: string | null,
  image_link?: string | null,
  illustrator?: string | null
}

export interface Option {
  value: string | number,
  label: string
}

export interface Keyword {
  name: string,
  description: string
}

export interface Alt {
  set: string,
  set_number: string,
  full_id: string,
  rarity: string,
  alt_type: string,
  where_to_get: string,
  image_link: string,
  illustrator: string | null,
  file_path: string
}

export const RegularKeywords: Array<Keyword> = [
  {
    name: "<Repair [1-9]>",
    description: "(At the end of your turn, this Unit recovers the specified number of HP.)"
  },
  {
    name: "<High-Maneuver>",
    description: "(This Unit can't be blocked.)"
  },
  {
    name: "<First Strike>",
    description: "(While this Unit is attacking, it deals damage before the enemy Unit.)"
  },
  {
    name: "<Breach [1-9]>",
    description: "(During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)"
  },
  {
    name: "<Suppression>",
    description: "(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)"
  },
  {
    name: "<Blocker>",
    description: "(Rest this Unit to change the attack target to it.)"
  }
]