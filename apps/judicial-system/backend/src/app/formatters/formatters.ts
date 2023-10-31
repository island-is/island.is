import type { FormatMessage } from '@island.is/cms-translations'

import {
  DEFENDER_INDICTMENT_ROUTE,
  DEFENDER_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  capitalize,
  caseTypes,
  enumerate,
  formatDate,
  formatNationalId,
  getSupportedCaseCustodyRestrictions,
  laws,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import type { Gender, UserRole } from '@island.is/judicial-system/types'
import {
  CaseCustodyRestrictions,
  CaseLegalProvisions,
  CaseType,
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'

import { core, custodyNotice, notifications } from '../messages'
import { Case } from '../modules/case'

type SubjectAndBody = {
  subject: string
  body: string
}

function legalProvisionsOrder(p: CaseLegalProvisions) {
  switch (p) {
    case CaseLegalProvisions._95_1_A:
      return 0
    case CaseLegalProvisions._95_1_B:
      return 1
    case CaseLegalProvisions._95_1_C:
      return 2
    case CaseLegalProvisions._95_1_D:
      return 3
    case CaseLegalProvisions._95_2:
      return 4
    case CaseLegalProvisions._99_1_B:
      return 6
    case CaseLegalProvisions._100_1:
      return 7
    default:
      return 999
  }
}

function legalProvisionsCompare(
  p1: CaseLegalProvisions,
  p2: CaseLegalProvisions,
) {
  const o1 = legalProvisionsOrder(p1)
  const o2 = legalProvisionsOrder(p2)

  return o1 < o2 ? -1 : o1 > o2 ? 1 : 0
}

export function formatLegalProvisions(
  legalProvisions?: CaseLegalProvisions[],
  legalBasis?: string,
): string {
  const list = legalProvisions
    ?.sort((p1, p2) => legalProvisionsCompare(p1, p2))
    .reduce((s, l) => `${s}${laws[l]}\n`, '')
    .slice(0, -1)

  return list
    ? legalBasis
      ? `${list}\n${legalBasis}`
      : list
    : legalBasis
    ? legalBasis
    : 'Lagaákvæði ekki skráð'
}

const getProsecutorText = (
  formatMessage: FormatMessage,
  prosecutorName?: string,
  institutionName?: string,
): string =>
  formatMessage(notifications.prosecutorText, {
    prosecutorName: prosecutorName || 'NONE',
    institutionName: institutionName || 'NONE',
  })

export function formatCourtHeadsUpSmsNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  prosecutorName?: string,
  arrestDate?: Date,
  requestedCourtDate?: Date,
): string {
  const prosecutorText = getProsecutorText(formatMessage, prosecutorName)

  const arrestDateText = arrestDate
    ? formatMessage(notifications.courtHeadsUp.arrestDateText, {
        date: formatDate(arrestDate, 'P'),
        time: formatDate(arrestDate, 'p'),
      })
    : undefined

  const requestedCourtDateText = requestedCourtDate
    ? formatMessage(notifications.courtHeadsUp.requestedCourtDateText, {
        date: formatDate(requestedCourtDate, 'P'),
        time: formatDate(requestedCourtDate, 'p'),
      })
    : undefined

  const newCaseText = formatMessage(notifications.courtHeadsUp.newCaseText, {
    caseType: type,
    courtTypeName: caseTypes[type],
  })

  return [newCaseText, prosecutorText, arrestDateText, requestedCourtDateText]
    .filter(Boolean)
    .join(' ')
}

export function formatCourtReadyForCourtSmsNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  prosecutorName?: string,
  prosecutorInstitution?: string,
): string {
  const submittedCaseText = formatMessage(
    notifications.courtReadyForCourt.submittedCase,
    { caseType: type, courtTypeName: caseTypes[type] },
  )
  const prosecutorText = getProsecutorText(
    formatMessage,
    prosecutorName,
    prosecutorInstitution,
  )

  return [submittedCaseText, prosecutorText].filter(Boolean).join(' ')
}

export function formatCourtResubmittedToCourtSmsNotification(
  formatMessage: FormatMessage,
  courtCaseNumber?: string,
) {
  return formatMessage(notifications.courtResubmittedToCourt, {
    courtCaseNumber,
  })
}

