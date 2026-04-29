import { z } from 'zod'

export const UNI_FACTORY = 'uni-factory'

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

export type StudyType = 'haskolanam' | 'ornam'
