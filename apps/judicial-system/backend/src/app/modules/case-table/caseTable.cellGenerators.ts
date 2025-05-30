import { ModelStatic } from 'sequelize-typescript'

import {
  capitalize,
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
  DefendantEventType,
  EventType,
  getIndictmentAppealDeadlineDate,
  getIndictmentVerdictAppealDeadlineStatus,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  IndictmentSubtypeMap,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isPublicProsecutionOfficeUser,
  isRestrictionCase,
  PunishmentType,
  ServiceRequirement,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { DateLog } from '../case/models/dateLog.model'
import { Defendant, DefendantEventLog } from '../defendant'
import { EventLog } from '../event-log/models/eventLog.model'
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
  switch (c.appealState) {
    case CaseAppealState.WITHDRAWN:
      return generateCell({ color: 'red', text: 'Afturkallað' })
    case CaseAppealState.APPEALED:
      return generateCell({ color: 'red', text: 'Kært' })
    case CaseAppealState.RECEIVED:
      if (isCourtOfAppealsUser(user)) {
        if (!c.appealCaseNumber) {
          return generateCell({ color: 'purple', text: 'Nýtt' })
        }

        if (
          c.appealReceivedByCourtDate &&
          Date.now() >= c.appealReceivedByCourtDate.getTime() + getDays(1)
        ) {
          return generateCell({ color: 'mint', text: 'Frestir liðnir' })
        }
      }

      return generateCell({ color: 'darkerBlue', text: 'Móttekið' })
    case CaseAppealState.COMPLETED:
      return {
        value: {
          color:
            c.appealRulingDecision === CaseAppealRulingDecision.ACCEPTING
              ? 'mint'
              : c.appealRulingDecision === CaseAppealRulingDecision.CHANGED ||
                c.appealRulingDecision ===
                  CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY ||
                c.appealRulingDecision === CaseAppealRulingDecision.REPEAL ||
                c.appealRulingDecision === CaseAppealRulingDecision.DISCONTINUED
              ? 'rose'
              : 'blueberry',
          text: getAppealResultTextByValue(c.appealRulingDecision),
        },
      }
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
      return generateCell({ color: 'red', text: 'Drög' })
    case CaseState.SUBMITTED:
      return generateCell({
        color: 'purple',
        text: isDistrictCourtUser(user) ? 'Nýtt' : 'Sent',
      })
    case CaseState.RECEIVED: {
      return DateLog.arraignmentDate(c.dateLogs)?.date
        ? generateCell({ color: 'mint', text: 'Á dagskrá' })
        : generateCell({ color: 'blueberry', text: 'Móttekið' })
    }
    case CaseState.ACCEPTED:
      return c.validToDate && c.validToDate < new Date()
        ? generateCell({ color: 'darkerBlue', text: 'Lokið' })
        : generateCell({
            color: 'blue',
            text: isRestrictionCase(c.type) ? 'Virkt' : 'Samþykkt',
          })
    case CaseState.REJECTED:
      return generateCell({ color: 'rose', text: 'Hafnað' })
    case CaseState.DISMISSED:
      return generateCell({ color: 'dark', text: 'Vísað frá' })
    default:
      return generateCell({ color: 'white', text: 'Óþekkt' })
  }
}

const generateReceivedIndictmentStateTag = (
  indictmentDecision: IndictmentDecision | undefined,
  courtDate: Date | undefined,
): CaseTableCell<TagValue> => {
  switch (indictmentDecision) {
    case IndictmentDecision.POSTPONING:
    case IndictmentDecision.SCHEDULING:
    case IndictmentDecision.COMPLETING:
      return generateCell({ color: 'mint', text: 'Á dagskrá' })
    case IndictmentDecision.POSTPONING_UNTIL_VERDICT:
      return generateCell({ color: 'mint', text: 'Dómtekið' })
    case IndictmentDecision.REDISTRIBUTING:
      return generateCell({ color: 'blue', text: 'Endurúthlutun' })
    default:
      return courtDate
        ? generateCell({ color: 'mint', text: 'Á dagskrá' })
        : generateCell({ color: 'blueberry', text: 'Móttekið' })
  }
}