export function formatDefenderResubmittedToCourtEmailNotification(
  formatMessage: FormatMessage,
  overviewUrl?: string,
  court?: string,
  courtCaseNumber?: string,
): SubjectAndBody {
  const cf = notifications.defenderResubmittedToCourt
  const subject = formatMessage(cf.subject, { courtCaseNumber })
  const body = formatMessage(cf.body, {
    courtCaseNumber,
    courtName: court?.replace('dómur', 'dómi'),
  })
  const link = formatMessage(cf.link, {
    defenderHasAccessToRvg: Boolean(overviewUrl),
    courtName: court?.replace('dómur', 'dómi'),
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

  return { body: `${body}${link}`, subject }
}

export function formatProsecutorReadyForCourtEmailNotification(
  formatMessage: FormatMessage,
  policeCaseNumbers: string[],
  caseType: CaseType,
  courtName?: string,
  overviewUrl?: string,
): SubjectAndBody {
  const subject = isInvestigationCase(caseType)
    ? formatMessage(
        notifications.readyForCourt.investigationCaseReadyForCourtSubject,
        {
          caseType: caseTypes[caseType],
        },
      )
    : formatMessage(notifications.readyForCourt.subject, {
        isIndictmentCase: isIndictmentCase(caseType),
        caseType: caseTypes[caseType],
      })

  const body = formatMessage(notifications.readyForCourt.prosecutorHtml, {
    isIndictmentCase: isIndictmentCase(caseType),
    courtName: courtName?.replace('dómur', 'dóm'),
    policeCaseNumbersCount: policeCaseNumbers.length,
    policeCaseNumbers: policeCaseNumbers.join(', ') || '',
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

  return { subject, body }
}

export function formatProsecutorReceivedByCourtSmsNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  court?: string,
  courtCaseNumber?: string,
): string {
  const caseType = isIndictmentCase(type)
    ? 'indictmentCase'
    : isRestrictionCase(type)
    ? 'restrictionCase'
    : type === CaseType.OTHER
    ? 'otherInvestigationCase'
    : 'investigationCase'

  return formatMessage(notifications.prosecutorReceivedByCourt, {
    court,
    caseType,
    caseTypeName: caseTypes[type],
    courtCaseNumber,
  })
}

export function formatProsecutorCourtDateEmailNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  courtCaseNumber?: string,
  court?: string,
  courtDate?: Date,
  courtRoom?: string,
  judgeName?: string,
  registrarName?: string,
  defenderName?: string,
  sessionArrangements?: SessionArrangements,
): SubjectAndBody {
  const cf = notifications.prosecutorCourtDateEmail
  const scheduledCaseText = isIndictmentCase(type)
    ? formatMessage(cf.sheduledIndictmentCase, { court, courtCaseNumber })
    : formatMessage(cf.scheduledCase, {
        court,
        investigationPrefix:
          type === CaseType.OTHER
            ? 'onlyPrefix'
            : isInvestigationCase(type)
            ? 'withPrefix'
            : 'noPrefix',
        courtTypeName: caseTypes[type],
      })
  const courtDateText = formatMessage(cf.courtDate, {
    isIndictment: isIndictmentCase(type),
    courtDate: courtDate
      ? formatDate(courtDate, 'PPPp')?.replace(' kl.', ', kl.')
      : 'NONE',
  })
  const courtRoomText = formatMessage(notifications.courtRoom, {
    courtRoom: courtRoom || 'NONE',
  })

  const judgeText = formatMessage(notifications.judge, {
    judgeName: judgeName || 'NONE',
  })
  const registrarText = registrarName
    ? formatMessage(notifications.registrar, { registrarName })
    : undefined

  const defenderText = formatMessage(notifications.defender, {
    defenderName: defenderName || 'NONE',
    sessionArrangements,
  })

  const body = isIndictmentCase(type)
    ? formatMessage(cf.bodyIndictments, {
        scheduledCaseText,
        courtDateText,
        courtRoomText,
        judgeText,
        registrarText: registrarText || 'NONE',
      })
    : formatMessage(cf.body, {
        scheduledCaseText,
        courtDateText,
        courtRoomText,
        judgeText,
        registrarText: registrarText || 'NONE',
        defenderText,
        sessionArrangements,
      })

  const subject = formatMessage(cf.subject, {
    isIndictment: isIndictmentCase(type),
    courtCaseNumber: courtCaseNumber || '',
  })

  return { body, subject }
}

export function formatPrisonCourtDateEmailNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  accusedGender?: Gender,
  requestedValidToDate?: Date,
  isolation?: boolean,
  defenderName?: string,
  isExtension?: boolean,
  sessionArrangements?: SessionArrangements,
  courtCaseNumber?: string,
): string {
  const courtText = formatMessage(
    notifications.prisonCourtDateEmail.courtText,
    { court: court || 'NONE' },
  ).replace('dómur', 'dóms')
  const courtDateText = formatMessage(
    notifications.prisonCourtDateEmail.courtDateText,
    {
      courtDate: courtDate
        ? formatDate(courtDate, 'PPPPp')
            ?.replace('dagur,', 'daginn')
            ?.replace(' kl.', ', kl.')
        : 'NONE',
    },
  )
  const requestedValidToDateText = formatMessage(
    notifications.prisonCourtDateEmail.requestedValidToDateText,
    {
      requestedValidToDate: requestedValidToDate
        ? formatDate(requestedValidToDate, 'PPPPp')
            ?.replace('dagur,', 'dagsins')
            ?.replace(' kl.', ', kl.')
        : 'NONE',
    },
  )
  const requestText = formatMessage(
    notifications.prisonCourtDateEmail.requestText,
    {
      caseType: type,
      gender: accusedGender,
      requestedValidToDateText,
    },
  )
  const isolationText = formatMessage(
    notifications.prisonCourtDateEmail.isolationTextV2,
    { isolation: Boolean(isolation) },
  )
  const defenderText = formatMessage(notifications.defender, {
    defenderName: defenderName ?? 'NONE',
    sessionArrangements,
  })

  return formatMessage(notifications.prisonCourtDateEmail.body, {
    caseType: type,
    prosecutorOffice: prosecutorOffice || 'NONE',
    courtText,
    isExtension,
    courtDateText,
    requestText,
    isolationText,
    defenderText,
    sessionArrangements,
    courtCaseNumber,
  })
}

export function formatDefenderCourtDateEmailNotification(
  formatMessage: FormatMessage,
  court?: string,
  courtCaseNumber?: string,
  courtDate?: Date,
  courtRoom?: string,
  judgeName?: string,
  registrarName?: string,
  prosecutorName?: string,
  prosecutorInstitution?: string,
  sessionArrangements?: SessionArrangements,
): string {
  /** contentful strings */
  const cf = notifications.defenderCourtDateEmail
  const sessionArrangementsText = formatMessage(cf.sessionArrangements, {
    court,
    sessionArrangements,
  })
  const courtDateText = formatMessage(cf.courtDate, {
    courtDate: courtDate
      ? formatDate(courtDate, 'PPPPp')
          ?.replace('dagur,', 'daginn')
          ?.replace(' kl.', ', kl.')
      : 'NONE',
  })
  const courtCaseNumberText = formatMessage(cf.courtCaseNumber, {
    courtCaseNumber,
  })
  const courtRoomText = formatMessage(notifications.courtRoom, {
    courtRoom: courtRoom || 'NONE',
  })
  const judgeText = formatMessage(notifications.judge, {
    judgeName: judgeName,
  })
  const registrarText = registrarName
    ? formatMessage(notifications.registrar, {
        registrarName: registrarName,
      })
    : undefined
  const prosecutorText = formatMessage(cf.prosecutor, {
    prosecutorName: prosecutorName,
    prosecutorInstitution: prosecutorInstitution,
  })

  return formatMessage(cf.body, {
    courtCaseNumberText,
    courtDateText,
    courtRoomText,
    judgeText,
    prosecutorText,
    registrarText: registrarText || 'NONE',
    sessionArrangementsText,
  })
}

export function formatDefenderCourtDateLinkEmailNotification(
  formatMessage: FormatMessage,
  overviewUrl?: string,
  court?: string,
  courtCaseNumber?: string,
  requestSharedWithDefender?: boolean,
): string {
  const cf = notifications.defenderCourtDateEmail
  const body = requestSharedWithDefender
    ? formatMessage(cf.linkBody, { courtCaseNumber })
    : formatMessage(cf.linkNoRequestBody, { courtName: court, courtCaseNumber })
  const link = requestSharedWithDefender
    ? formatMessage(cf.link, {
        defenderHasAccessToRvg: Boolean(overviewUrl),
        courtName: court?.replace('dómur', 'dómi'),
        linkStart: `<a href="${overviewUrl}">`,
        linkEnd: '</a>',
      })
    : formatMessage(cf.linkNoRequest, {
        defenderHasAccessToRvg: Boolean(overviewUrl),
        courtName: court?.replace('dómur', 'dómi'),
        linkStart: `<a href="${overviewUrl}">`,
        linkEnd: '</a>',
      })

  return `${body}${link}`
}

export function formatPrisonAdministrationRulingNotification(
  formatMessage: FormatMessage,
  isModifyingRuling: boolean,
  overviewUrl: string,
  courtCaseNumber?: string | undefined,
  courtName?: string | undefined,
): SubjectAndBody {
  const subject = formatMessage(notifications.signedRuling.subject, {
    isModifyingRuling,
    courtCaseNumber,
  })
  const body = formatMessage(notifications.signedRuling.prisonAdminBody, {
    isModifyingRuling,
    courtCaseNumber: courtCaseNumber ?? '',
    courtName: courtName?.replace('dómur', 'dómi') ?? '',
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: `</a>`,
  })

  return { subject, body }
}

export function formatCourtRevokedSmsNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  prosecutorName?: string,
  requestedCourtDate?: Date,
  courtDate?: Date,
) {
  // Prosecutor
  const prosecutorText = getProsecutorText(formatMessage, prosecutorName)
  // Court date
  const courtDateText = courtDate
    ? formatMessage(notifications.courtRevoked.courtDate, {
        date: formatDate(courtDate, 'P'),
        time: formatDate(courtDate, 'p'),
      })
    : requestedCourtDate
    ? formatMessage(notifications.courtRevoked.requestedCourtDate, {
        date: formatDate(requestedCourtDate, 'P'),
        time: formatDate(requestedCourtDate, 'p'),
      })
    : undefined
  const courtRevokedText = isInvestigationCase(type)
    ? formatMessage(notifications.courtRevoked.investigationCaseRevoked)
    : formatMessage(notifications.courtRevoked.caseTypeRevoked, {
        caseType: type,
      })

  return [courtRevokedText, prosecutorText, courtDateText]
    .filter(Boolean)
    .join(' ')
}

export function formatPrisonRevokedEmailNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  defenderName?: string,
  isExtension?: boolean,
  courtCaseNumber?: string,
): string {
  const cf = notifications.prisonRevokedEmail
  const courtText = formatMessage(cf.court, { court })?.replace('dómur', 'dóms')
  const courtDateText = formatMessage(cf.courtDate, {
    courtDate: courtDate
      ? formatDate(courtDate, 'PPPPp')
          ?.replace('dagur,', 'daginn')
          ?.replace(' kl.', ', kl.')
      : 'NONE',
  })
  const defenderText = formatMessage(cf.defender, {
    defenderName: defenderName || 'NONE',
  })
  const revokedCaseText = formatMessage(cf.revokedCase, {
    caseType: type,
    prosecutorOffice: prosecutorOffice || 'NONE',
    isExtension,
    courtText,
    courtDateText,
  })

  return formatMessage(cf.body, {
    revokedCaseText,
    defenderText,
    courtCaseNumber,
  })
}

export function formatDefenderRevokedEmailNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  defendantNationalId?: string,
  defendantName?: string,
  defendantNoNationalId?: boolean,
  court?: string,
  courtDate?: Date,
): string {
  const cf = notifications.defenderRevokedEmail
  const courtText = formatMessage(cf.court, {
    court: court || 'NONE',
  }).replace('dómur', 'dómi')
  const courtDateText = formatMessage(cf.courtDate, {
    courtDate: courtDate
      ? formatDate(courtDate, 'PPPPp')
          ?.replace('dagur,', 'daginn')
          ?.replace(' kl.', ', kl.')
      : 'NONE',
  })
  const revokedText = isIndictmentCase(type)
    ? formatMessage(cf.revokedIndictment, {
        courtText,
        courtDateText,
      })
    : formatMessage(cf.revoked, {
        courtText,
        courtDateText,
        investigationPrefix:
          type === CaseType.OTHER
            ? 'onlyPrefix'
            : isInvestigationCase(type)
            ? 'withPrefix'
            : 'noPrefix',
        courtTypeName: caseTypes[type],
      })
  const defendantNationalIdText = defendantNoNationalId
    ? defendantNationalId || 'NONE'
    : formatNationalId(defendantNationalId || 'NONE')
  const defendantText = formatMessage(cf.defendant, {
    defendantName: defendantName || 'NONE',
    defendantNationalId: defendantNationalIdText,
    defendantNoNationalId: defendantNoNationalId ? 'NONE' : 'SOME',
  })
  const defenderAssignedText = formatMessage(cf.defenderAssignedV2)

  return formatMessage(cf.body, {
    revokedText,
    defendantText,
    defenderAssignedText,
  })
}

