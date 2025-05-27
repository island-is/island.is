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
  TagPairValue,
  TagValue,
} from './dto/caseTable.response'

type ElementType<T> = T extends (infer U)[] ? U : T
type DefinedObject<T> = NonNullable<ElementType<T>>
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

interface CaseTableCellGenerator {
  attributes?: (keyof Case)[]
  includes?: Partial<CaseIncludes>
  generate: (caseModel: Case, user: TUser) => CaseTableCellValue | undefined
}

const getDays = (days: number) => days * 24 * 60 * 60 * 1000

const generateAppealStateTag = (c: Case, user: TUser): TagValue | undefined => {
  switch (c.appealState) {
    case CaseAppealState.WITHDRAWN:
      return { color: 'red', text: 'Afturkallað' }
    case CaseAppealState.APPEALED:
      return { color: 'red', text: 'Kært' }
    case CaseAppealState.RECEIVED:
      if (isCourtOfAppealsUser(user)) {
        if (!c.appealCaseNumber) {
          return { color: 'purple', text: 'Nýtt' }
        }

        if (
          c.appealReceivedByCourtDate &&
          Date.now() >= c.appealReceivedByCourtDate.getTime() + getDays(1)
        ) {
          return { color: 'mint', text: 'Frestir liðnir' }
        }
      }

      return { color: 'darkerBlue', text: 'Móttekið' }
    case CaseAppealState.COMPLETED:
      return {
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
      }
    default:
      return undefined
  }
}

const generateRequestCaseStateTag = (c: Case, user: TUser): TagValue => {
  switch (c.state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
      return { color: 'red', text: 'Drög' }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: isDistrictCourtUser(user) ? 'Nýtt' : 'Sent',
      }
    case CaseState.RECEIVED: {
      return DateLog.arraignmentDate(c.dateLogs)?.date
        ? { color: 'mint', text: 'Á dagskrá' }
        : { color: 'blueberry', text: 'Móttekið' }
    }
    case CaseState.ACCEPTED:
      return c.validToDate && c.validToDate < new Date()
        ? { color: 'darkerBlue', text: 'Lokið' }
        : {
            color: 'blue',
            text: isRestrictionCase(c.type) ? 'Virkt' : 'Samþykkt',
          }
    case CaseState.REJECTED:
      return { color: 'rose', text: 'Hafnað' }
    case CaseState.DISMISSED:
      return { color: 'dark', text: 'Vísað frá' }
    default:
      return { color: 'white', text: 'Óþekkt' }
  }
}

const generateIndictmentCaseStateTag = (c: Case, user: TUser): TagValue => {
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
      return { color: 'red', text: 'Drög' }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: isDistrictCourtUser(user) ? 'Nýtt' : 'Sent',
      }
    case CaseState.RECEIVED:
      return generateReceivedIndictmentStateTag(indictmentDecision, courtDate)
    case CaseState.COMPLETED:
      return generateCompletedIndictmentStateTag(
        user,
        indictmentRulingDecision,
        indictmentReviewerId ? true : false,
      )
    case CaseState.WAITING_FOR_CANCELLATION:
      return {
        color: 'rose',
        text: 'Afturkallað',
      }
    default:
      return { color: 'white', text: 'Óþekkt' }
  }
}

const generateReceivedIndictmentStateTag = (
  indictmentDecision?: IndictmentDecision | null,
  courtDate?: Date | string | null,
): TagValue => {
  switch (indictmentDecision) {
    case IndictmentDecision.POSTPONING:
    case IndictmentDecision.SCHEDULING:
    case IndictmentDecision.COMPLETING:
      return { color: 'mint', text: 'Á dagskrá' }
    case IndictmentDecision.POSTPONING_UNTIL_VERDICT:
      return { color: 'mint', text: 'Dómtekið' }
    case IndictmentDecision.REDISTRIBUTING:
      return { color: 'blue', text: 'Endurúthlutun' }
    default:
      return courtDate
        ? { color: 'mint', text: 'Á dagskrá' }
        : { color: 'blueberry', text: 'Móttekið' }
  }
}

