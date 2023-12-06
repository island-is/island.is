import { Area } from './area.dto'

export interface Collection {
  id: string
  name: string
  startTime: Date
  endTime: Date
  areas: Area[]
}
