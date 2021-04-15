import { SliceType } from '@island.is/island-ui/contentful'

export interface Option {
  key: string
  value: string
}

export interface Step {
  title: string
  subtitle: string
  options: Option[]
}

export interface Rule {
  match: string[][]
  answer: string
}

export interface Wizard {
  title: string
  steps: Step[]
  rules: Rule[]
}
