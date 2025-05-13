import { Includeable } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseTableColumnKey,
  caseTables,
  CaseTableType,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { CaseTableResponse } from './dto/caseTable.response'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import { caseTableWhereOptions } from './caseTable.whereOptions'

const getAttributes = (caseTableCellKeys: CaseTableColumnKey[]) => {
  return [
    'id',
    ...caseTableCellKeys
      .map((k) => caseTableCellGenerators[k].attributes ?? [])
      .flat(),
  ]
}

const getIncludes = (caseTableCellKeys: CaseTableColumnKey[]) => {
  return caseTableCellKeys
    .filter((k) => caseTableCellGenerators[k].includes)
    .map(
      (k) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Object.entries(caseTableCellGenerators[k].includes!).map(([k, v]) => ({
          ...v,
          includes: undefined,
          as: k,
          include:
            v.includes &&
            Object.entries(v.includes).map(([k, v]) => ({
              ...v,
              as: k,
            })),
        })) as Includeable,
    )
    .flat()
}

@Injectable()
export class CaseTableService {
  constructor(
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getCaseTableRows(
    type: CaseTableType,
    user: TUser,
  ): Promise<CaseTableResponse> {
    const caseTableCellKeys = caseTables[type].columnKeys

    const attributes = getAttributes(caseTableCellKeys)

    const include = getIncludes(caseTableCellKeys)

    const cases = await this.caseModel.findAll({
      attributes,
      include,
      where: caseTableWhereOptions[type],
    })

    return {
      rowCount: cases.length,
      rows: cases.map((c) => ({
        caseId: c.id,
        cells: caseTableCellKeys.map((k) => ({
          value: caseTableCellGenerators[k].generate(c, user),
        })),
      })),
    }
  }
}
