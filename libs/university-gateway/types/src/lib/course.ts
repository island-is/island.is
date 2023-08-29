import { Season } from './season'

export type Course = {
  id: string
  externalId: string
  nameIs: string
  nameEn: string
  universityId: string
  credits: number
  semesterYear: number
  semesterSeason: Season
  descriptionIs: string
  descriptionEn: string
  externalUrlIs: string
  externalUrlEn: string
  created: Date
  modified: Date
}
