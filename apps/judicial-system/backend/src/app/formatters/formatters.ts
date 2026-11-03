import type { FormatMessage } from '@island.is/cms-translations'

import {
  DEFENDER_INDICTMENT_CASE_ROUTE,
  DEFENDER_REQUEST_CASE_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  applyDativeCaseToCourtName,
  enumerate,
  formatCaseType,
  formatDate,
  getSupportedCaseCustodyRestrictions,
  laws,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import {
  CaseCustodyRestrictions,
  CaseLegalProvisions,
  CaseType,
  courtSessionTypeNames,
  DefenderSubRole,
  Gender,
  getContactInformation,
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  core,
  custodyNotice,
  formatIcuMessage,
  notifications,
} from '../messages'
import { Case, DateLog } from '../modules/repository'

type SubjectAndBody = {
  subject: string
  body: string
}

const legalProvisionsOrder = (p: CaseLegalProvisions) => {
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
    case CaseLegalProvisions._97_1:
      return 5
    case CaseLegalProvisions._99_1_B:
      return 6
    case CaseLegalProvisions._100_1:
      return 7
    case CaseLegalProvisions._115_1:
      return 8
    case CaseLegalProvisions._115_1_A:
      return 9
    case CaseLegalProvisions._115_1_B:
      return 10
    case CaseLegalProvisions._115_1_C:
      return 11
    case CaseLegalProvisions._115_1_D:
      return 12
    case CaseLegalProvisions._115_1_E:
      return 13
    case CaseLegalProvisions._115_1_F:
      return 14
    case CaseLegalProvisions._115_1_G:
      return 15
    case CaseLegalProvisions._115_1_H:
      return 16
    default:
      return 999
  }
}

export const legalProvisionsCompare = (
  p1: CaseLegalProvisions,
  p2: CaseLegalProvisions,
) => {
  const o1 = legalProvisionsOrder(p1)
  const o2 = legalProvisionsOrder(p2)

  return o1 < o2 ? -1 : o1 > o2 ? 1 : 0
}

export const formatLegalProvisions = (
  legalProvisions?: CaseLegalProvisions[],
  legalBasis?: string,
): string => {
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
  prosecutorName?: string,
  institutionName?: string,
): string =>
  formatIcuMessage(notifications.prosecutorText, {
    prosecutorName: prosecutorName || 'NONE',
    institutionName: institutionName || 'NONE',
  })

export const formatCourtHeadsUpSmsNotification = (
  _formatMessage: FormatMessage,
  type: CaseType,
  prosecutorName?: string,
  arrestDate?: Date,
  requestedCourtDate?: Date,
): string => {
  const prosecutorText = getProsecutorText(prosecutorName)

  const arrestDateText = arrestDate
    ? formatIcuMessage(notifications.courtHeadsUp.arrestDateText, {
        date: formatDate(arrestDate),
        time: formatDate(arrestDate, 'p'),
      })
    : undefined

  const requestedCourtDateText = requestedCourtDate
    ? formatIcuMessage(notifications.courtHeadsUp.requestedCourtDateText, {
        date: formatDate(requestedCourtDate),
        time: formatDate(requestedCourtDate, 'p'),
      })
    : undefined

  const newCaseText = formatIcuMessage(notifications.courtHeadsUp.newCaseText, {
    caseType: type,
    courtTypeName: formatCaseType(type),
  })

  return [newCaseText, prosecutorText, arrestDateText, requestedCourtDateText]
    .filter(Boolean)
    .join(' ')
}

export const formatCourtReadyForCourtSmsNotification = (
  _formatMessage: FormatMessage,
  type: CaseType,
  prosecutorName?: string,
  prosecutorInstitution?: string,
): string => {
  const submittedCaseText = formatIcuMessage(
    notifications.courtReadyForCourt.submittedCase,
    { caseType: type, courtTypeName: formatCaseType(type) },
  )
  const prosecutorText = getProsecutorText(
    prosecutorName,
    prosecutorInstitution,
  )

  return [submittedCaseText, prosecutorText].filter(Boolean).join(' ')
}

