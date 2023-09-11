import { Requirement, Season } from '../types'

export interface ICourse {
  externalId: string
  nameIs: string
  nameEn: string
  requirement: Requirement
  credits: number
  semesterYear?: number
  semesterSeason: Season
  descriptionIs?: string
  descriptionEn?: string
  externalUrlIs?: string
  externalUrlEn?: string
}
