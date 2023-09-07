import { Requirement, Season } from '@island.is/university-gateway-types'

export interface Course {
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

// import { Season } from '../types'

// export type Course = {
//   id: string
//   externalId: string
//   nameIs: string
//   nameEn: string
//   universityId: string
//   credits: number
//   semesterYear: number
//   semesterSeason: Season
//   descriptionIs: string
//   descriptionEn: string
//   externalUrlIs: string
//   externalUrlEn: string
//   created: Date
//   modified: Date
// }
