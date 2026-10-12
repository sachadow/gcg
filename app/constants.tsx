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