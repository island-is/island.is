import {
  CaseIndictmentRulingDecision,
  CaseState,
  isCompletedCase,
} from './case'
import {
  InstitutionUser,
  isDefenceUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
} from './user'

/* eslint-disable @typescript-eslint/naming-convention */
export enum CourtSessionClosedLegalBasis {
  _2008_88_10_A = '_2008_88_10_A', // a-lið 10. gr. sml nr. 88/2008
  _2008_88_10_B = '_2008_88_10_B', // b-lið 10. gr. sml nr. 88/2008
  _2008_88_10_C = '_2008_88_10_C', // c-lið 10. gr. sml nr. 88/2008
  _2008_88_10_D = '_2008_88_10_D', // d-lið 10. gr. sml nr. 88/2008
  _2008_88_10_E = '_2008_88_10_E', // e-lið 10. gr. sml nr. 88/2008
  _2008_88_10_F = '_2008_88_10_F', // f-lið 10. gr. sml nr. 88/2008
  _2008_88_10_G = '_2008_88_10_G', // g-lið 10. gr. sml nr. 88/2008
}
/* eslint-enable @typescript-eslint/naming-convention */

export enum CourtSessionRulingType {
  NONE = 'NONE',
  JUDGEMENT = 'JUDGEMENT',
  ORDER = 'ORDER',
}

export enum CourtDocumentType {
  UPLOADED_DOCUMENT = 'UPLOADED_DOCUMENT',
  GENERATED_DOCUMENT = 'GENERATED_DOCUMENT',
  EXTERNAL_DOCUMENT = 'EXTERNAL_DOCUMENT',
}

interface CourtSession {
  startDate?: string | Date | null
  isConfirmed?: boolean | null
}

export const hasGeneratedCourtRecordPdf = (
  caseState: CaseState | null | undefined,
  indictmentRulingDecision: CaseIndictmentRulingDecision | null | undefined,
  withCourtSessions: boolean | null | undefined,
  courtSessions: CourtSession[] | null | undefined,
  user?: InstitutionUser,
) => {
  if (!withCourtSessions || !courtSessions || courtSessions.length === 0) {
    return false
  }

  if (isDistrictCourtUser(user)) {
    return Boolean(courtSessions[0].startDate)
  }

  if (isProsecutionUser(user) || isDefenceUser(user)) {
    return Boolean(courtSessions[0].isConfirmed)
  }

  if (isPublicProsecutionOfficeUser(user)) {
    return isCompletedCase(caseState) && Boolean(courtSessions[0].isConfirmed)
  }

  if (isPrisonAdminUser(user)) {
    return (
      isCompletedCase(caseState) &&
      indictmentRulingDecision === CaseIndictmentRulingDecision.FINE &&
      Boolean(courtSessions[0].isConfirmed)
    )
  }

  return false
}