const generateCompletedIndictmentStateTag = (
  user?: TUser,
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null,
  isInReview?: boolean,
): TagValue => {
  if (isPublicProsecutionOfficeUser(user)) {
    return {
      color: isInReview ? 'mint' : 'purple',
      text: isInReview ? 'Í yfirlestri' : 'Nýtt',
    }
  }
  return generateIndictmentRulingDecisionTag(indictmentRulingDecision)
}

const generateIndictmentRulingDecisionTag = (
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null,
): TagValue => {
  switch (indictmentRulingDecision) {
    case CaseIndictmentRulingDecision.FINE:
      return { color: 'mint', text: 'Viðurlagaákvörðun' }
    case CaseIndictmentRulingDecision.CANCELLATION:
      return { color: 'rose', text: 'Niðurfelling' }
    case CaseIndictmentRulingDecision.MERGE:
      return { color: 'rose', text: 'Sameinað' }
    case CaseIndictmentRulingDecision.DISMISSAL:
      return { color: 'blue', text: 'Frávísun' }
    case CaseIndictmentRulingDecision.RULING:
      return { color: 'darkerBlue', text: 'Dómur' }
    case CaseIndictmentRulingDecision.WITHDRAWAL:
      return { color: 'rose', text: 'Afturkallað' }
    default:
      return { color: 'darkerBlue', text: 'Lokið' }
  }
}

const generateIndictmentCaseType = (
  indictmentSubtypes?: IndictmentSubtypeMap | null,
): string | undefined => {
  if (!indictmentSubtypes) return undefined

  const labels =
    getAllReadableIndictmentSubtypes(indictmentSubtypes).map(capitalize)

  if (labels.length === 0) return undefined

  return labels.length === 1 ? labels[0] : `${labels[0]} +${labels.length - 1}`
}