export function stripHtmlTags(html: string): string {
  return html
    .replace(/(?:<br( ?)\/>)/g, '\n')
    .replace(/(?:<\/?strong>)/g, '')
    .replace(/(?:<a href=".*">)/g, '')
    .replace(/(?:<\/a>)/g, '')
}

export function formatCustodyRestrictions(
  formatMessage: FormatMessage,
  caseType: CaseType,
  requestedRestrictions?: CaseCustodyRestrictions[],
  isCustodyIsolation?: boolean,
): string {
  const restrictions = getSupportedCaseCustodyRestrictions(
    requestedRestrictions,
  )

  if (restrictions.length === 0) {
    return formatMessage(custodyNotice.noFutherRestrictions, {
      hasIsolation: isCustodyIsolation,
      caseType,
    })
  }

  const formatedRestrictions = enumerate(
    restrictions.map((x) =>
      formatMessage(custodyNotice.rulingRestrictions[x.type]),
    ),
    'og',
  )

  return formatMessage(custodyNotice.withFurtherRestrictions, {
    restrictions: formatedRestrictions,
    caseType: caseType,
  })
}

export function formatDefenderAssignedEmailNotification(
  formatMessage: FormatMessage,
  theCase: Case,
  overviewUrl?: string,
): SubjectAndBody {
  const subject = formatMessage(notifications.defenderAssignedEmail.subject, {
    court: capitalize(theCase.court?.name ?? ''),
  })

  const body = formatMessage(notifications.defenderAssignedEmail.body, {
    defenderHasAccessToRVG: Boolean(overviewUrl),
    courtCaseNumber: capitalize(theCase.courtCaseNumber ?? ''),
    court: theCase.court?.name ?? '',
    courtName: theCase.court?.name.replace('dómur', 'dómi') ?? '',
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

  return { body, subject }
}

export function formatCourtOfAppealJudgeAssignedEmailNotification(
  formatMessage: FormatMessage,
  caseNumber: string,
  isForeperson: boolean,
  forepersonName: string,
  role: UserRole,
  overviewUrl: string,
) {
  const subject = formatMessage(notifications.COAJudgeAssigned.subject, {
    caseNumber,
  })

  console.log(isForeperson)
  const body = isForeperson
    ? formatMessage(notifications.COAJudgeAssigned.forepersonBody, {
        caseNumber,
        linkStart: `<a href="${overviewUrl}">`,
        linkEnd: '</a>',
      })
    : formatMessage(notifications.COAJudgeAssigned.body, {
        role,
        caseNumber,
        foreperson: forepersonName,
        linkStart: `<a href="${overviewUrl}">`,
        linkEnd: '</a>',
      })

  return { body, subject }
}

export function formatCourtIndictmentReadyForCourtEmailNotification(
  formatMessage: FormatMessage,
  theCase: Case,
  overviewUrl?: string,
) {
  const subject = formatMessage(
    notifications.indictmentCourtReadyForCourt.subject,
  )

  const body = formatMessage(notifications.indictmentCourtReadyForCourt.body, {
    indictmentSubtypes: enumerate(
      readableIndictmentSubtypes(
        theCase.policeCaseNumbers,
        theCase.indictmentSubtypes,
      ),
      formatMessage(core.and),
    ),
    prosecutorName: theCase.prosecutor?.institution?.name,
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

  return { body, subject }
}

export function formatDefenderReadyForCourtEmailNotification(
  formatMessage: FormatMessage,
  policeCaseNumber: string,
  courtName: string,
  overviewUrl?: string,
) {
  const subject = formatMessage(notifications.defenderReadyForCourtSubject, {
    policeCaseNumber: policeCaseNumber,
  })

  const body = formatMessage(notifications.defenderReadyForCourtBody, {
    policeCaseNumber: policeCaseNumber,
  })

  const link = formatMessage(notifications.defenderLink, {
    defenderHasAccessToRvg: Boolean(overviewUrl),
    courtName: courtName.replace('dómur', 'dómi'),
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

  return { subject, body: `${body}${link}` }
}

export const formatDefenderRoute = (
  baseUrl: string,
  type: string,
  id: string,
) => {
  const caseType = type as CaseType
  return `${baseUrl}${
    isIndictmentCase(caseType) ? DEFENDER_INDICTMENT_ROUTE : DEFENDER_ROUTE
  }/${id}`
}
