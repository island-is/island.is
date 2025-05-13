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
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isRestrictionCase,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { DateLog } from '../case/models/dateLog.model'
import { Defendant } from '../defendant'
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
    attributes: (keyof DefinedObject<Case[K]>)[]
    order?: [[keyof DefinedObject<Case[K]>, 'ASC' | 'DESC']]
    separate?: boolean
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

const caseType: CaseTableCellGenerator = {
  attributes: ['type', 'decision', 'parentCaseId'],
  generate: (c: Case): StringGroupValue => ({
    s: [
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

const rulingDate: CaseTableCellGenerator = {
  attributes: ['rulingDate'],
  generate: (c: Case): StringGroupValue | undefined =>
    c.rulingDate ? { s: [formatDate(c.rulingDate) ?? ''] } : undefined,
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
  generate: (c: Case): TagValue | undefined => undefined,
}

const fmstReceivalDate: CaseTableCellGenerator = {
  generate: (c: Case): StringGroupValue | undefined => undefined,
}

const fmstState: CaseTableCellGenerator = {
  generate: (c: Case): TagValue | undefined => undefined,
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
  fmstReceivalDate,
  fmstState,
}
