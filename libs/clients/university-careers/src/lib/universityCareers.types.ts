import { User } from '@island.is/auth-nest-tools'
import { Locale } from 'locale'
import { z } from 'zod'
import { StudentTrackDto } from './dto/studentTrackDto'
import { StudentTrackOverviewDto } from './dto/studentTrackOverviewDto'

export const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export enum UniversityId {
  UniversityOfAkureyri = 'UniversityOfAkureyri',
  BifrostUniversity = 'BifrostUniversity',
  HolarUniversity = 'HolarUniversity',
  AgriculturalUniversityOfIceland = 'AgriculturalUniversityOfIceland',
  UniversityOfIceland = 'UniversityOfIceland',
}

export interface UniversityCareerService {
  getStudentTrackHistory: (
    user: User,
    university: UniversityId,
    locale: Locale,
  ) => Promise<Array<StudentTrackDto> | null>

  getStudentTrack: (
    user: User,
    trackNumber: number,
    university: UniversityId,
    locale?: Locale,
  ) => Promise<StudentTrackOverviewDto | null>

  getStudentTrackPdf: (
    user: User,
    trackNumber: number,
    university: UniversityId,
    locale?: Locale,
  ) => Promise<Blob | null>
}