const generateIndictmentRulingDecisionTag = (
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null,
): CaseTableCell<TagValue> => {
  switch (indictmentRulingDecision) {
    case CaseIndictmentRulingDecision.FINE:
      return generateCell({ color: 'mint', text: 'Viðurlagaákvörðun' })
    case CaseIndictmentRulingDecision.CANCELLATION:
      return generateCell({ color: 'rose', text: 'Niðurfelling' })
    case CaseIndictmentRulingDecision.MERGE:
      return generateCell({ color: 'rose', text: 'Sameinað' })
    case CaseIndictmentRulingDecision.DISMISSAL:
      return generateCell({ color: 'blue', text: 'Frávísun' })
    case CaseIndictmentRulingDecision.RULING:
      return generateCell({ color: 'darkerBlue', text: 'Dómur' })
    case CaseIndictmentRulingDecision.WITHDRAWAL:
      return generateCell({ color: 'rose', text: 'Afturkallað' })
    default:
      return generateCell({ color: 'darkerBlue', text: 'Lokið' })
  }
}

const generateCompletedIndictmentStateTag = (
  user: TUser,
  indictmentRulingDecision: CaseIndictmentRulingDecision | undefined,
  isInReview: boolean,
): CaseTableCell<TagValue> => {
  if (isPublicProsecutionOfficeUser(user)) {
    return generateCell({
      color: isInReview ? 'mint' : 'purple',
      text: isInReview ? 'Í yfirlestri' : 'Nýtt',
    })
  }

  return generateIndictmentRulingDecisionTag(indictmentRulingDecision)
}

const generateIndictmentCaseStateTag = (
  c: Case,
  user: TUser,
): CaseTableCell<TagValue> => {
  const {
    state,
    indictmentRulingDecision,
    indictmentDecision,
    indictmentReviewerId,
  } = c

  const courtDate = DateLog.courtDate(c.dateLogs)?.date

  switch (state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
    case CaseState.WAITING_FOR_CONFIRMATION:
      return generateCell({ color: 'red', text: 'Drög' })
    case CaseState.SUBMITTED:
      return generateCell({
        color: 'purple',
        text: isDistrictCourtUser(user) ? 'Nýtt' : 'Sent',
      })
    case CaseState.RECEIVED:
      return generateReceivedIndictmentStateTag(indictmentDecision, courtDate)
    case CaseState.COMPLETED:
      return generateCompletedIndictmentStateTag(
        user,
        indictmentRulingDecision,
        Boolean(indictmentReviewerId),
      )
    case CaseState.WAITING_FOR_CANCELLATION:
      return generateCell({ color: 'rose', text: 'Afturkallað' })
    default:
      return generateCell({ color: 'white', text: 'Óþekkt' })
  }
}

