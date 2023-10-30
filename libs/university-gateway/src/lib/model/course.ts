import { Requirement } from '../types/requirement'
import { Season } from '../types/season'

export interface ICourse {
  externalId: string
  minorExternalId?: string
  nameIs: string
  nameEn: string
  credits: number
  descriptionIs?: string
  descriptionEn?: string
  externalUrlIs?: string
  externalUrlEn?: string
  requirement: Requirement
  semesterYear?: number
  semesterSeason: Season
}
