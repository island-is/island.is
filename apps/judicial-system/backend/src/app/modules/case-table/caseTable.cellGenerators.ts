import { ModelStatic } from 'sequelize-typescript'

import {
  capitalize,
  districtCourtAbbreviation,
  formatCaseType,
  formatDate,
  getAllReadableIndictmentSubtypes,
  getAppealResultTextByValue,
  getInitials,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseTableColumnKey,
  CaseType,
  courtSessionTypeNames,
  DateType,
  DefendantEventType,
  EventType,
  getIndictmentAppealDeadlineDate,
  getIndictmentVerdictAppealDeadlineStatus,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  IndictmentSubtypeMap,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isPrisonSystemUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  isRestrictionCase,
  isSuccessfulServiceStatus,
  PunishmentType,
  ServiceRequirement,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { DateLog } from '../case/models/dateLog.model'
import { Defendant, DefendantEventLog } from '../defendant'
import { EventLog } from '../event-log/models/eventLog.model'
import { Institution } from '../institution'
import { Subpoena } from '../subpoena'
import { User } from '../user'
import {
  CaseTableCellValue,
  StringGroupValue,
  StringValue,
  TagPairValue,
  TagValue,
} from './dto/caseTable.response'

// gets the element type if T is an array.
type ElementType<T> = T extends (infer U)[] ? U : T

// gets the non-null, non-undefined version of ElementType<T>.
type DefinedObject<T> = NonNullable<ElementType<T>>

// extracts keys from T where the corresponding value, after non-nullable, is an object.
type ObjectKeys<T> = Extract<
  {
    [K in keyof T]: DefinedObject<T[K]> extends object ? K : never
  }[keyof T],
  string
>
type CaseIncludes = {
  [K in ObjectKeys<Case>]: {
    model: ModelStatic<DefinedObject<Case[K]>>
    attributes?: (keyof DefinedObject<Case[K]>)[]
    where?: {
      [K2 in keyof DefinedObject<Case[K]>]?: unknown
    }
    order?: [[keyof DefinedObject<Case[K]>, 'ASC' | 'DESC']]
    separate?: boolean
    includes?: Partial<{
      [K2 in ObjectKeys<DefinedObject<Case[K]>>]: {
        model: ModelStatic<DefinedObject<DefinedObject<Case[K]>[K2]>>
        attributes?: (keyof DefinedObject<DefinedObject<Case[K]>[K2]>)[]
        where?: {
          [K3 in keyof DefinedObject<DefinedObject<Case[K]>[K2]>]?: unknown
        }
        order?: [
          [keyof DefinedObject<DefinedObject<Case[K]>[K2]>, 'ASC' | 'DESC'],
        ]
        separate?: boolean
      }
    }>
  }
}

interface CaseTableCell<T> {
  value?: T
  sortValue?: string
}
interface CaseTableCellGenerator<T> {
  attributes?: (keyof Case)[]
  includes?: Partial<CaseIncludes>
  generate: (caseModel: Case, user: TUser) => CaseTableCell<T>
}

const getDays = (days: number) => days * 24 * 60 * 60 * 1000

const getIndictmentCourtDate = (c: Case): Date | undefined => {
  if (c.indictmentDecision) {
    return c.indictmentDecision === IndictmentDecision.SCHEDULING
      ? DateLog.courtDate(c.dateLogs)?.date
      : undefined
  }

  return DateLog.arraignmentDate(c.dateLogs)?.date
}

const getRequestCaseArraignmentDate = (c: Case): Date | undefined => {
  return DateLog.arraignmentDate(c.dateLogs)?.date
}

const generateCell = <T>(value?: T, sortValue?: string): CaseTableCell<T> => {
  return { value, sortValue }
}

const generateDate = (date: Date | undefined): CaseTableCell<StringValue> => {
  const dateValue = formatDate(date, 'd.M.yyyy')
  const sortValue = formatDate(date, 'yyyyMMdd')

  if (!dateValue || !sortValue) {
    return generateCell()
  }

  return generateCell({ str: dateValue }, sortValue)
}

const generateAppealStateTag = (
  c: Case,
  user: TUser,
): CaseTableCell<TagValue> => {
  const getCompletedColor = (): string => {
    switch (c.appealRulingDecision) {
      case CaseAppealRulingDecision.ACCEPTING:
        return 'mint'
      case CaseAppealRulingDecision.CHANGED:
      case CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY:
      case CaseAppealRulingDecision.REPEAL:
      case CaseAppealRulingDecision.DISCONTINUED:
        return 'rose'
      default:
        return 'blueberry'
    }
  }

  const getCompletedOrder = (): string => {
    switch (c.appealRulingDecision) {
      case CaseAppealRulingDecision.ACCEPTING:
        return 'E'
      case CaseAppealRulingDecision.REPEAL:
        return 'F'
      case CaseAppealRulingDecision.CHANGED:
      case CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY:
        return 'G'
      case CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL:
      case CaseAppealRulingDecision.DISMISSED_FROM_COURT:
        return 'H'
      case CaseAppealRulingDecision.REMAND:
        return 'I'
      case CaseAppealRulingDecision.DISCONTINUED:
        return 'J'
      default:
        return 'K'
    }
  }

  switch (c.appealState) {
    case CaseAppealState.WITHDRAWN:
      return generateCell({ color: 'red', text: 'Afturkallað' }, 'L')
    case CaseAppealState.APPEALED:
      return generateCell({ color: 'red', text: 'Kært' }, 'A')
    case CaseAppealState.RECEIVED:
      if (isCourtOfAppealsUser(user)) {
        if (!c.appealCaseNumber) {
          return generateCell({ color: 'purple', text: 'Nýtt' }, 'B')
        }

        if (
          c.appealReceivedByCourtDate &&
          Date.now() >= c.appealReceivedByCourtDate.getTime() + getDays(1)
        ) {
          return generateCell({ color: 'mint', text: 'Frestir liðnir' }, 'D')
        }
      }

      return generateCell({ color: 'darkerBlue', text: 'Móttekið' }, 'C')
    case CaseAppealState.COMPLETED:
      return generateCell(
        {
          color: getCompletedColor(),
          text: getAppealResultTextByValue(c.appealRulingDecision),
        },
        getCompletedOrder(),
      )
    default:
      return generateCell()
  }
}

const generateRequestCaseStateTag = (
  c: Case,
  user: TUser,
): CaseTableCell<TagValue> => {
  switch (c.state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
      return generateCell({ color: 'red', text: 'Drög' }, 'A')
    case CaseState.SUBMITTED:
      return generateCell(
        { color: 'purple', text: isDistrictCourtUser(user) ? 'Nýtt' : 'Sent' },
        'B',
      )
    case CaseState.RECEIVED: {
      return DateLog.arraignmentDate(c.dateLogs)?.date
        ? generateCell({ color: 'mint', text: 'Á dagskrá' }, 'D')
        : generateCell({ color: 'blueberry', text: 'Móttekið' }, 'C')
    }
    case CaseState.ACCEPTED:
      return c.validToDate && c.validToDate < new Date()
        ? generateCell({ color: 'darkerBlue', text: 'Lokið' }, 'G')
        : generateCell(
            {
              color: 'blue',
              text: isRestrictionCase(c.type) ? 'Virkt' : 'Samþykkt',
            },
            isRestrictionCase(c.type) ? 'F' : 'E',
          )
    case CaseState.REJECTED:
      return generateCell({ color: 'rose', text: 'Hafnað' }, 'H')
    case CaseState.DISMISSED:
      return generateCell({ color: 'dark', text: 'Vísað frá' }, 'I')
    default:
      return generateCell({ color: 'white', text: 'Óþekkt' }, 'J')
  }
}

const generateIndictmentRulingDecisionTag = (
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null,
): CaseTableCell<TagValue> => {
  switch (indictmentRulingDecision) {
    case CaseIndictmentRulingDecision.FINE:
      return generateCell({ color: 'mint', text: 'Viðurlagaákvörðun' }, 'G')
    case CaseIndictmentRulingDecision.CANCELLATION:
      return generateCell({ color: 'rose', text: 'Niðurfelling' }, 'H')
    case CaseIndictmentRulingDecision.MERGE:
      return generateCell({ color: 'rose', text: 'Sameinað' }, 'I')
    case CaseIndictmentRulingDecision.DISMISSAL:
      return generateCell({ color: 'blue', text: 'Frávísun' }, 'J')
    case CaseIndictmentRulingDecision.RULING:
      return generateCell({ color: 'darkerBlue', text: 'Dómur' }, 'K')
    case CaseIndictmentRulingDecision.WITHDRAWAL:
      return generateCell({ color: 'rose', text: 'Afturkallað' }, 'L')
    default:
      return generateCell({ color: 'darkerBlue', text: 'Lokið' }, 'M')
  }
}

const generateIndictmentCaseStateTag = (
  c: Case,
  user: TUser,
): CaseTableCell<TagValue> => {
  const {
    state,
    indictmentDecision,
    indictmentRulingDecision,
    indictmentReviewerId,
  } = c

  const courtDate = getIndictmentCourtDate(c)

  const allServed = c.defendants?.every(
    (d) =>
      d.isAlternativeService ||
      d.subpoenas?.some((s) => isSuccessfulServiceStatus(s.serviceStatus)),
  )

  const generateReceivedIndictmentStateTag = (): CaseTableCell<TagValue> => {
    switch (indictmentDecision) {
      case IndictmentDecision.POSTPONING:
      case IndictmentDecision.SCHEDULING:
      case IndictmentDecision.COMPLETING:
        return generateCell({ color: 'mint', text: 'Á dagskrá' }, 'D')
      case IndictmentDecision.POSTPONING_UNTIL_VERDICT:
        return generateCell({ color: 'mint', text: 'Dómtekið' }, 'E')
      case IndictmentDecision.REDISTRIBUTING:
        return generateCell({ color: 'blue', text: 'Endurúthlutun' }, 'F')
      default:
        return courtDate
          ? allServed
            ? generateCell({ color: 'mint', text: 'Á dagskrá' }, 'D')
            : generateCell({ color: 'red', text: 'Óbirt' })
          : generateCell({ color: 'blueberry', text: 'Móttekið' }, 'C')
    }
  }

  const generateCompletedIndictmentStateTag = (): CaseTableCell<TagValue> => {
    if (isPublicProsecutionOfficeUser(user)) {
      const isInReview = Boolean(indictmentReviewerId)

      return generateCell(
        {
          color: isInReview ? 'mint' : 'purple',
          text: isInReview ? 'Í yfirlestri' : 'Nýtt',
        },
        isInReview ? 'H' : 'G',
      )
    }

    return generateIndictmentRulingDecisionTag(indictmentRulingDecision)
  }

  switch (state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
    case CaseState.WAITING_FOR_CONFIRMATION:
      return generateCell({ color: 'red', text: 'Drög' }, 'A')
    case CaseState.SUBMITTED:
      return generateCell(
        {
          color: 'purple',
          text: isDistrictCourtUser(user) ? 'Nýtt' : 'Sent',
        },
        'B',
      )
    case CaseState.RECEIVED:
      return generateReceivedIndictmentStateTag()
    case CaseState.COMPLETED:
      return generateCompletedIndictmentStateTag()
    case CaseState.WAITING_FOR_CANCELLATION:
      return generateCell({ color: 'rose', text: 'Afturkallað' }, 'L')
    default:
      return generateCell({ color: 'white', text: 'Óþekkt' }, 'N')
  }
}

const generateIndictmentCaseType = (
  indictmentSubtypes: IndictmentSubtypeMap | undefined,
): string[] | undefined => {
  if (!indictmentSubtypes) return undefined

  const labels =
    getAllReadableIndictmentSubtypes(indictmentSubtypes).map(capitalize)

  if (labels.length === 0) return undefined

  return labels.length === 1
    ? [labels[0]]
    : [`${labels[0]}`, `+${labels.length - 1}`]
}

const generateRequestCaseType = (
  type: CaseType,
  decision: CaseDecision | undefined,
  parentCaseId: string | undefined,
): string[] => {
  const formatted = capitalize(
    formatCaseType(
      decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
        ? CaseType.CUSTODY
        : type,
    ),
  )

  return [formatted, parentCaseId ? 'Framlenging' : ''].filter(Boolean)
}

const getAppealCaseNumberSortValue = (appealCaseNumber: string): string => {
  const [num, year] = appealCaseNumber.split('/') // Assume the number is of the form xxxxx/yyyy

  if (!num || !year) {
    // Either the case does not yet have an appeal case number or it is malformed
    // In both cases we return a default value
    return '000000000'
  }

  // Assume year is 4 digits
  // Assume num is no more than 5 digits
  const number = num.padStart(5, '0')

  return `${year}${number}`
}

const getCourtCaseNumberSortValue = (courtCaseNumber: string): string => {
  // Retrive the court prefix if it is included
  const [head, tail] = courtCaseNumber.split(': ')
  const court = tail ? head : ''
  const caseNumber = tail ?? head

  // Assume the number starts with 'R-' or 'S-'
  const [num, year] = caseNumber.slice(2).split('/')

  if (!num || !year) {
    // Either the case does not yet have a court case number or it is malformed
    // In both cases we return a default value
    return '000000000'
  }

  // Assume year is 4 digits
  // Assume num is no more than 5 digits
  const number = num.padStart(5, '0')

  return `${court}${year}${number}`
}

const getPoliceCaseNumberSortValue = (policeCaseNumber: string): string => {
  const [prefix, year, numParts] = policeCaseNumber.split('-')

  if (!prefix || !year || !numParts) {
    // Either the case does not yet have a police case number or it is malformed
    // In both cases we return a default value
    return '0000000000000000'
  }

  const [num, post] = numParts.split(' +') // Check for additional police case numbers

  // Assume prefix 3 digits
  // Assume year 4 digits
  // Assume num is no more than 6 digits
  // Assume no more than 999 additional police case numbers
  const number = num.padStart(6, '0') // Assume its no more than 6 digits
  const postfix = post ? post.padStart(3, '0') : '000'

  return `${prefix}${year}${number}${postfix}`
}

const generateCaseNumberSortValue = (
  appealCaseNumber: string,
  courtCaseNumber: string,
  policeCaseNumber: string,
  user: TUser,
): string | undefined => {
  if (isProsecutionUser(user)) {
    return getPoliceCaseNumberSortValue(policeCaseNumber)
  }
  if (isDistrictCourtUser(user)) {
    return `${getCourtCaseNumberSortValue(
      courtCaseNumber,
    )}${getPoliceCaseNumberSortValue(policeCaseNumber)}`
  }

  if (isPublicProsecutionOfficeUser(user) || isPrisonSystemUser(user)) {
    return getCourtCaseNumberSortValue(courtCaseNumber)
  }

  if (isCourtOfAppealsUser(user)) {
    return `${getAppealCaseNumberSortValue(
      appealCaseNumber,
    )}${getCourtCaseNumberSortValue(courtCaseNumber)}`
  }

  return undefined
}

const caseNumber: CaseTableCellGenerator<StringGroupValue> = {
  attributes: [
    'policeCaseNumbers',
    'courtCaseNumber',
    'appealCaseNumber',
    'publicProsecutorIsRegisteredInPoliceSystem',
  ],
  includes: {
    court: {
      model: Institution,
      attributes: ['name'],
    },
  },
  generate: (c: Case, user: TUser): CaseTableCell<StringGroupValue> => {
    const court = !isDistrictCourtUser(user)
      ? districtCourtAbbreviation(c.court?.name)
      : ''
    const appealCaseNumber = c.appealCaseNumber ?? ''
    const courtCaseNumber =
      court && c.courtCaseNumber
        ? `${court}: ${c.courtCaseNumber}`
        : c.courtCaseNumber ?? ''
    const policeCaseNumber =
      c.policeCaseNumbers.length > 0
        ? c.policeCaseNumbers.length > 1
          ? `${c.policeCaseNumbers[0]} +${c.policeCaseNumbers.length - 1}`
          : c.policeCaseNumbers[0]
        : ''

    const sortValue = generateCaseNumberSortValue(
      appealCaseNumber,
      courtCaseNumber,
      policeCaseNumber,
      user,
    )

    const hasCheckMark =
      isPublicProsecutionOfficeUser(user) &&
      c.publicProsecutorIsRegisteredInPoliceSystem

    return generateCell(
      {
        strList: [appealCaseNumber, courtCaseNumber, policeCaseNumber],
        hasCheckMark,
      },
      sortValue,
    )
  },
}

const defendants: CaseTableCellGenerator<StringGroupValue> = {
  includes: {
    defendants: {
      model: Defendant,
      attributes: ['nationalId', 'name'],
      order: [['created', 'ASC']],
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<StringGroupValue> => {
    if (!c.defendants || c.defendants.length === 0) {
      return generateCell()
    }

    const strList = [
      c.defendants[0].name ?? '',
      c.defendants.length > 1
        ? `+ ${c.defendants.length - 1}`
        : c.defendants[0].nationalId ?? '',
    ]

    return generateCell({ strList }, strList.join(''))
  },
}

export const caseType: CaseTableCellGenerator<StringGroupValue> = {
  attributes: ['type', 'decision', 'parentCaseId', 'indictmentSubtypes'],
  generate: (c: Case): CaseTableCell<StringGroupValue> => {
    if (c.type === CaseType.INDICTMENT) {
      const indictmentType = generateIndictmentCaseType(c.indictmentSubtypes)

      return indictmentType
        ? generateCell({ strList: indictmentType }, indictmentType.join(''))
        : generateCell()
    }

    const requestType = generateRequestCaseType(
      c.type,
      c.decision,
      c.parentCaseId,
    )

    return generateCell({ strList: requestType }, requestType.join(''))
  },
}

const appealState: CaseTableCellGenerator<TagValue> = {
  attributes: [
    'appealState',
    'appealRulingDecision',
    'appealCaseNumber',
    'appealReceivedByCourtDate',
  ],
  generate: (c: Case, user: TUser): CaseTableCell<TagValue> =>
    generateAppealStateTag(c, user),
}

// Same as appealState but with a different title
const appealCaseState = appealState

const requestCaseState: CaseTableCellGenerator<TagValue> = {
  includes: {
    dateLogs: {
      model: DateLog,
      attributes: ['date', 'dateType'],
      order: [['created', 'DESC']],
      separate: true,
    },
  },
  attributes: [
    'state',
    'validToDate',
    'type',
    'appealState',
    'appealRulingDecision',
    'appealCaseNumber',
    'appealReceivedByCourtDate',
  ],
  generate: (c: Case, user: TUser): CaseTableCell<TagValue> =>
    generateRequestCaseStateTag(c, user),
}

const indictmentCaseState: CaseTableCellGenerator<TagValue> = {
  attributes: [
    'state',
    'indictmentDecision',
    'indictmentRulingDecision',
    'indictmentReviewerId',
  ],
  includes: {
    defendants: {
      model: Defendant,
      attributes: ['isAlternativeService'],
      order: [['created', 'ASC']],
      includes: {
        subpoenas: {
          model: Subpoena,
          attributes: ['serviceStatus'],
          order: [['created', 'DESC']],
          separate: true,
        },
      },
      separate: true,
    },
    dateLogs: {
      model: DateLog,
      attributes: ['date'],
      order: [['created', 'DESC']],
      separate: true,
    },
  },
  generate: (c: Case, user: TUser): CaseTableCell<TagValue> =>
    generateIndictmentCaseStateTag(c, user),
}

const courtOfAppealsHead: CaseTableCellGenerator<StringValue> = {
  includes: {
    appealJudge1: {
      model: User,
      attributes: ['name'],
    },
  },
  generate: (c: Case): CaseTableCell<StringValue> => {
    const initials = getInitials(c.appealJudge1?.name)

    if (!initials) {
      return generateCell()
    }

    return generateCell({ str: initials }, initials)
  },
}

const created: CaseTableCellGenerator<StringValue> = {
  attributes: ['created'],
  generate: (c: Case): CaseTableCell<StringValue> => {
    return generateDate(c.created)
  },
}

const prosecutor: CaseTableCellGenerator<StringValue> = {
  includes: {
    prosecutor: {
      model: User,
      attributes: ['name'],
    },
  },
  generate: (c: Case): CaseTableCell<StringValue> => {
    const prosecutor = c.prosecutor
    if (!prosecutor) {
      return generateCell()
    }

    return generateCell({ str: prosecutor.name }, prosecutor.name)
  },
}

const validFromTo: CaseTableCellGenerator<StringValue> = {
  attributes: [
    'type',
    'state',
    'initialRulingDate',
    'rulingDate',
    'validToDate',
  ],
  generate: (c: Case): CaseTableCell<StringValue> => {
    if (!isRestrictionCase(c.type) || c.state !== CaseState.ACCEPTED) {
      return generateCell()
    }

    const endDate = generateDate(c.validToDate)

    if (!endDate.value) {
      return generateCell()
    }

    const startDate = generateDate(c.initialRulingDate ?? c.rulingDate)

    if (!startDate.value) {
      return endDate
    }

    return generateCell(
      { str: `${startDate.value.str} - ${endDate.value.str}` },
      `${endDate.sortValue}${startDate.sortValue}`,
    )
  },
}

const caseSentToCourtDate: CaseTableCellGenerator<StringValue> = {
  includes: {
    eventLogs: {
      model: EventLog,
      attributes: ['created', 'eventType'],
      order: [['created', 'DESC']],
      where: {
        eventType: [
          EventType.CASE_SENT_TO_COURT,
          EventType.INDICTMENT_CONFIRMED,
        ],
      },
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<StringValue> => {
    const caseSentToCourtEvent = EventLog.caseSentToCourtEvent(c.eventLogs)

    return generateDate(caseSentToCourtEvent?.created)
  },
}

const rulingDate: CaseTableCellGenerator<StringValue> = {
  attributes: ['rulingDate'],
  generate: (c: Case): CaseTableCell<StringValue> => generateDate(c.rulingDate),
}

const arraignmentDate: CaseTableCellGenerator<StringGroupValue> = {
  attributes: ['requestedCourtDate'],
  includes: {
    dateLogs: {
      model: DateLog,
      attributes: ['date', 'dateType'],
      order: [['created', 'DESC']],
      where: { dateType: DateType.ARRAIGNMENT_DATE },
      separate: true,
    },
  },
  generate: (c: Case, user: TUser): CaseTableCell<StringGroupValue> => {
    let courtDate = getRequestCaseArraignmentDate(c)
    let prefix = ''

    if (!courtDate && isDistrictCourtUser(user)) {
      courtDate = c.requestedCourtDate
      prefix = 'ÓE '
    }

    const datePart = formatDate(courtDate, 'EEE d. MMMM yyyy')
    const sortValue = formatDate(courtDate, 'yyyyMMddHHmm')

    if (!datePart || !sortValue) {
      // No date part, so we return undefined
      return generateCell()
    }

    const timePart = formatDate(courtDate, 'HH:mm')

    if (!timePart) {
      // This should never happen, but if it does, we return the court date only
      return generateCell(
        { strList: [`${prefix}${capitalize(datePart)}`] },
        sortValue,
      )
    }

    return generateCell(
      { strList: [`${prefix}${capitalize(datePart)}`, `kl. ${timePart}`] },
      sortValue,
    )
  },
}

const indictmentArraignmentDate: CaseTableCellGenerator<StringGroupValue> = {
  attributes: ['courtSessionType'],
  includes: {
    dateLogs: {
      model: DateLog,
      attributes: ['date', 'dateType'],
      order: [['created', 'DESC']],
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<StringGroupValue> => {
    const courtDate = getIndictmentCourtDate(c)

    const datePart = formatDate(courtDate, 'EEE d. MMMM yyyy')
    const sortValue = formatDate(courtDate, 'yyyyMMddHHmm')

    if (!datePart || !sortValue || !c.courtSessionType) {
      // No date part, so we return undefined
      return generateCell()
    }
    const courtSessionType = courtSessionTypeNames[c.courtSessionType]

    const timePart = formatDate(courtDate, 'HH:mm')

    if (!timePart) {
      // This should never happen, but if it does, we return the court date only
      return generateCell({ strList: [`${capitalize(datePart)}`] }, sortValue)
    }

    return generateCell(
      {
        strList: [courtSessionType, `${capitalize(datePart)} kl. ${timePart}`],
      },
      sortValue,
    )
  },
}

const rulingType: CaseTableCellGenerator<TagValue> = {
  attributes: ['indictmentRulingDecision'],
  generate: (c: Case): CaseTableCell<TagValue> => {
    switch (c.indictmentRulingDecision) {
      case CaseIndictmentRulingDecision.FINE:
        return generateCell(
          { color: 'darkerBlue', text: 'Viðurlagaákvörðun' },
          'Viðurlagaákvörðun',
        )
      case CaseIndictmentRulingDecision.RULING:
        return generateCell({ color: 'darkerBlue', text: 'Dómur' }, 'Dómur')
      default:
        return generateCell()
    }
  },
}

const punishmentType: CaseTableCellGenerator<TagValue> = {
  includes: {
    defendants: {
      model: Defendant,
      attributes: ['punishmentType'],
      order: [['created', 'ASC']],
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<TagValue> => {
    if (
      !c.defendants ||
      c.defendants.length === 0 ||
      !c.defendants[0].punishmentType
    ) {
      return generateCell()
    }

    const punishmentType = c.defendants[0].punishmentType

    const getPunishmentTypeLabel = () => {
      switch (punishmentType) {
        case PunishmentType.IMPRISONMENT:
          return 'Óskb.'
        case PunishmentType.PROBATION:
          return 'Skb.'
        case PunishmentType.FINE:
          return 'Sekt'
        case PunishmentType.INDICTMENT_RULING_DECISION_FINE:
          return 'VL'
        case PunishmentType.SIGNED_FINE_INVITATION:
          return 'ÁS'
        case PunishmentType.OTHER:
          return 'Annað'
        default:
          return 'Óþekkt'
      }
    }

    const label = getPunishmentTypeLabel()

    return generateCell({ color: 'red', text: label }, label)
  },
}

const prisonAdminReceivalDate: CaseTableCellGenerator<StringValue> = {
  includes: {
    defendants: {
      model: Defendant,
      order: [['created', 'ASC']],
      includes: {
        eventLogs: {
          model: DefendantEventLog,
          attributes: ['created', 'eventType'],
          order: [['created', 'DESC']],
          where: { eventType: DefendantEventType.OPENED_BY_PRISON_ADMIN },
          separate: true,
        },
      },
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<StringValue> => {
    if (!c.defendants || c.defendants.length === 0) {
      return generateCell()
    }

    const dateOpened = DefendantEventLog.getDefendantEventLogTypeDate(
      DefendantEventType.OPENED_BY_PRISON_ADMIN,
      c.defendants[0].eventLogs,
    )

    return generateDate(dateOpened)
  },
}

const prisonAdminState: CaseTableCellGenerator<TagValue> = {
  includes: {
    defendants: {
      model: Defendant,
      order: [['created', 'ASC']],
      includes: {
        eventLogs: {
          model: DefendantEventLog,
          attributes: ['created', 'eventType'],
          order: [['created', 'DESC']],
          where: { eventType: DefendantEventType.OPENED_BY_PRISON_ADMIN },
          separate: true,
        },
      },
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<TagValue> => {
    if (!c.defendants || c.defendants.length === 0) {
      return generateCell({ color: 'red', text: 'Óþekkt' }, 'C') // This should never happen
    }

    const dateOpened = DefendantEventLog.getDefendantEventLogTypeDate(
      DefendantEventType.OPENED_BY_PRISON_ADMIN,
      c.defendants[0].eventLogs,
    )

    if (dateOpened) {
      return generateCell({ color: 'blue', text: 'Móttekið' }, 'B')
    }

    return generateCell({ color: 'purple', text: 'Nýtt' }, 'A')
  },
}

const indictmentAppealDeadline: CaseTableCellGenerator<StringValue> = {
  attributes: ['rulingDate', 'indictmentRulingDecision'],
  generate: (c: Case): CaseTableCell<StringValue> => {
    if (!c.rulingDate) {
      return generateCell()
    }

    const deadlineDate = getIndictmentAppealDeadlineDate(
      c.rulingDate,
      c.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE,
    )

    return generateDate(deadlineDate)
  },
}

const subpoenaServiceState: CaseTableCellGenerator<TagValue> = {
  attributes: ['rulingDate', 'indictmentRulingDecision'],
  includes: {
    defendants: {
      model: Defendant,
      attributes: ['serviceRequirement', 'verdictViewDate'],
      order: [['created', 'ASC']],
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<TagValue> => {
    if (c.indictmentRulingDecision !== CaseIndictmentRulingDecision.RULING) {
      return generateCell()
    }

    const verdictInfo = c.defendants?.map<[boolean, Date | undefined]>((d) => [
      true,
      d.serviceRequirement === ServiceRequirement.NOT_REQUIRED
        ? c.rulingDate
        : d.verdictViewDate,
    ])
    const [
      indictmentVerdictViewedByAll,
      indictmentVerdictAppealDeadlineExpired,
    ] = getIndictmentVerdictAppealDeadlineStatus(verdictInfo, false)

    if (!indictmentVerdictViewedByAll) {
      return generateCell({ color: 'red', text: 'Óbirt' }, 'A')
    }

    if (indictmentVerdictAppealDeadlineExpired) {
      return generateCell({ color: 'mint', text: 'Frestur liðinn' }, 'B')
    }

    return generateCell({ color: 'blue', text: 'Á fresti' }, 'C')
  },
}

const indictmentReviewer: CaseTableCellGenerator<StringValue> = {
  includes: {
    indictmentReviewer: {
      model: User,
      attributes: ['name'],
    },
  },
  generate: (c: Case): CaseTableCell<StringValue> => {
    const indictmentReviewerName = c.indictmentReviewer?.name.trim()

    if (!indictmentReviewerName) {
      return generateCell()
    }

    return generateCell({ str: indictmentReviewerName }, indictmentReviewerName)
  },
}

const sentToPrisonAdminDate: CaseTableCellGenerator<StringValue> = {
  includes: {
    defendants: {
      model: Defendant,
      order: [['created', 'ASC']],
      includes: {
        eventLogs: {
          model: DefendantEventLog,
          attributes: ['created', 'eventType'],
          order: [['created', 'DESC']],
          where: { eventType: DefendantEventType.SENT_TO_PRISON_ADMIN },
          separate: true,
        },
      },
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<StringValue> => {
    if (!c.defendants) {
      return generateCell()
    }

    const dateSent = c.defendants.reduce<Date | undefined>((firstSent, d) => {
      const dateSent = DefendantEventLog.getDefendantEventLogTypeDate(
        DefendantEventType.SENT_TO_PRISON_ADMIN,
        d.eventLogs,
      )

      if (dateSent && (!firstSent || firstSent > dateSent)) {
        return dateSent
      }

      return firstSent
    }, undefined)

    return generateDate(dateSent)
  },
}

const indictmentRulingDecision: CaseTableCellGenerator<TagValue> = {
  attributes: ['indictmentRulingDecision'],
  generate: (c: Case): CaseTableCell<TagValue> =>
    generateIndictmentRulingDecisionTag(c.indictmentRulingDecision),
}

const indictmentReviewDecision: CaseTableCellGenerator<TagPairValue> = {
  attributes: ['indictmentReviewDecision'],
  includes: {
    defendants: {
      model: Defendant,
      attributes: ['verdictAppealDate'],
      order: [['created', 'ASC']],
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<TagPairValue> => {
    const firstTag = {
      color: 'darkerBlue',
      text:
        c.indictmentReviewDecision === IndictmentCaseReviewDecision.APPEAL
          ? c.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
            ? 'Kæra'
            : 'Áfrýja'
          : 'Una',
    }

    const defendantAppealed = c.defendants?.some((d) => d.verdictAppealDate)

    const secondTag = defendantAppealed
      ? { color: 'red', text: 'Ákærði áfrýjar' }
      : undefined

    const sortValue = secondTag
      ? `${firstTag.text}${secondTag.text}`
      : firstTag.text

    return generateCell({ firstTag, secondTag }, sortValue)
  },
}

export const caseTableCellGenerators: Record<
  CaseTableColumnKey,
  CaseTableCellGenerator<CaseTableCellValue>
> = {
  caseNumber,
  defendants,
  caseType,
  appealState,
  courtOfAppealsHead,
  created,
  prosecutor,
  validFromTo,
  rulingDate,
  requestCaseState,
  appealCaseState,
  rulingType,
  punishmentType,
  prisonAdminReceivalDate,
  prisonAdminState,
  indictmentAppealDeadline,
  subpoenaServiceState,
  indictmentReviewer,
  sentToPrisonAdminDate,
  indictmentReviewDecision,
  caseSentToCourtDate,
  arraignmentDate,
  indictmentCaseState,
  indictmentArraignmentDate,
  indictmentRulingDecision,
}
