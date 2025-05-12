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
  CaseState,
  CaseTableColumnKey,
  CaseType,
  isCourtOfAppealsUser,
  isRestrictionCase,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { Defendant } from '../defendant'
import { User } from '../user'
import {
  CaseTableCellValue,
  StringGroupValue,
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
  generate: (c: Case, user: TUser): TagValue | undefined => {
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
  },
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
  attributes: ['initialRulingDate', 'rulingDate'],
  generate: (c: Case): StringGroupValue | undefined =>
    c.initialRulingDate || c.rulingDate
      ? { s: [formatDate(c.initialRulingDate ?? c.rulingDate) ?? ''] }
      : undefined,
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
}
