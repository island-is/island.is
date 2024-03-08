import { User } from '@island.is/auth-nest-tools'
import { Locale } from 'locale'
import { z } from 'zod'
import { StudentTrackDto } from './dto/studentTrackDto'
import { StudentTrackOverviewDto } from './dto/studentTrackOverviewDto'
import { BifrostApi, LbhiApi, UnakApi } from './clients'

export const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export enum UniversityId {
  UniversityOfAkureyri = 'UniversityOfAkureyri',
  BifrostUniversity = 'BifrostUniversity',
  HolarUniversity = 'HolarUniversity',
  AgriculturalUniversityOfIceland = 'AgriculturalUniversityOfIceland',
}

export interface UniversityCareerService {
  getStudentInfo: (
    user: User,
    university: UniversityId,
    locale: Locale,
  ) => Promise<Array<StudentTrackDto> | null>

  getStudentCareer: (
    user: User,
    trackNumber: number,
    university: UniversityId,
    locale?: Locale,
  ) => Promise<StudentTrackOverviewDto | null>

  getStudentCareerPdf: (
    user: User,
    trackNumber: number,
    university: UniversityId,
    locale?: Locale,
  ) => Promise<Blob | null>
}
