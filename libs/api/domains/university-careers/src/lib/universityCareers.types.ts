import {
  UniversityId,
  UniversityIdShort,
} from '@island.is/clients/university-careers'

export interface InstitutionProps {
  id: UniversityId
  shortId: UniversityIdShort
  displayName?: string
  logoUrl?: string
}

export enum FileType {
  COURSE_DESCRIPTIONS,
  DIPLOMA,
  DIPLOMA_SUPPLEMENT,
  TRANSCRIPT,
}

export const UniversityContentfulReferenceIds: Record<UniversityId, string> = {
  unak: '02210',
  bifrost: 'bifrost-university',
  holar: '17217',
  lbhi: '17216',
  hi: '17201',
  lhi: '17228',
}
