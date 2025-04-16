import { z } from 'zod'
import {
  UnakLocale,
  LbhiLocale,
  BifrostLocale,
  HolarLocale,
  HILocale,
  BifrostFerillLocale,
  BifrostTranscriptLocale,
  HIFerillLocale,
  HITranscriptLocale,
  HolarFerillLocale,
  HolarTranscriptLocale,
  LbhiFerillLocale,
  LbhiTranscriptLocale,
  UnakFerillLocale,
  UnakTranscriptLocale,
  UnakApi,
  BifrostApi,
  HIApi,
  HolarApi,
  LbhiApi,
} from './clients'

export const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export enum UniversityId {
  UNIVERSITY_OF_AKUREYRI = 'unak',
  BIFROST_UNIVERSITY = 'bifrost',
  HOLAR_UNIVERSITY = 'holar',
  AGRICULTURAL_UNIVERSITY_OF_ICELAND = 'lbhi',
  UNIVERSITY_OF_ICELAND = 'hi',
  ICELAND_UNIVERSITY_OF_THE_ARTS = 'lhi',
}

export const UniversityShortIdMap: Record<UniversityIdShort, UniversityId> = {
  unak: UniversityId.UNIVERSITY_OF_AKUREYRI,
  bifrost: UniversityId.BIFROST_UNIVERSITY,
  holar: UniversityId.HOLAR_UNIVERSITY,
  lbhi: UniversityId.AGRICULTURAL_UNIVERSITY_OF_ICELAND,
  hi: UniversityId.UNIVERSITY_OF_ICELAND,
  lhi: UniversityId.ICELAND_UNIVERSITY_OF_THE_ARTS,
}

export const UniversityIdMap: Record<UniversityId, UniversityIdShort> = {
  unak: 'unak',
  bifrost: 'bifrost',
  holar: 'holar',
  lbhi: 'lbhi',
  lhi: 'lhi',
  hi: 'hi',
}

export type UniversityIdShort =
  | 'unak'
  | 'bifrost'
  | 'holar'
  | 'lbhi'
  | 'hi'
  | 'lhi'

export type UniversityApi = LbhiApi | UnakApi | HolarApi | BifrostApi | HIApi

export type UniversityLocales = {
  studentLocale: StudentLocale
  studentTransriptLocale: StudentTranscriptLocale
  studentTrackLocale: StudentTrackLocale
}

export type StudentLocale =
  | typeof UnakLocale
  | typeof LbhiLocale
  | typeof BifrostLocale
  | typeof HolarLocale
  | typeof HILocale

export type StudentTranscriptLocale =
  | typeof UnakTranscriptLocale
  | typeof LbhiTranscriptLocale
  | typeof BifrostTranscriptLocale
  | typeof HolarTranscriptLocale
  | typeof HITranscriptLocale

export type StudentTrackLocale =
  | typeof UnakFerillLocale
  | typeof LbhiFerillLocale
  | typeof BifrostFerillLocale
  | typeof HolarFerillLocale
  | typeof HIFerillLocale

export type StudentFileType =
  | 'transcript'
  | 'diploma'
  | 'diploma_supplement'
  | 'course_descriptions'
  | 'unknown'
