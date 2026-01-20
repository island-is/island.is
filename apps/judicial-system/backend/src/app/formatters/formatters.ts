import type { FormatMessage } from '@island.is/cms-translations'

import {
  DEFENDER_INDICTMENT_ROUTE,
  DEFENDER_ROUTE,
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

import { core, custodyNotice, notifications } from '../messages'
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
    default:
      return 999
  }
}

const legalProvisionsCompare = (
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
  formatMessage: FormatMessage,
  prosecutorName?: string,
  institutionName?: string,
): string =>
  formatMessage(notifications.prosecutorText, {
    prosecutorName: prosecutorName || 'NONE',
    institutionName: institutionName || 'NONE',
  })

export const formatCourtHeadsUpSmsNotification = (
  formatMessage: FormatMessage,
  type: CaseType,
  prosecutorName?: string,
  arrestDate?: Date,
  requestedCourtDate?: Date,
): string => {
  const prosecutorText = getProsecutorText(formatMessage, prosecutorName)

  const arrestDateText = arrestDate
    ? formatMessage(notifications.courtHeadsUp.arrestDateText, {
        date: formatDate(arrestDate),
        time: formatDate(arrestDate, 'p'),
      })
    : undefined

  const requestedCourtDateText = requestedCourtDate
    ? formatMessage(notifications.courtHeadsUp.requestedCourtDateText, {
        date: formatDate(requestedCourtDate),
        time: formatDate(requestedCourtDate, 'p'),
      })
    : undefined

  const newCaseText = formatMessage(notifications.courtHeadsUp.newCaseText, {
    caseType: type,
    courtTypeName: formatCaseType(type),
  })

  return [newCaseText, prosecutorText, arrestDateText, requestedCourtDateText]
    .filter(Boolean)
    .join(' ')
}

export const formatCourtReadyForCourtSmsNotification = (
  formatMessage: FormatMessage,
  type: CaseType,
  prosecutorName?: string,
  prosecutorInstitution?: string,
): string => {
  const submittedCaseText = formatMessage(
    notifications.courtReadyForCourt.submittedCase,
    { caseType: type, courtTypeName: formatCaseType(type) },
  )
  const prosecutorText = getProsecutorText(
    formatMessage,
    prosecutorName,
    prosecutorInstitution,
  )

  return [submittedCaseText, prosecutorText].filter(Boolean).join(' ')
}

export const formatCourtResubmittedToCourtSmsNotification = (
  formatMessage: FormatMessage,
  courtCaseNumber?: string,
) => {
  return formatMessage(notifications.courtResubmittedToCourt, {
    courtCaseNumber,
  })
}

