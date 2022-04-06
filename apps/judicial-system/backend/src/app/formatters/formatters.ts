import {
  formatDate,
  formatNationalId,
  laws,
  caseTypes,
} from '@island.is/judicial-system/formatters'
import type { FormatMessage } from '@island.is/cms-translations'
import {
  CaseLegalProvisions,
  CaseType,
  isInvestigationCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import type { Gender } from '@island.is/judicial-system/types'

import { notifications } from '../messages'

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
): string =>
  formatMessage(notifications.prosecutorText, {
    prosecutorName: prosecutorName || 'NONE',
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
  court?: string,
): string {
  const submittedCaseText = formatMessage(
    notifications.courtReadyForCourt.submittedCase,
    { caseType: type, courtTypeName: caseTypes[type] },
  )
  const prosecutorText = getProsecutorText(formatMessage, prosecutorName)
  const courtText = formatMessage(notifications.courtReadyForCourt.courtText, {
    court: court ?? 'NONE',
  })

  return [submittedCaseText, prosecutorText, courtText]
    .filter(Boolean)
    .join(' ')
}

export function formatCourtResubmittedToCourtSmsNotification(
  formatMessage: FormatMessage,
  courtCaseNumber?: string,
) {
  return formatMessage(notifications.courtResubmittedToCourt, {
    courtCaseNumber,
  })
}

export function formatProsecutorReceivedByCourtSmsNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  court?: string,
  courtCaseNumber?: string,
): string {
  let investigationPrefix = 'noPrefix'
  if (type === CaseType.OTHER) {
    investigationPrefix = 'onlyPrefix'
  } else if (isInvestigationCase(type)) {
    investigationPrefix = 'withPrefix'
  }

  return formatMessage(notifications.prosecutorReceivedByCourt, {
    court,
    investigationPrefix,
    courtTypeName: caseTypes[type],
    courtCaseNumber,
  })
}

export function formatProsecutorCourtDateEmailNotification(
  formatMessage: FormatMessage,
  type: CaseType,
  court?: string,
  courtDate?: Date,
  courtRoom?: string,
  judgeName?: string,
  registrarName?: string,
  defenderName?: string,
  sessionArrangements?: SessionArrangements,
): string {
  const cf = notifications.prosecutorCourtDateEmail
  const scheduledCaseText = formatMessage(cf.scheduledCase, {
    court,
    investigationPrefix:
      type === CaseType.OTHER
        ? 'onlyPrefix'
        : isInvestigationCase(type)
        ? 'withPrefix'
        : 'noPrefix',
    courtTypeName: caseTypes[type],
  })
  const courtDateText = formatMessage(cf.courtDate, { courtDate })
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

  return formatMessage(cf.body, {
    scheduledCaseText,
    courtDateText,
    courtRoomText,
    judgeText,
    registrarText: registrarText || 'NONE',
    defenderText,
    sessionArrangements,
  })
}

export function formatPrisonCourtDateEmailNotification(
  formatMessage: FormatMessage,
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  accusedName?: string,
  accusedGender?: Gender,
  requestedValidToDate?: Date,
  isolation?: boolean,
  defenderName?: string,
  isExtension?: boolean,
  sessionArrangements?: SessionArrangements,
): string {
  const courtText = formatMessage(
    notifications.prisonCourtDateEmail.courtText,
    { court: court || 'NONE' },
  ).replace('dómur', 'dóms')

  const courtDateText = formatMessage(
    notifications.prisonCourtDateEmail.courtDateText,
    {
      date: formatDate(courtDate, 'PPPP')?.replace('dagur,', 'daginn'),
      time: courtDate,
      dateMissing: courtDate ? 'defined' : 'missing',
    },
  )

  const requestedValidToDateText = formatMessage(
    notifications.prisonCourtDateEmail.requestedValidToDateText,
    {
      date: formatDate(requestedValidToDate, 'PPPP')?.replace(
        'dagur,',
        'dagsins',
      ),
      time: requestedValidToDate,
      dateMissing: requestedValidToDate ? 'defined' : 'missing',
    },
  )

  const requestText = formatMessage(
    notifications.prisonCourtDateEmail.requestText,
    {
      accusedName: accusedName ?? 'NONE',
      gender: accusedGender,
      requestedValidToDateText,
    },
  )

  const isolationText = formatMessage(
    notifications.prisonCourtDateEmail.isolationText,
    { isolation: isolation ? 'TRUE' : 'FALSE' },
  )
<<<<<<< HEAD
  const defenderText = formatMessage(notifications.defender, {
    defenderName: defenderName ?? 'NONE',
    sessionArrangements,
  })
=======
  const defenderText = formatMessage(
    notifications.prisonCourtDateEmail.defenderText,
    {
      defenderName: defenderName ?? 'NONE',
      sessionArrangements,
    },
  )
>>>>>>> 58e09f522 (feat(j-s): move strings to Contentful in prison court date email)

  return formatMessage(notifications.prisonCourtDateEmail.body, {
    prosecutorOffice: prosecutorOffice || 'NONE',
    courtText,
    isExtension: isExtension ? 'yes' : 'no',
    courtDateText,
    requestText,
    isolationText,
    defenderText,
<<<<<<< HEAD
    sessionArrangements,
=======
>>>>>>> 58e09f522 (feat(j-s): move strings to Contentful in prison court date email)
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
    date: formatDate(courtDate, 'PPPP')?.replace('dagur,', 'daginn'),
    time: courtDate,
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

// This function is only intended for case type CUSTODY
export function formatPrisonRulingEmailNotification(
  formatMessage: FormatMessage,
  courtEndTime?: Date,
): string {
  return formatMessage(notifications.prisonRulingEmail, { courtEndTime })
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

  const courtRevokedText = formatMessage(
    notifications.courtRevoked.caseTypeRevoked,
    {
      caseType: type,
    },
  )

  return [courtRevokedText, prosecutorText, courtDateText]
    .filter(Boolean)
    .join(' ')
}

export function formatPrisonRevokedEmailNotification(
  formatMessage: FormatMessage,
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  accusedName?: string,
  defenderName?: string,
  isExtension?: boolean,
): string {
  const cf = notifications.prisonRevokedEmail
  const courtText = formatMessage(cf.court, { court })?.replace('dómur', 'dóms')
  const courtDateText = formatMessage(cf.courtDate, {
    courtDate: courtDate || 'NONE',
    date: formatDate(courtDate, 'PPPP')?.replace('dagur,', 'daginn'),
  })
  const accusedNameText = formatMessage(notifications.accused, {
    accusedName: accusedName || 'NONE',
  })
  const defenderText = formatMessage(cf.defender, {
    defenderName: defenderName || 'NONE',
  })
  const revokedCaseText = formatMessage(cf.revokedCase, {
    prosecutorOffice: prosecutorOffice || 'NONE',
    isExtension: isExtension ? 'yes' : 'no',
    courtText,
    courtDateText,
  })
  return formatMessage(cf.body, {
    revokedCaseText,
    accusedNameText,
    defenderText,
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
    date: formatDate(courtDate, 'PPPP')?.replace('dagur,', 'daginn'),
    courtDate: courtDate || 'NONE',
  })
  const revokedText = formatMessage(cf.revoked, {
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
    ? defendantNationalId
    : formatNationalId(defendantNationalId || 'NONE')
  const defendantText = formatMessage(cf.defendant, {
    defendantName: defendantName || 'NONE',
    defendantNationalId: defendantNationalIdText,
    defendantNoNationalId: defendantNoNationalId ? 'NONE' : 'SOME',
  })
  const defenderAssignedText = formatMessage(cf.defenderAssigned)

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