const generateIndictmentCaseType = (
  indictmentSubtypes: IndictmentSubtypeMap | undefined,
): string | undefined => {
  if (!indictmentSubtypes) return undefined

  const labels =
    getAllReadableIndictmentSubtypes(indictmentSubtypes).map(capitalize)

  if (labels.length === 0) return undefined

  return labels.length === 1 ? labels[0] : `${labels[0]} +${labels.length - 1}`
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

const caseNumber: CaseTableCellGenerator<StringGroupValue> = {
  attributes: ['policeCaseNumbers', 'courtCaseNumber', 'appealCaseNumber'],
  generate: (c: Case): CaseTableCell<StringGroupValue> =>
    generateCell({
      strList: [
        c.appealCaseNumber ?? '',
        c.courtCaseNumber ?? '',
        c.policeCaseNumbers.length > 1
          ? `${c.policeCaseNumbers[0]} +${c.policeCaseNumbers.length - 1}`
          : c.policeCaseNumbers[0],
      ],
    }),
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
  generate: (c: Case): CaseTableCell<StringGroupValue> =>
    c.defendants && c.defendants.length > 0
      ? generateCell({
          strList: [
            c.defendants[0].name ?? '',
            c.defendants.length > 1
              ? `+ ${c.defendants.length - 1}`
              : c.defendants[0].nationalId ?? '',
          ],
        })
      : generateCell(),
}

export const caseType: CaseTableCellGenerator<StringGroupValue> = {
  attributes: ['type', 'decision', 'parentCaseId', 'indictmentSubtypes'],
  generate: (c: Case): CaseTableCell<StringGroupValue> => {
    if (c.type === CaseType.INDICTMENT) {
      const display = generateIndictmentCaseType(c.indictmentSubtypes)
      return display ? generateCell({ strList: [display] }) : generateCell()
    }

    return generateCell({
      strList: generateRequestCaseType(c.type, c.decision, c.parentCaseId),
    })
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
      attributes: ['date'],
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

    return generateCell({ str: initials, sortValue: initials })
  },
}

const created: CaseTableCellGenerator<StringValue> = {
  generate: (c: Case): CaseTableCell<StringValue> => {
    return generateDate(c.created)
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

const arraignmentDate: CaseTableCellGenerator<StringValue> = {
  includes: {
    dateLogs: {
      model: DateLog,
      attributes: ['date', 'dateType'],
      order: [['created', 'DESC']],
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<StringValue> => {
    const arraignmentDate = DateLog.arraignmentDate(c.dateLogs)?.date

    return generateDate(arraignmentDate)
  },
}

const indictmentArraignmentDate: CaseTableCellGenerator<StringGroupValue> = {
  includes: {
    dateLogs: {
      model: DateLog,
      attributes: ['date', 'dateType'],
      order: [['created', 'DESC']],
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<StringGroupValue> => {
    let date: Date | undefined

    if (c.indictmentDecision) {
      // Arraignment is completed
      if (c.indictmentDecision !== IndictmentDecision.SCHEDULING) {
        // A court date is not scheduled
        return generateCell()
      }

      // A court date should be scheduled
      date = DateLog.courtDate(c.dateLogs)?.date
    } else {
      // An arraignment may be scheduled
      date = DateLog.arraignmentDate(c.dateLogs)?.date
    }

    const datePart = formatDate(date, 'EEE d. MMMM yyyy')

    if (!datePart) {
      // No date part, so we return undefined
      return generateCell()
    }

    const timePart = formatDate(date, 'HH:mm')

    if (!timePart) {
      // This should never happen, but if it does, we return the court date only
      return generateCell({ strList: [`${capitalize(datePart)}`] })
    }

    return generateCell({
      strList: [`${capitalize(datePart)}`, `kl. ${timePart}`],
    })
  },
}

const rulingType: CaseTableCellGenerator<TagValue> = {
  attributes: ['indictmentRulingDecision'],
  generate: (c: Case): CaseTableCell<TagValue> => {
    switch (c.indictmentRulingDecision) {
      case CaseIndictmentRulingDecision.FINE:
        return generateCell({ color: 'darkerBlue', text: 'Viðurlagaákvörðun' })
      case CaseIndictmentRulingDecision.RULING:
        return generateCell({ color: 'darkerBlue', text: 'Dómur' })
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

    return generateCell({ color: 'red', text: getPunishmentTypeLabel() })
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
          where: {
            eventType: DefendantEventType.OPENED_BY_PRISON_ADMIN,
          },
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
          where: {
            eventType: DefendantEventType.OPENED_BY_PRISON_ADMIN,
          },
          separate: true,
        },
      },
      separate: true,
    },
  },
  generate: (c: Case): CaseTableCell<TagValue> => {
    if (!c.defendants || c.defendants.length === 0) {
      return generateCell({ color: 'red', text: 'Óþekkt' }) // This should never happen
    }

    const dateOpened = DefendantEventLog.getDefendantEventLogTypeDate(
      DefendantEventType.OPENED_BY_PRISON_ADMIN,
      c.defendants[0].eventLogs,
    )

    if (dateOpened) {
      return generateCell({ color: 'blue', text: 'Móttekið' })
    }

    return generateCell({ color: 'purple', text: 'Nýtt' })
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
      return generateCell({ color: 'red', text: 'Óbirt' })
    }

    if (indictmentVerdictAppealDeadlineExpired) {
      return generateCell({ color: 'mint', text: 'Frestur liðinn' })
    }

    return generateCell({ color: 'blue', text: 'Á fresti' })
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

    return generateCell({
      str: indictmentReviewerName,
      sortValue: indictmentReviewerName,
    })
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
          where: {
            eventType: DefendantEventType.SENT_TO_PRISON_ADMIN,
          },
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

    return generateCell({ firstTag, secondTag })
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