export const formatDefenderResubmittedToCourtEmailNotification = (
  formatMessage: FormatMessage,
  overviewUrl?: string,
  court?: string,
  courtCaseNumber?: string,
): SubjectAndBody => {
  const cf = notifications.defenderResubmittedToCourt
  const courtName = applyDativeCaseToCourtName(court || 'héraðsdómi')
  const subject = formatMessage(cf.subject, { courtCaseNumber })
  const body = formatMessage(cf.body, {
    courtCaseNumber,
    courtName,
  })
  const link = formatMessage(cf.link, {
    defenderHasAccessToRvg: Boolean(overviewUrl),
    courtName,
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

  return { body: `${body}${link}`, subject }
}

export const formatProsecutorReadyForCourtEmailNotification = (
  formatMessage: FormatMessage,
  policeCaseNumbers: string[],
  caseType: CaseType,
  courtName?: string,
  overviewUrl?: string,
): SubjectAndBody => {
  const subject = isInvestigationCase(caseType)
    ? formatMessage(
        notifications.readyForCourt.investigationCaseReadyForCourtSubject,
        {
          caseType: formatCaseType(caseType),
        },
      )
    : formatMessage(notifications.readyForCourt.subject, {
        isIndictmentCase: isIndictmentCase(caseType),
        caseType: formatCaseType(caseType),
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

export const formatProsecutorReceivedByCourtSmsNotification = (
  formatMessage: FormatMessage,
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

  return formatMessage(notifications.prosecutorReceivedByCourt, {
    court,
    caseType,
    caseTypeName: formatCaseType(type),
    courtCaseNumber,
  })
}

export const formatPostponedCourtDateEmailNotification = (
  formatMessage: FormatMessage,
  theCase: Case,
  courtDate: DateLog,
  overviewUrl?: string,
): SubjectAndBody => {
  const subject = formatMessage(notifications.postponedCourtDateEmail.subject, {
    courtCaseNumber: theCase.courtCaseNumber,
  })
  const courtRoomText = formatMessage(notifications.courtRoom, {
    courtRoom: courtDate.location || 'NONE',
  })
  const judgeText = formatMessage(notifications.judge, {
    judgeName: theCase.judge?.name || 'NONE',
  })
  const body = formatMessage(notifications.postponedCourtDateEmail.body, {
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
  formatMessage,
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

  const scheduledCaseText = formatMessage(cf.scheduledCase, {
    court: courtName,
    courtCaseNumber: courtCaseNumber ?? '',
  })

  const arraignmentDateText = formatMessage(cf.arraignmentDate, {
    arraignmentDate: formatDate(arraignmentDate, 'PPPp')?.replace(
      ' kl.',
      ', kl.',
    ),
  })

  const courtRoomText = formatMessage(notifications.courtRoom, {
    courtRoom: courtRoom || 'NONE',
  })

  const judgeText = formatMessage(notifications.judge, {
    judgeName: judgeName || 'NONE',
  })
  const registrarText = registrarName
    ? formatMessage(notifications.registrar, { registrarName: registrarName })
    : undefined

  return {
    body: formatMessage(cf.body, {
      scheduledCaseText,
      arraignmentDateText,
      courtRoomText,
      judgeText,
      registrarText: registrarText || 'NONE',
    }),
    subject: formatMessage(cf.subject, {
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
): SubjectAndBody => {
  const cf = notifications.prosecutorCourtDateEmail
  const scheduledCaseText = formatMessage(cf.scheduledCase, {
    court,
    investigationPrefix:
      type === CaseType.OTHER
        ? 'onlyPrefix'
        : isInvestigationCase(type)
        ? 'withPrefix'
        : 'noPrefix',
    courtTypeName: formatCaseType(type),
  })
  const courtDateText = formatMessage(cf.courtDate, {
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

  const body = formatMessage(cf.body, {
    scheduledCaseText,
    courtDateText,
    courtRoomText,
    judgeText,
    registrarText: registrarText || 'NONE',
    defenderText,
    sessionArrangements,
  })

  const subject = formatMessage(cf.subject, {
    courtCaseNumber: courtCaseNumber || '',
  })

  return { body, subject }
}

export const formatPrisonCourtDateEmailNotification = (
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
): string => {
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

export const formatDefenderCourtDateEmailNotification = (
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
  const sessionArrangementsText = formatMessage(cf.sessionArrangements, {
    court,
    defenderResponsibility,
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

export const formatDefenderCourtDateLinkEmailNotification = ({
  formatMessage,
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
    ? formatMessage(cf.linkBody, { courtCaseNumber, defenderResponsibility })
    : formatMessage(cf.linkNoRequestBody, {
        courtName: court,
        courtCaseNumber,
        defenderResponsibility,
      })

  const link = requestSharedWithDefender
    ? formatMessage(cf.link, info)
    : formatMessage(cf.linkNoRequest, info)

  return `${body}${link}`
}

export const formatPrisonAdministrationRulingNotification = (
  formatMessage: FormatMessage,
  isModifyingRuling: boolean,
  overviewUrl: string,
  courtCaseNumber?: string | undefined,
  courtName?: string | undefined,
): SubjectAndBody => {
  const subject = formatMessage(notifications.signedRuling.subject, {
    isModifyingRuling,
    courtCaseNumber,
  })
  const body = formatMessage(notifications.signedRuling.prisonAdminBody, {
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
  const prosecutorText = getProsecutorText(formatMessage, prosecutorName)
  // Court date
  const courtDateText = courtDate
    ? formatMessage(notifications.courtRevoked.courtDate, {
        date: formatDate(courtDate),
        time: formatDate(courtDate, 'p'),
      })
    : requestedCourtDate
    ? formatMessage(notifications.courtRevoked.requestedCourtDate, {
        date: formatDate(requestedCourtDate),
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

export const formatPrisonRevokedEmailNotification = (
  formatMessage: FormatMessage,
  type: CaseType,
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  defenderName?: string,
  isExtension?: boolean,
  courtCaseNumber?: string,
): string => {
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

export const formatCourtOfAppealJudgeAssignedEmailNotification = (
  formatMessage: FormatMessage,
  caseNumber: string,
  isForeperson: boolean,
  forepersonName: string,
  role: UserRole,
  overviewUrl: string,
) => {
  const subject = formatMessage(notifications.COAJudgeAssigned.subject, {
    caseNumber,
  })

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

export const formatCourtIndictmentReadyForCourtEmailNotification = (
  formatMessage: FormatMessage,
  theCase: Case,
  overviewUrl?: string,
) => {
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
    prosecutorName: theCase.prosecutorsOffice?.name,
    linkStart: `<a href="${overviewUrl}">`,
    linkEnd: '</a>',
  })

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
  formatMessage,
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
  const subject = formatMessage(notifications.defenderReadyForCourt.subject, {
    policeCaseNumber: policeCaseNumber,
  })

  const body = formatMessage(notifications.defenderReadyForCourt.body, {
    policeCaseNumber: policeCaseNumber,
    defenderResponsibility: formatDefenderResponsibility({ defenderSubRole }),
  })

  const link = formatMessage(notifications.defenderReadyForCourt.link, {
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
    isIndictmentCase(caseType) ? DEFENDER_INDICTMENT_ROUTE : DEFENDER_ROUTE
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
