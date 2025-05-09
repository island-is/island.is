import { Includeable, Op, WhereOptions } from 'sequelize'
import { ModelStatic } from 'sequelize-typescript'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  capitalize,
  formatCaseType,
  formatDate,
  getAppealResultTextByValue,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseTableColumnKey,
  caseTables,
  CaseTableType,
  CaseType,
  completedRequestCaseStates,
  investigationCases,
  isCourtOfAppealsUser,
  isRestrictionCase,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { Defendant } from '../defendant'
import {
  CaseTableCellValue,
  CaseTableResponse,
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
  }
}

interface CaseTableCellGenerator {
  attributes?: (keyof Case)[]
  includes?: Partial<CaseIncludes>
  generate: (caseModel: Case, user: User) => CaseTableCellValue | undefined
}

const cellGenerators: Record<CaseTableColumnKey, CaseTableCellGenerator> = {
  caseNumber: {
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
  },
  defendants: {
    includes: {
      defendants: {
        model: Defendant,
        attributes: ['nationalId', 'name'],
        order: [['created', 'ASC']],
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
  },
  caseType: {
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
  },
  appealState: {
    attributes: ['appealState', 'appealRulingDecision', 'appealCaseNumber'],
    generate: (c: Case, user: User): TagValue | undefined => {
      switch (c.appealState) {
        case CaseAppealState.WITHDRAWN:
          return { color: 'red', text: 'Afturkallað' }
        case CaseAppealState.APPEALED:
          return { color: 'red', text: 'Kært' }
        case CaseAppealState.RECEIVED:
          if (isCourtOfAppealsUser(user) && !c.appealCaseNumber) {
            return { color: 'purple', text: 'Nýtt' }
          } else {
            return { color: 'darkerBlue', text: 'Móttekið' }
          }
        case CaseAppealState.COMPLETED:
          return {
            color:
              c.appealRulingDecision === CaseAppealRulingDecision.ACCEPTING
                ? 'mint'
                : c.appealRulingDecision === CaseAppealRulingDecision.CHANGED ||
                  c.appealRulingDecision ===
                    CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY ||
                  c.appealRulingDecision === CaseAppealRulingDecision.REPEAL ||
                  c.appealRulingDecision ===
                    CaseAppealRulingDecision.DISCONTINUED
                ? 'rose'
                : 'blueberry',
            text: getAppealResultTextByValue(c.appealRulingDecision),
          }
        default:
          return undefined
      }
    },
  },
  courtOfAppealsHead: {
    attributes: [],
    generate: (c: Case): StringGroupValue => ({ s: ['1234'] }),
  },
  validFromTo: {
    attributes: [
      'type',
      'state',
      'initialRulingDate',
      'rulingDate',
      'validToDate',
    ],
    generate: (c: Case): StringGroupValue | undefined =>
      isRestrictionCase(c.type) &&
      c.state === CaseState.ACCEPTED &&
      c.validToDate
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
  },
}

const whereOptions: Record<CaseTableType, WhereOptions> = {
  [CaseTableType.COURT_OF_APPEALS_IN_PROGRESS]: {
    is_archived: false,
    type: [...restrictionCases, ...investigationCases],
    state: completedRequestCaseStates,
    [Op.or]: [
      { appeal_state: CaseAppealState.RECEIVED },
      {
        [Op.and]: [
          { appeal_state: [CaseAppealState.WITHDRAWN] },
          { appeal_received_by_court_date: { [Op.not]: null } },
        ],
      },
    ],
  },
  [CaseTableType.COURT_OF_APPEALS_COMPLETED]: {
    is_archived: false,
    type: [...restrictionCases, ...investigationCases],
    state: completedRequestCaseStates,
    appeal_state: CaseAppealState.COMPLETED,
  },
}

@Injectable()
export class CaseTableService {
  constructor(
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getCaseTableRows(
    type: CaseTableType,
    user: User,
  ): Promise<CaseTableResponse> {
    const caseTableCellKeys = caseTables[type].columnKeys

    const attributes = [
      'id',
      ...caseTableCellKeys
        .map((k) => cellGenerators[k].attributes ?? [])
        .flat(),
    ]

    const include: Includeable[] = caseTableCellKeys
      .filter((k) => cellGenerators[k].includes)
      .map(
        (k) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Object.entries(cellGenerators[k].includes!).map(([k, v]) => ({
            ...v,
            as: k,
            separate: true,
          })) as Includeable,
      )
      .flat()

    const cases = await this.caseModel.findAll({
      attributes,
      include,
      where: whereOptions[type],
    })

    return {
      rowCount: cases.length,
      rows: cases.map((c) => ({
        caseId: c.id,
        cells: caseTableCellKeys.map((k) => ({
          value: cellGenerators[k].generate(c, user),
        })),
      })),
    }
  }
}
