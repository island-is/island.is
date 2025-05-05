import { Op, WhereOptions } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  capitalize,
  formatCaseType,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealState,
  CaseDecision,
  CaseTableColumnKey,
  caseTables,
  CaseTableType,
  CaseType,
  completedRequestCaseStates,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { CaseTableCell, CaseTableResponse } from './dto/caseTable.response'

interface CaseTableCellGenerator {
  attributes: (keyof Case)[]
  generate: (caseModel: Case) => CaseTableCell
}

const cellGenerators: Record<CaseTableColumnKey, CaseTableCellGenerator> = {
  caseNumber: {
    attributes: ['policeCaseNumbers', 'courtCaseNumber', 'appealCaseNumber'],
    generate: (c: Case) => ({
      value: {
        s: [
          c.appealCaseNumber ?? '',
          c.courtCaseNumber ?? '',
          c.policeCaseNumbers.length > 1
            ? `${c.policeCaseNumbers[0]} +${c.policeCaseNumbers.length - 1}`
            : c.policeCaseNumbers[0],
        ],
      },
    }),
  },
  defendants: {
    attributes: [],
    generate: (c: Case) => ({ value: { s: ['1234'] } }),
  },
  caseType: {
    attributes: ['type', 'decision', 'parentCaseId'],
    generate: (c: Case) => ({
      value: {
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
      },
    }),
  },
  caseState: {
    attributes: [],
    generate: (c: Case) => ({ value: { s: ['1234'] } }),
  },
  courtOfAppealsHead: {
    attributes: [],
    generate: (c: Case) => ({ value: { s: ['1234'] } }),
  },
  validFromTo: {
    attributes: [],
    generate: (c: Case) => ({ value: { s: ['1234'] } }),
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

  async getCaseTableRows(type: CaseTableType): Promise<CaseTableResponse> {
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
        cells: caseTableCellKeys.map((k) => cellGenerators[k].generate(c)),
      })),
    }
  }
}
