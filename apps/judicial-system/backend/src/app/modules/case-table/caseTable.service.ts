import { Op } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseAppealState,
  CaseTableType,
  completedRequestCaseStates,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { CaseTableResponse } from './dto/caseTable.response'

interface CaseTableCell {
  attributes: (keyof Case)[]
}

const caseTableCells: { [key: string]: CaseTableCell } = {
  caseNumber: {
    attributes: ['policeCaseNumbers', 'courtCaseNumber', 'appealCaseNumber'],
  },
} as const

@Injectable()
export class CaseTableService {
  constructor(
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getCaseTableRows(type: CaseTableType): Promise<CaseTableResponse> {
    const caseTableCellKeys: (keyof typeof caseTableCells)[] = ['caseNumber']

    const cases = await this.caseModel.findAll({
      attributes: [
        'id',
        ...caseTableCellKeys
          .map((key) => caseTableCells[key].attributes)
          .flat(),
      ],
      where: {
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
    })

    return {
      rowCount: cases.length,
      rows: cases.map((c) => ({
        id: c.id,
        cells: [
          {
            value: [
              c.appealCaseNumber ?? '',
              c.courtCaseNumber ?? '',
              ...[
                c.policeCaseNumbers.length > 1
                  ? `${c.policeCaseNumbers[0]} +${
                      c.policeCaseNumbers.length - 1
                    }`
                  : c.policeCaseNumbers[0],
              ],
            ],
          },
          { value: ['1234'] },
          { value: ['1234'] },
          { value: ['1234'] },
          { value: ['1234'] },
        ],
      })),
    }
  }
}
