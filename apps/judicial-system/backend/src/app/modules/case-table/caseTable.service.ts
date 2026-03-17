import { literal, Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import {
  caseTables,
  CaseTableType,
  CaseType,
  type User,
} from '@island.is/judicial-system/types'

import { CaseRepositoryService, Defendant } from '../repository'
import { CaseTableResponse } from './dto/caseTable.response'
import { SearchCasesResponse } from './dto/searchCases.response'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import { caseTableDisplayCases } from './caseTable.displayCases'
import {
  getActionOnRowClick,
  getAttributes,
  getContextMenuActions,
  getIncludes,
  isMyCase,
} from './caseTable.utils'
import {
  caseTableWhereOptions,
  userAccessWhereOptions,
} from './caseTable.whereOptions'

@Injectable()
export class CaseTableService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly caseRepositoryService: CaseRepositoryService,
  ) {}

  async getCaseTableRows(
    type: CaseTableType,
    user: User,
  ): Promise<CaseTableResponse> {
    const caseTableCellKeys = caseTables[type].columnKeys
    const whereOptions = caseTableWhereOptions[type](user)

    const attributes = getAttributes(caseTableCellKeys, user)

    const [include, globalOrder] = getIncludes(
      whereOptions.includes ?? {},
      caseTableCellKeys,
      user,
    )

    const cases = await this.caseRepositoryService.findAll({
      attributes,
      include,
      where: whereOptions.where,
      order: globalOrder,
    })
    console.log(
      `Fetched ${cases.length} cases for case table type ${type} and user ${
        user.id
      } ${JSON.stringify(cases)}`,
    )
    const displayCases = caseTableDisplayCases[type](cases)
    console.log(
      `After processing, ${displayCases.length} cases are displayed in the case table type ${type} for user ${user.id}`,
    )
    return {
      rowCount: displayCases.length,
      rows: displayCases.map((c) => ({
        caseId: c.id,
        defendantIds: c.defendants?.map((d: Defendant) => d.id),
        isMyCase: isMyCase(c, user),
        actionOnRowClick: getActionOnRowClick(c, user),
        contextMenuActions: getContextMenuActions(c, user),
        cells: caseTableCellKeys.map((k) =>
          caseTableCellGenerators[k].generate(c, user),
        ),
      })),
    }
  }

  async searchCases(query: string, user: User): Promise<SearchCasesResponse> {
    const safeQuery = this.sequelize.escape(`%${query}%`)
    const safeNormalizedQuery = this.sequelize.escape(
      query.toLowerCase().trim(),
    )

    const matchedValueExpr = `
      COALESCE(
        (SELECT n FROM unnest("Case"."police_case_numbers") AS n WHERE n ILIKE ${safeQuery} LIMIT 1),
        CASE WHEN "Case"."court_case_number" ILIKE ${safeQuery} THEN "Case"."court_case_number" END,
        CASE WHEN "Case"."appeal_case_number" ILIKE ${safeQuery} THEN "Case"."appeal_case_number" END,
        (SELECT d."national_id" FROM "defendant" d WHERE d."case_id" = "Case"."id" AND d."national_id" ILIKE ${safeQuery} ORDER BY d."created" ASC LIMIT 1),
        (SELECT d."name" FROM "defendant" d WHERE d."case_id" = "Case"."id" AND d."name" ILIKE ${safeQuery} ORDER BY d."created" ASC LIMIT 1),
        (SELECT n FROM unnest("Case"."police_case_numbers") AS n LIMIT 1),
        ''
      )
    `

    const matchedFieldExpr = `
      CASE
        WHEN (SELECT n FROM unnest("Case"."police_case_numbers") AS n WHERE n ILIKE ${safeQuery} LIMIT 1) IS NOT NULL THEN 'policeCaseNumbers'
        WHEN "Case"."court_case_number" ILIKE ${safeQuery} THEN 'courtCaseNumber'
        WHEN "Case"."appeal_case_number" ILIKE ${safeQuery} THEN 'appealCaseNumber'
        WHEN (SELECT d."national_id" FROM "defendant" d WHERE d."case_id" = "Case"."id" AND d."national_id" ILIKE ${safeQuery} ORDER BY d."created" ASC LIMIT 1) IS NOT NULL THEN 'defendantNationalId'
        WHEN (SELECT d."name" FROM "defendant" d WHERE d."case_id" = "Case"."id" AND d."name" ILIKE ${safeQuery} ORDER BY d."created" ASC LIMIT 1) IS NOT NULL THEN 'defendantName'
        ELSE 'policeCaseNumbers'
      END
    `

    const caseTypeExpr = `
      CASE
        WHEN "Case"."type" = 'CUSTODY' AND "Case"."decision" = 'ACCEPTING_ALTERNATIVE_TRAVEL_BAN' THEN 'TRAVEL_BAN'
        ELSE "Case"."type"
      END
    `

    const cases = await this.caseRepositoryService.findAll({
      attributes: [
        'id',
        'type',
        'decision',
        'policeCaseNumbers',
        'courtCaseNumber',
        'appealCaseNumber',
        [literal(matchedValueExpr), 'matchedValue'],
        [literal(matchedFieldExpr), 'matchedField'],
        [literal(caseTypeExpr), 'caseType'],
      ],
      include: [
        {
          model: Defendant,
          attributes: ['nationalId', 'name'],
          as: 'defendants',
          separate: true,
          order: [['created', 'ASC']],
        },
      ],
      where: {
        [Op.and]: [
          userAccessWhereOptions(user),
          {
            [Op.or]: [
              literal(`
                EXISTS (
                  SELECT 1 FROM unnest("Case"."police_case_numbers") AS n
                  WHERE n ILIKE ${safeQuery}
                )
              `),
              { court_case_number: { [Op.iLike]: `%${query}%` } },
              { appeal_case_number: { [Op.iLike]: `%${query}%` } },
              literal(`
                EXISTS (
                  SELECT 1 FROM "defendant" d
                  WHERE d."case_id" = "Case"."id"
                    AND d."name" ILIKE ${safeQuery}
                )
              `),
              literal(`
                EXISTS (
                  SELECT 1 FROM "defendant" d
                  WHERE d."case_id" = "Case"."id"
                    AND d."national_id" ILIKE ${safeQuery}
                )
              `),
            ],
          },
        ],
      },
      order: [
        [
          literal(
            `(LOWER(TRIM(${matchedValueExpr})) = ${safeNormalizedQuery})`,
          ),
          'DESC',
        ],
        ['id', 'ASC'],
      ],
      limit: 10,
    })

    const rows = cases.flatMap((c) => {
      const caseMatchedValue = (c.get('matchedValue') as string) ?? ''
      const caseMatchedField =
        (c.get('matchedField') as string) ?? 'policeCaseNumbers'
      const caseType = (c.get('caseType') ?? c.type) as CaseType
      const defendants = c.defendants ?? []
      const normalizedCaseMatch = caseMatchedValue.toLowerCase().trim()

      const isDefendantLevelMatch =
        caseMatchedField === 'defendantName' ||
        caseMatchedField === 'defendantNationalId'

      if (defendants.length === 0) {
        return [
          {
            caseId: c.id,
            caseType,
            matchedField: caseMatchedField,
            matchedValue: caseMatchedValue,
            policeCaseNumbers: c.policeCaseNumbers,
            courtCaseNumber: c.courtCaseNumber ?? null,
            appealCaseNumber: c.appealCaseNumber ?? null,
            defendantNationalId: null,
            defendantName: null,
          },
        ]
      }

      return defendants.map((d) => {
        let matchedField = caseMatchedField
        let matchedValue = caseMatchedValue
        if (isDefendantLevelMatch) {
          const defendantMatches =
            (caseMatchedField === 'defendantName' &&
              (d.name ?? '').toLowerCase().trim() === normalizedCaseMatch) ||
            (caseMatchedField === 'defendantNationalId' &&
              (d.nationalId ?? '').toLowerCase().trim() === normalizedCaseMatch)
          if (!defendantMatches) {
            matchedField = 'policeCaseNumbers'
            matchedValue = ''
          }
        }
        return {
          caseId: c.id,
          caseType,
          matchedField,
          matchedValue,
          policeCaseNumbers: c.policeCaseNumbers,
          courtCaseNumber: c.courtCaseNumber ?? null,
          appealCaseNumber: c.appealCaseNumber ?? null,
          defendantNationalId: d.nationalId ?? null,
          defendantName: d.name ?? null,
        }
      })
    })

    return {
      rowCount: rows.length,
      rows,
    }
  }
}
