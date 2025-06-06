import { Includeable } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseTableColumnKey,
  caseTables,
  CaseTableType,
  isDistrictCourtUser,
  isProsecutionUser,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { User } from '../user'
import { CaseTableResponse } from './dto/caseTable.response'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import { caseTableWhereOptions } from './caseTable.whereOptions'

const getAttributes = (
  caseTableCellKeys: CaseTableColumnKey[],
  user: TUser,
) => {
  return [
    'id',
    ...caseTableCellKeys
      .map((k) => caseTableCellGenerators[k].attributes ?? [])
      .flat(),
    ...(isProsecutionUser(user)
      ? ['creatingProsecutorId', 'prosecutorId']
      : []),
  ]
}

const getIsMyCaseIncludes = (user: TUser): Includeable[] => {
  if (isDistrictCourtUser(user)) {
    return [
      {
        model: User,
        attributes: ['id'],
        as: 'judge',
      },
      {
        model: User,
        attributes: ['id'],
        as: 'registrar',
      },
    ]
  }

  return []
}

const getIncludes = (caseTableCellKeys: CaseTableColumnKey[], user: TUser) => {
  return getIsMyCaseIncludes(user).concat(
    caseTableCellKeys
      .filter((k) => caseTableCellGenerators[k].includes)
      .map(
        (k) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Object.entries(caseTableCellGenerators[k].includes!).map(
            ([k, v]) => ({
              ...v,
              includes: undefined,
              as: k,
              ...(v.includes
                ? {
                    include: Object.entries(v.includes).map(([k, v]) => ({
                      ...v,
                      as: k,
                    })),
                  }
                : undefined),
            }),
          ) as Includeable,
      )
      .flat(),
  )
}

const isMyCase = (theCase: Case, user: TUser): boolean => {
  if (isDistrictCourtUser(user)) {
    return theCase.judge?.id === user.id || theCase.registrar?.id === user.id
  }
  if (isProsecutionUser(user)) {
    return (
      theCase.creatingProsecutorId === user.id ||
      theCase.prosecutorId === user.id
    )
  }

  return false
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

    const attributes = getAttributes(caseTableCellKeys, user)

    const include = getIncludes(caseTableCellKeys, user)

    const cases = await this.caseModel.findAll({
      attributes,
      include,
      where: caseTableWhereOptions[type](user),
    })

    return {
      rowCount: cases.length,
      rows: cases.map((c) => ({
        caseId: c.id,
        isMyCase: isMyCase(c, user),
        cells: caseTableCellKeys.map((k) =>
          caseTableCellGenerators[k].generate(c, user),
        ),
      })),
    }
  }
}