const generateRequestCaseType = (
  type: CaseType,
  decision?: CaseDecision | null,
  parentCaseId?: string | null,
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

const caseNumber: CaseTableCellGenerator = {
  attributes: ['policeCaseNumbers', 'courtCaseNumber', 'appealCaseNumber'],
  generate: (c: Case): StringGroupValue => ({
    s: [
      c.appealCaseNumber ?? '',
      c.courtCaseNumber ?? '',
      c.policeCaseNumbers.length > 1
        ? `${c.policeCaseNumbers[0]} +${c.policeCaseNumbers.length - 1}`
        : c.policeCaseNumbers[0],
    ],
  }),
}

const defendants: CaseTableCellGenerator = {
  includes: {
    defendants: {
      model: Defendant,
      attributes: ['nationalId', 'name'],
      order: [['created', 'ASC']],
      separate: true,
    },
  },
  generate: (c: Case): StringGroupValue | undefined =>
    c.defendants && c.defendants.length > 0
      ? {
          s: [
            c.defendants[0].name ?? '',
            c.defendants.length > 1
              ? `+ ${c.defendants.length - 1}`
              : c.defendants[0].nationalId ?? '',
          ],
        }
      : undefined,
}

export const caseType: CaseTableCellGenerator = {
  attributes: ['type', 'decision', 'parentCaseId', 'indictmentSubtypes'],
  generate: (c: Case) => {
    if (c.type === CaseType.INDICTMENT) {
      const display = generateIndictmentCaseType(c.indictmentSubtypes)
      return display ? { s: [display] } : undefined
    }

    return { s: generateRequestCaseType(c.type, c.decision, c.parentCaseId) }
  },
}

const appealState: CaseTableCellGenerator = {
  attributes: [
    'appealState',
    'appealRulingDecision',
    'appealCaseNumber',
    'appealReceivedByCourtDate',
  ],
  generate: (c: Case, user: TUser): TagValue | undefined =>
    generateAppealStateTag(c, user),
}

// Same as appealState but with a different title
const appealCaseState = appealState

const requestCaseState: CaseTableCellGenerator = {
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
  generate: (c: Case, user: TUser): TagValue | undefined =>
    generateRequestCaseStateTag(c, user),
}

const indictmentCaseState: CaseTableCellGenerator = {
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
  generate: (c: Case, user: TUser): TagValue | undefined =>
    generateIndictmentCaseStateTag(c, user),
}

const courtOfAppealsHead: CaseTableCellGenerator = {
  includes: {
    appealJudge1: {
      model: User,
      attributes: ['name'],
    },
  },
  generate: (c: Case): StringGroupValue | undefined =>
    c.appealJudge1
      ? { s: [getInitials(c.appealJudge1.name) ?? ''] }
      : undefined,
}

const validFromTo: CaseTableCellGenerator = {
  attributes: [
    'type',
    'state',
    'initialRulingDate',
    'rulingDate',
    'validToDate',
  ],
  generate: (c: Case): StringGroupValue | undefined =>
    isRestrictionCase(c.type) && c.state === CaseState.ACCEPTED && c.validToDate
      ? c.initialRulingDate || c.rulingDate
        ? {
            s: [
              `${formatDate(c.initialRulingDate ?? c.rulingDate) ?? ''} - ${
                formatDate(c.validToDate) ?? ''
              }`,
            ],
          }
        : { s: [formatDate(c.validToDate) ?? ''] }
      : undefined,
}

const caseSentToCourtDate: CaseTableCellGenerator = {
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
  generate: (c: Case): StringGroupValue | undefined => {
    const caseSentToCourtEvent = EventLog.caseSentToCourtEvent(c.eventLogs)

    return caseSentToCourtEvent
      ? { s: [formatDate(caseSentToCourtEvent.created) ?? ''] }
      : undefined
  },
}

const arraignmentDate: CaseTableCellGenerator = {
  includes: {
    dateLogs: {
      model: DateLog,
      attributes: ['date', 'dateType'],
      order: [['created', 'DESC']],
      separate: true,
    },
  },
  generate: (c: Case): StringGroupValue | undefined => {
    const arraignmentDateLog = DateLog.arraignmentDate(c.dateLogs)?.date
    const courtDateLog = DateLog.courtDate(c.dateLogs)?.date
    const arraignmentDate = arraignmentDateLog ?? courtDateLog
    return arraignmentDate
      ? {
          s: [
            `${capitalize(formatDate(arraignmentDate, 'EEE d. MMMM yyyy'))}`,
            `kl. ${formatDate(arraignmentDate, 'HH:mm') ?? ''}`,
          ],
        }
      : undefined
  },
}

const indictmentArraignmentDate: CaseTableCellGenerator = {
  includes: {
    dateLogs: {
      model: DateLog,
      attributes: ['date', 'dateType'],
      order: [['created', 'DESC']],
      separate: true,
    },
  },
  generate: (c: Case): StringGroupValue | undefined => {
    if (c.indictmentDecision) {
      const courtDateLog = DateLog.courtDate(c.dateLogs)?.date
      return courtDateLog &&
        c.indictmentDecision === IndictmentDecision.SCHEDULING
        ? {
            s: [
              `${capitalize(formatDate(courtDateLog, 'EEE d. MMMM yyyy'))}`,
              `kl. ${formatDate(courtDateLog, 'HH:mm') ?? ''}`,
            ],
          }
        : undefined
    }

    const arraignmentDateLog = DateLog.arraignmentDate(c.dateLogs)?.date
    return arraignmentDateLog
      ? {
          s: [
            `${capitalize(formatDate(arraignmentDateLog, 'EEE d. MMMM yyyy'))}`,
            `kl. ${formatDate(arraignmentDateLog, 'HH:mm') ?? ''}`,
          ],
        }
      : undefined
  },
}

const rulingDate: CaseTableCellGenerator = {
  attributes: ['rulingDate'],
  generate: (c: Case): StringGroupValue | undefined =>
    c.rulingDate ? { s: [formatDate(c.rulingDate) ?? ''] } : undefined,
}

const rulingType: CaseTableCellGenerator = {
  attributes: ['indictmentRulingDecision'],
  generate: (c: Case): TagValue | undefined => {
    switch (c.indictmentRulingDecision) {
      case CaseIndictmentRulingDecision.FINE:
        return { color: 'darkerBlue', text: 'Viðurlagaákvörðun' }
      case CaseIndictmentRulingDecision.RULING:
        return { color: 'darkerBlue', text: 'Dómur' }
      default:
        return undefined
    }
  },
}

const punishmentType: CaseTableCellGenerator = {
  includes: {
    defendants: {
      model: Defendant,
      attributes: ['punishmentType'],
      order: [['created', 'ASC']],
      separate: true,
    },
  },
  generate: (c: Case): TagValue | undefined => {
    if (
      !c.defendants ||
      c.defendants.length === 0 ||
      !c.defendants[0].punishmentType
    ) {
      return undefined
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

    return {
      color: 'red',
      text: getPunishmentTypeLabel(),
    }
  },
}

const prisonAdminReceivalDate: CaseTableCellGenerator = {
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
  generate: (c: Case): StringGroupValue | undefined => {
    if (c.defendants && c.defendants.length > 0) {
      const dateOpened = DefendantEventLog.getDefendantEventLogTypeDate(
        DefendantEventType.OPENED_BY_PRISON_ADMIN,
        c.defendants[0].eventLogs,
      )

      if (dateOpened) {
        return { s: [formatDate(dateOpened) ?? ''] }
      }
    }

    return undefined
  },
}

const prisonAdminState: CaseTableCellGenerator = {
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
  generate: (c: Case): TagValue => {
    if (c.defendants && c.defendants.length > 0) {
      const dateOpened = DefendantEventLog.getDefendantEventLogTypeDate(
        DefendantEventType.OPENED_BY_PRISON_ADMIN,
        c.defendants[0].eventLogs,
      )

      if (dateOpened) {
        return { color: 'blue', text: 'Móttekið' }
      }
    }

    return { color: 'purple', text: 'Nýtt' }
  },
}

const indictmentAppealDeadline: CaseTableCellGenerator = {
  attributes: ['rulingDate', 'indictmentRulingDecision'],
  generate: (c: Case): StringGroupValue | undefined => {
    if (!c.rulingDate) {
      return undefined
    }

    const indictmentAppealDeadline = formatDate(
      getIndictmentAppealDeadlineDate(
        c.rulingDate,
        c.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE,
      ),
    )

    if (!indictmentAppealDeadline) {
      return undefined
    }

    return { s: [indictmentAppealDeadline] }
  },
}

const subpoenaServiceState: CaseTableCellGenerator = {
  attributes: ['rulingDate', 'indictmentRulingDecision'],
  includes: {
    defendants: {
      model: Defendant,
      attributes: ['serviceRequirement', 'verdictViewDate'],
      order: [['created', 'ASC']],
      separate: true,
    },
  },
  generate: (c: Case): TagValue | undefined => {
    if (c.indictmentRulingDecision !== CaseIndictmentRulingDecision.RULING) {
      return undefined
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
      return { color: 'red', text: 'Óbirt' }
    }

    if (indictmentVerdictAppealDeadlineExpired) {
      return { color: 'mint', text: 'Frestur liðinn' }
    }

    return { color: 'blue', text: 'Á fresti' }
  },
}

const indictmentReviewer: CaseTableCellGenerator = {
  includes: {
    indictmentReviewer: {
      model: User,
      attributes: ['name'],
    },
  },
  generate: (c: Case): StringGroupValue | undefined =>
    c.indictmentReviewer?.name ? { s: [c.indictmentReviewer.name] } : undefined,
}

const sentToPrisonAdminDate: CaseTableCellGenerator = {
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
  generate: (c: Case): StringGroupValue | undefined => {
    if (c.defendants && c.defendants.length > 0) {
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

      if (dateSent) {
        return { s: [formatDate(dateSent) ?? ''] }
      }
    }

    return undefined
  },
}

const indictmentRulingDecision: CaseTableCellGenerator = {
  attributes: ['indictmentRulingDecision'],
  generate: (c: Case): TagValue | undefined =>
    generateIndictmentRulingDecisionTag(c.indictmentRulingDecision),
}

const indictmentReviewDecision: CaseTableCellGenerator = {
  attributes: ['indictmentReviewDecision'],
  includes: {
    defendants: {
      model: Defendant,
      attributes: ['verdictAppealDate'],
      order: [['created', 'ASC']],
      separate: true,
    },
  },
  generate: (c: Case): TagPairValue => {
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

    return { firstTag, secondTag }
  },
}

export const caseTableCellGenerators: Record<
  CaseTableColumnKey,
  CaseTableCellGenerator
> = {
  caseNumber,
  defendants,
  caseType,
  appealState,
  courtOfAppealsHead,
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