export const formatCourtResubmittedToCourtSmsNotification = (
  _formatMessage: FormatMessage,
  courtCaseNumber?: string,
) => {
  return formatIcuMessage(notifications.courtResubmittedToCourt, {
    courtCaseNumber,
  })
}

export const formatDefenderResubmittedToCourtEmailNotification = (
  _formatMessage: FormatMessage,
  overviewUrl?: string,
  court?: string,
  courtCaseNumber?: string,
): SubjectAndBody => {
  const cf = notifications.defenderResubmittedToCourt
  const courtName = applyDativeCaseToCourtName(court || 'héraðsdómi')
  const subject = formatIcuMessage(cf.subject, { courtCaseNumber })
  const body = formatIcuMessage(cf.body, {
    courtCaseNumber,
    courtName,
  })
  const link = formatIcuMessage(cf.link, {
    defenderHasAccessToRvg: Boolean(overviewUrl),
    courtName,
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

  return { body: `${body}${link}`, subject }
}

export const formatProsecutorReadyForCourtEmailNotification = (
  _formatMessage: FormatMessage,
  policeCaseNumbers: string[],
  caseType: CaseType,
  courtName?: string,
  overviewUrl?: string,
): SubjectAndBody => {
  const subject = isInvestigationCase(caseType)
    ? formatIcuMessage(
        notifications.readyForCourt.investigationCaseReadyForCourtSubject,
        {
          caseType: formatCaseType(caseType),
        },
      )
    : formatIcuMessage(notifications.readyForCourt.subject, {
        isIndictmentCase: isIndictmentCase(caseType),
        caseType: formatCaseType(caseType),
      })

  const body = formatIcuMessage(notifications.readyForCourt.prosecutorHtml, {
    isIndictmentCase: isIndictmentCase(caseType),
    courtName: courtName?.replace('dómur', 'dóm'),
    policeCaseNumbersCount: policeCaseNumbers.length,
    policeCaseNumbers: policeCaseNumbers.join(', ') || '',
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

  return { subject, body }
}

export const formatProsecutorReceivedByCourtSmsNotification = (
  _formatMessage: FormatMessage,
  type: CaseType,
  court?: string,
  courtCaseNumber?: string,
): string => {
  const caseType = isIndictmentCase(type)
    ? 'indictmentCase'
    : isRestrictionCase(type)
    ? 'restrictionCase'
    : type === CaseType.OTHER
    ? 'otherInvestigationCase'
    : 'investigationCase'

  return formatIcuMessage(notifications.prosecutorReceivedByCourt, {
    court,
    caseType,
    caseTypeName: formatCaseType(type),
    courtCaseNumber,
  })
}

export const formatPostponedCourtDateEmailNotification = (
  _formatMessage: FormatMessage,
  theCase: Case,
  courtDate: DateLog,
  overviewUrl?: string,
): SubjectAndBody => {
  const subject = formatIcuMessage(
    notifications.postponedCourtDateEmail.subject,
    {
      courtCaseNumber: theCase.courtCaseNumber,
    },
  )
  const courtRoomText = formatIcuMessage(notifications.courtRoom, {
    courtRoom: courtDate.location || 'NONE',
  })
  const judgeText = formatIcuMessage(notifications.judge, {
    judgeName: theCase.judge?.name || 'NONE',
  })
  const body = formatIcuMessage(notifications.postponedCourtDateEmail.body, {
    courtName: theCase.court?.name ?? '',
    courtCaseNumber: theCase.courtCaseNumber,
    courtDate: formatDate(courtDate.date, 'PPPp')?.replace(' kl.', ', kl.'),
    courtSessionTypeName: theCase.courtSessionType
      ? courtSessionTypeNames[theCase.courtSessionType]
      : 'Óþekkt',
    courtRoomText,
    judgeText,
    hasAccessToRvg: Boolean(overviewUrl),
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

  return { subject, body }
}

export const formatArraignmentDateEmailNotification = ({
  courtName,
  courtCaseNumber,
  judgeName,
  registrarName,
  arraignmentDateLog,
}: {
  formatMessage: FormatMessage
  courtName?: string
  courtCaseNumber?: string
  judgeName?: string
  registrarName?: string
  arraignmentDateLog: DateLog
}) => {
  const { date: arraignmentDate, location: courtRoom } = arraignmentDateLog
  const cf = notifications.indictmentArraignmentDateEmail

  const scheduledCaseText = formatIcuMessage(cf.scheduledCase, {
    court: courtName,
    courtCaseNumber: courtCaseNumber ?? '',
  })

  const arraignmentDateText = formatIcuMessage(cf.arraignmentDate, {
    arraignmentDate: formatDate(arraignmentDate, 'PPPp')?.replace(
      ' kl.',
      ', kl.',
    ),
  })

  const courtRoomText = formatIcuMessage(notifications.courtRoom, {
    courtRoom: courtRoom || 'NONE',
  })

  const judgeText = formatIcuMessage(notifications.judge, {
    judgeName: judgeName || 'NONE',
  })
  const registrarText = registrarName
    ? formatIcuMessage(notifications.registrar, {
        registrarName: registrarName,
      })
    : undefined

  return {
    body: formatIcuMessage(cf.body, {
      scheduledCaseText,
      arraignmentDateText,
      courtRoomText,
      judgeText,
      registrarText: registrarText || 'NONE',
    }),
    subject: formatIcuMessage(cf.subject, {
      courtCaseNumber: courtCaseNumber || '',
    }),
  }
}

export const formatCourtCalendarInvitation = (
  theCase: Case,
  courtRoom?: string,
) => {
  const title = `Fyrirtaka í máli ${theCase.courtCaseNumber} - ${theCase.prosecutorsOffice?.name} gegn X`
  const location = `${theCase.court?.name} - ${
    courtRoom ? `Dómsalur ${courtRoom}` : 'Dómsalur hefur ekki verið skráður.'
  }`

  const { registrar, judge } = theCase
  const eventOrganizerUser = registrar ?? judge
  const eventOrganizer = eventOrganizerUser
    ? { ...getContactInformation(eventOrganizerUser) }
    : { name: '', email: '' }

  return {
    title,
    location,
    eventOrganizer,
  }
}

export const formatProsecutorCourtDateEmailNotification = (
  _formatMessage: FormatMessage,
  type: CaseType,
  courtCaseNumber?: string,
  court?: string,
  courtDate?: Date,
  courtRoom?: string,
  judgeName?: string,
  registrarName?: string,
  defenderName?: string,
  sessionArrangements?: SessionArrangements,
): SubjectAndBody => {
  const cf = notifications.prosecutorCourtDateEmail
  const scheduledCaseText = formatIcuMessage(cf.scheduledCase, {
    court,
    investigationPrefix:
      type === CaseType.OTHER
        ? 'onlyPrefix'
        : isInvestigationCase(type)
        ? 'withPrefix'
        : 'noPrefix',
    courtTypeName: formatCaseType(type),
  })
  const courtDateText = formatIcuMessage(cf.courtDate, {
    courtDate: courtDate
      ? formatDate(courtDate, 'PPPp')?.replace(' kl.', ', kl.')
      : 'NONE',
  })
  const courtRoomText = formatIcuMessage(notifications.courtRoom, {
    courtRoom: courtRoom || 'NONE',
  })
  const judgeText = formatIcuMessage(notifications.judge, {
    judgeName: judgeName || 'NONE',
  })
  const registrarText = registrarName
    ? formatIcuMessage(notifications.registrar, { registrarName })
    : undefined

  const defenderText = formatIcuMessage(notifications.defender, {
    defenderName: defenderName || 'NONE',
    sessionArrangements,
  })

  const body = formatIcuMessage(cf.body, {
    scheduledCaseText,
    courtDateText,
    courtRoomText,
    judgeText,
    registrarText: registrarText || 'NONE',
    defenderText,
    sessionArrangements,
  })

  const subject = formatIcuMessage(cf.subject, {
    courtCaseNumber: courtCaseNumber || '',
  })

  return { body, subject }
}

export const formatPrisonCourtDateEmailNotification = (
  _formatMessage: FormatMessage,
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
): string => {
  const courtText = formatIcuMessage(
    notifications.prisonCourtDateEmail.courtText,
    { court: court || 'NONE' },
  ).replace('dómur', 'dóms')
  const courtDateText = formatIcuMessage(
    notifications.prisonCourtDateEmail.courtDateText,
    {
      courtDate: courtDate
        ? formatDate(courtDate, 'PPPPp')
            ?.replace('dagur,', 'daginn')
            ?.replace(' kl.', ', kl.')
        : 'NONE',
    },
  )
  const requestedValidToDateText = formatIcuMessage(
    notifications.prisonCourtDateEmail.requestedValidToDateText,
    {
      requestedValidToDate: requestedValidToDate
        ? formatDate(requestedValidToDate, 'PPPPp')
            ?.replace('dagur,', 'dagsins')
            ?.replace(' kl.', ', kl.')
        : 'NONE',
    },
  )
  const requestText = formatIcuMessage(
    notifications.prisonCourtDateEmail.requestText,
    {
      caseType: type,
      gender: accusedGender,
      requestedValidToDateText,
    },
  )
  const isolationText = formatIcuMessage(
    notifications.prisonCourtDateEmail.isolationTextV2,
    { isolation: Boolean(isolation) },
  )
  const defenderText = formatIcuMessage(notifications.defender, {
    defenderName: defenderName ?? 'NONE',
    sessionArrangements,
  })

  return formatIcuMessage(notifications.prisonCourtDateEmail.body, {
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

export const formatDefenderCourtDateEmailNotification = (
  _formatMessage: FormatMessage,
  court?: string,
  courtCaseNumber?: string,
  courtDate?: Date,
  courtRoom?: string,
  judgeName?: string,
  registrarName?: string,
  prosecutorName?: string,
  prosecutorInstitution?: string,
  sessionArrangements?: SessionArrangements,
  defenderSubRole?: DefenderSubRole,
): string => {
  /** contentful strings */
  const defenderResponsibility = formatDefenderResponsibility({
    defenderSubRole,
    getCustomDefendantDefenderLabel: () =>
      `${
        sessionArrangements === SessionArrangements.ALL_PRESENT_SPOKESPERSON
          ? 'talsmann'
          : 'verjanda'
      } sakbornings`,
  })

  const cf = notifications.defenderCourtDateEmail
  const sessionArrangementsText = formatIcuMessage(cf.sessionArrangements, {
    court,
    defenderResponsibility,
  })
  const courtDateText = formatIcuMessage(cf.courtDate, {
    courtDate: courtDate
      ? formatDate(courtDate, 'PPPPp')
          ?.replace('dagur,', 'daginn')
          ?.replace(' kl.', ', kl.')
      : 'NONE',
  })
  const courtCaseNumberText = formatIcuMessage(cf.courtCaseNumber, {
    courtCaseNumber,
  })
  const courtRoomText = formatIcuMessage(notifications.courtRoom, {
    courtRoom: courtRoom || 'NONE',
  })
  const judgeText = formatIcuMessage(notifications.judge, {
    judgeName: judgeName,
  })
  const registrarText = registrarName
    ? formatIcuMessage(notifications.registrar, {
        registrarName: registrarName,
      })
    : undefined
  const prosecutorText = formatIcuMessage(cf.prosecutor, {
    prosecutorName: prosecutorName,
    prosecutorInstitution: prosecutorInstitution,
  })

  return formatIcuMessage(cf.body, {
    courtCaseNumberText,
    courtDateText,
    courtRoomText,
    judgeText,
    prosecutorText,
    registrarText: registrarText || 'NONE',
    sessionArrangementsText,
  })
}

export const formatDefenderCourtDateLinkEmailNotification = ({
  overviewUrl,
  court,
  courtCaseNumber,
  requestSharedWithDefender,
  defenderSubRole,
}: {
  formatMessage: FormatMessage
  overviewUrl?: string
  court?: string
  courtCaseNumber?: string
  requestSharedWithDefender?: boolean
  defenderSubRole?: DefenderSubRole
}): string => {
  const cf = notifications.defenderCourtDateEmail

  const info = {
    defenderHasAccessToRvg: Boolean(overviewUrl),
    courtName: applyDativeCaseToCourtName(court || 'héraðsdómi'),
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  }

  const defenderResponsibility = formatDefenderResponsibility({
    defenderSubRole,
    getCustomDefendantDefenderLabel: () => 'verjanda/talsmann sakbornings',
  })

  const body = requestSharedWithDefender
    ? formatIcuMessage(cf.linkBody, { courtCaseNumber, defenderResponsibility })
    : formatIcuMessage(cf.linkNoRequestBody, {
        courtName: court,
        courtCaseNumber,
        defenderResponsibility,
      })

  const link = requestSharedWithDefender
    ? formatIcuMessage(cf.link, info)
    : formatIcuMessage(cf.linkNoRequest, info)

  return `${body}${link}`
}

export const formatPrisonAdministrationRulingNotification = (
  _formatMessage: FormatMessage,
  isModifyingRuling: boolean,
  overviewUrl: string,
  courtCaseNumber?: string | undefined,
  courtName?: string | undefined,
): SubjectAndBody => {
  const subject = formatIcuMessage(notifications.signedRuling.subject, {
    isModifyingRuling,
    courtCaseNumber,
  })
  const body = formatIcuMessage(notifications.signedRuling.prisonAdminBody, {
    isModifyingRuling,
    courtCaseNumber: courtCaseNumber ?? '',
    courtName: applyDativeCaseToCourtName(courtName || 'héraðsdómi'),
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: `</a>`,
  })

  return { subject, body }
}

export const formatCourtRevokedSmsNotification = (
  formatMessage: FormatMessage,
  type: CaseType,
  prosecutorName?: string,
  requestedCourtDate?: Date,
  courtDate?: Date,
) => {
  // Prosecutor
  const prosecutorText = getProsecutorText(prosecutorName)
  // Court date
  const courtDateText = courtDate
    ? formatIcuMessage(notifications.courtRevoked.courtDate, {
        date: formatDate(courtDate),
        time: formatDate(courtDate, 'p'),
      })
    : requestedCourtDate
    ? formatIcuMessage(notifications.courtRevoked.requestedCourtDate, {
        date: formatDate(requestedCourtDate),
        time: formatDate(requestedCourtDate, 'p'),
      })
    : undefined
  const courtRevokedText = isInvestigationCase(type)
    ? formatMessage(notifications.courtRevoked.investigationCaseRevoked)
    : formatIcuMessage(notifications.courtRevoked.caseTypeRevoked, {
        caseType: type,
      })

  return [courtRevokedText, prosecutorText, courtDateText]
    .filter(Boolean)
    .join(' ')
}

export const formatPrisonRevokedEmailNotification = (
  _formatMessage: FormatMessage,
  type: CaseType,
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  defenderName?: string,
  isExtension?: boolean,
  courtCaseNumber?: string,
): string => {
  const cf = notifications.prisonRevokedEmail
  const courtText = formatIcuMessage(cf.court, { court })?.replace(
    'dómur',
    'dóms',
  )
  const courtDateText = formatIcuMessage(cf.courtDate, {
    courtDate: courtDate
      ? formatDate(courtDate, 'PPPPp')
          ?.replace('dagur,', 'daginn')
          ?.replace(' kl.', ', kl.')
      : 'NONE',
  })
  const defenderText = formatIcuMessage(cf.defender, {
    defenderName: defenderName || 'NONE',
  })
  const revokedCaseText = formatIcuMessage(cf.revokedCase, {
    caseType: type,
    prosecutorOffice: prosecutorOffice || 'NONE',
    isExtension,
    courtText,
    courtDateText,
  })

  return formatIcuMessage(cf.body, {
    revokedCaseText,
    defenderText,
    courtCaseNumber,
  })
}

export const stripHtmlTags = (html: string): string => {
  return html
    .replace(/(?:<br( ?)\/>)/g, '\n')
    .replace(/(?:<\/?strong>)/g, '')
    .replace(/(?:<a href=".*">)/g, '')
    .replace(/(?:<\/a>)/g, '')
}

export const formatCustodyRestrictions = (
  formatMessage: FormatMessage,
  caseType: CaseType,
  requestedRestrictions?: CaseCustodyRestrictions[],
  isCustodyIsolation?: boolean,
): string => {
  const restrictions = getSupportedCaseCustodyRestrictions(
    requestedRestrictions,
  )

  if (restrictions.length === 0) {
    return formatIcuMessage(custodyNotice.noFutherRestrictions, {
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

  return formatIcuMessage(custodyNotice.withFurtherRestrictions, {
    restrictions: formatedRestrictions,
    caseType: caseType,
  })
}

export const formatCourtOfAppealJudgeAssignedEmailNotification = (
  _formatMessage: FormatMessage,
  caseNumber: string,
  isForeperson: boolean,
  forepersonName: string,
  role: UserRole,
  overviewUrl: string,
) => {
  const subject = formatIcuMessage(notifications.COAJudgeAssigned.subject, {
    caseNumber,
  })

  const body = isForeperson
    ? formatIcuMessage(notifications.COAJudgeAssigned.forepersonBody, {
        caseNumber,
        linkStart: `<a href="${overviewUrl}">`,
        linkEnd: '</a>',
      })
    : formatIcuMessage(notifications.COAJudgeAssigned.body, {
        role,
        caseNumber,
        foreperson: forepersonName,
        linkStart: `<a href="${overviewUrl}">`,
        linkEnd: '</a>',
      })

  return { body, subject }
}

export const formatCourtIndictmentReadyForCourtEmailNotification = (
  formatMessage: FormatMessage,
  theCase: Case,
  overviewUrl?: string,
) => {
  const subject = formatIcuMessage(
    notifications.indictmentCourtReadyForCourt.subject,
  )

  const body = formatIcuMessage(
    notifications.indictmentCourtReadyForCourt.body,
    {
      indictmentSubtypes: enumerate(
        readableIndictmentSubtypes(
          theCase.policeCaseNumbers,
          theCase.indictmentSubtypes,
        ),
        formatMessage(core.and),
      ),
      prosecutorName: theCase.prosecutorsOffice?.name,
      linkStart: `<a href="${overviewUrl}">`,
      linkEnd: '</a>',
    },
  )

  return { body, subject }
}

export const formatDefenderResponsibility = ({
  defenderSubRole,
  getCustomDefendantDefenderLabel,
}: {
  defenderSubRole?: DefenderSubRole
  getCustomDefendantDefenderLabel?: () => string
}) =>
  defenderSubRole === DefenderSubRole.DEFENDANT_DEFENDER
    ? getCustomDefendantDefenderLabel
      ? getCustomDefendantDefenderLabel()
      : 'verjanda varnaraðila'
    : defenderSubRole === DefenderSubRole.VICTIM_LAWYER
    ? 'réttargæslumaður'
    : null

export const formatDefenderReadyForCourtEmailNotification = ({
  policeCaseNumber,
  courtName,
  overviewUrl,
  defenderSubRole,
}: {
  formatMessage: FormatMessage
  policeCaseNumber: string
  courtName: string
  overviewUrl?: string
  defenderSubRole?: DefenderSubRole
}) => {
  const subject = formatIcuMessage(
    notifications.defenderReadyForCourt.subject,
    {
      policeCaseNumber: policeCaseNumber,
    },
  )

  const body = formatIcuMessage(notifications.defenderReadyForCourt.body, {
    policeCaseNumber: policeCaseNumber,
    defenderResponsibility: formatDefenderResponsibility({ defenderSubRole }),
  })

  const link = formatIcuMessage(notifications.defenderReadyForCourt.link, {
    defenderHasAccessToRvg: Boolean(overviewUrl),
    courtName: applyDativeCaseToCourtName(courtName),
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
    isIndictmentCase(caseType)
      ? DEFENDER_INDICTMENT_CASE_ROUTE
      : DEFENDER_REQUEST_CASE_ROUTE
  }/${id}`
}

export const formatConfirmedIndictmentKey = (key: string) =>
  key.replace(/\/([^/]*)$/, '/confirmed/$1') ?? ''

export const filterWhitelistEmails = (
  emails: string[],
  domainWhitelist: string,
  emailWhitelist: string,
) => {
  if (!emails || emails.length === 0) return []

  const allowedDomains = new Set(
    domainWhitelist
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean),
  )
  const allowedEmails = new Set(
    emailWhitelist
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean),
  )

  return emails.filter((email) => {
    const domain = email.split('@')[1]
    return (
      domain && (allowedDomains.has(domain) || allowedEmails.has(email.trim()))
    )
  })
}
