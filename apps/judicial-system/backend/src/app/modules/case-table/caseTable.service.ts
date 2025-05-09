import { Op, WhereOptions } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  capitalize,
  formatCaseType,
  getAppealResultTextByValue,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseTableColumnKey,
  caseTables,
  CaseTableType,
  CaseType,
  completedRequestCaseStates,
  investigationCases,
  isCourtOfAppealsUser,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import {
  CaseTableCellValue,
  CaseTableResponse,
  StringGroupValue,
  TagValue,
} from './dto/caseTable.response'

interface CaseTableCellGenerator {
  attributes: (keyof Case)[]
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
    attributes: [],
    generate: (c: Case): StringGroupValue => ({ s: ['1234'] }),
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
    attributes: [],
    generate: (c: Case): StringGroupValue => ({ s: ['1234'] }),
  },
}

const whereMap: Record<CaseTableType, WhereOptions> = {
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

    const cases = await this.caseModel.findAll({
      attributes: [
        'id',
        ...caseTableCellKeys.map((k) => cellGenerators[k].attributes).flat(),
      ],
      where: whereMap[type],
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
