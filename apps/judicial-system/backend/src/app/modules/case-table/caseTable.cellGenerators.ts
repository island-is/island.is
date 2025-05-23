import { ModelStatic } from 'sequelize-typescript'

import {
  capitalize,
  formatCaseType,
  formatDate,
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
  getIndictmentAppealDeadlineDate,
  getIndictmentVerdictAppealDeadlineStatus,
  IndictmentCaseReviewDecision,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isRestrictionCase,
  PunishmentType,
  ServiceRequirement,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { DateLog } from '../case/models/dateLog.model'
import { Defendant, DefendantEventLog } from '../defendant'
import { User } from '../user'
import {
  CaseTableCellValue,
  StringGroupValue,
  StringValue,
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

const caseNumber: CaseTableCellGenerator = {
  attributes: ['policeCaseNumbers', 'courtCaseNumber', 'appealCaseNumber'],
  generate: (c: Case): StringGroupValue => ({
    strList: [
      c.appealCaseNumber ?? '',
      c.courtCaseNumber ?? '',
      c.policeCaseNumbers.length > 1
        ? `${c.policeCaseNumbers[0]} +${c.policeCaseNumbers.length - 1}`
        : c.policeCaseNumbers[0],
    ],
  }),
}

const generateDate = (date: Date | undefined): StringValue | undefined => {
  const rulingDate = formatDate(date, 'd.M.yyyy')
  const sortValue = formatDate(date, 'yyyyMMdd')

  if (!rulingDate || !sortValue) {
    return undefined
  }

  return { str: rulingDate, sortValue: sortValue }
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
          strList: [
            c.defendants[0].name ?? '',
            c.defendants.length > 1
              ? `+ ${c.defendants.length - 1}`
              : c.defendants[0].nationalId ?? '',
          ],
        }
      : undefined,
}

const caseType: CaseTableCellGenerator = {
  attributes: ['type', 'decision', 'parentCaseId'],
  generate: (c: Case): StringGroupValue => ({
    strList: [
      capitalize(
        formatCaseType(
          c.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
            ? CaseType.CUSTODY
            : c.type,
        ),
      ),
      c.parentCaseId ? 'Framlenging' : '',
    ],
  }),
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

const courtOfAppealsHead: CaseTableCellGenerator = {
  includes: {
    appealJudge1: {
      model: User,
      attributes: ['name'],
    },
  },
  generate: (c: Case): StringGroupValue | undefined =>
    c.appealJudge1
      ? { strList: [getInitials(c.appealJudge1.name) ?? ''] }
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
            strList: [
              `${formatDate(c.initialRulingDate ?? c.rulingDate) ?? ''} - ${
                formatDate(c.validToDate) ?? ''
              }`,
            ],
          }
        : { strList: [formatDate(c.validToDate) ?? ''] }
      : undefined,
}

const rulingDate: CaseTableCellGenerator = {
  attributes: ['rulingDate'],
  generate: (c: Case): StringValue | undefined => generateDate(c.rulingDate),
}

const restrictionCaseState: CaseTableCellGenerator = {
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
  generate: (c: Case, user: TUser): TagPairValue | undefined => ({
    firstTag: generateRequestCaseStateTag(c, user),
    secondTag: generateAppealStateTag(c, user),
  }),
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
  generate: (c: Case): StringValue | undefined => {
    if (!c.defendants || c.defendants.length === 0) {
      return undefined
    }

    const dateOpened = DefendantEventLog.getDefendantEventLogTypeDate(
      DefendantEventType.OPENED_BY_PRISON_ADMIN,
      c.defendants[0].eventLogs,
    )

    return generateDate(dateOpened)
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
    if (!c.defendants || c.defendants.length === 0) {
      return { color: 'red', text: 'Óþekkt' } // This should never happen
    }

    const dateOpened = DefendantEventLog.getDefendantEventLogTypeDate(
      DefendantEventType.OPENED_BY_PRISON_ADMIN,
      c.defendants[0].eventLogs,
    )

    if (dateOpened) {
      return { color: 'blue', text: 'Móttekið' }
    }

    return { color: 'purple', text: 'Nýtt' }
  },
}

const indictmentAppealDeadline: CaseTableCellGenerator = {
  attributes: ['rulingDate', 'indictmentRulingDecision'],
  generate: (c: Case): StringValue | undefined => {
    if (!c.rulingDate) {
      return undefined
    }

    const deadlineDate = getIndictmentAppealDeadlineDate(
      c.rulingDate,
      c.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE,
    )

    return generateDate(deadlineDate)
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
    const isFine =
      c.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

    if (isFine) {
      return undefined
    }

    const isRuling =
      c.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
    const verdictInfo = c.defendants?.map<[boolean, Date | undefined]>((d) => [
      isRuling || isFine,
      isFine || d.serviceRequirement === ServiceRequirement.NOT_REQUIRED
        ? c.rulingDate
        : d.verdictViewDate,
    ])
    const [
      indictmentVerdictViewedByAll,
      indictmentVerdictAppealDeadlineExpired,
    ] = getIndictmentVerdictAppealDeadlineStatus(verdictInfo, isFine)

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
    c.indictmentReviewer?.name
      ? { strList: [c.indictmentReviewer.name] }
      : undefined,
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
  generate: (c: Case): StringValue | undefined => {
    if (!c.defendants) {
      return undefined
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
  restrictionCaseState,
  rulingType,
  punishmentType,
  prisonAdminReceivalDate,
  prisonAdminState,
  indictmentAppealDeadline,
  subpoenaServiceState,
  indictmentReviewer,
  sentToPrisonAdminDate,
  indictmentReviewDecision,
}
