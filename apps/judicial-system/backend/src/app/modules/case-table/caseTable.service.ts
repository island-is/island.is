import { Includeable, literal, Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import {
  CaseTableColumnKey,
  caseTables,
  CaseTableType,
  CaseType,
  IndictmentCaseReviewDecision,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case, CaseRepositoryService, Defendant, User } from '../repository'
import { CaseTableResponse } from './dto/caseTable.response'
import { SearchCasesResponse } from './dto/searchCases.response'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import {
  getActionOnRowClick,
  getContextMenuActions,
  isMyCase,
} from './caseTable.utils'
import {
  caseTableWhereOptions,
  userAccessWhereOptions,
} from './caseTable.whereOptions'

const getIsMyCaseAttributes = (user: TUser): string[] => {
  if (isProsecutionUser(user)) {
    return ['creatingProsecutorId', 'prosecutorId']
  }

  return []
}

const getAvailableActionsAttributes = (user: TUser): string[] => {
  if (isProsecutionUser(user)) {
    return ['type', 'state', 'appealState', 'prosecutorPostponedAppealDate']
  }

  if (isDistrictCourtUser(user)) {
    return ['type', 'state']
  }

  return []
}

const getAttributes = (
  caseTableCellKeys: CaseTableColumnKey[],
  user: TUser,
) => {
  return getIsMyCaseAttributes(user)
    .concat(getAvailableActionsAttributes(user))
    .concat([
      'id',
      ...caseTableCellKeys
        .map((k) => caseTableCellGenerators[k].attributes ?? [])
        .flat(),
    ])
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

@Injectable()
export class CaseTableService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly caseRepositoryService: CaseRepositoryService,
  ) {}

  async getCaseTableRows(
    type: CaseTableType,
    user: TUser,
  ): Promise<CaseTableResponse> {
    const caseTableCellKeys = caseTables[type].columnKeys

    const attributes = getAttributes(caseTableCellKeys, user)

    const include = getIncludes(caseTableCellKeys, user)

    const cases = await this.caseRepositoryService.findAll({
      attributes,
      include,
      where: caseTableWhereOptions[type](user),
    })

    const getDefendantFilter = (type: CaseTableType) => {
      const reviewedTypes = [
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED,
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEAL_PERIOD_EXPIRED,
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED,
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_SENT_TO_PRISON_ADMIN,
      ]

      if (!reviewedTypes.includes(type)) {
        return () => true
      }

      const targetDecision = [
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED,
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEAL_PERIOD_EXPIRED,
        CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_SENT_TO_PRISON_ADMIN,
      ].includes(type)
        ? IndictmentCaseReviewDecision.ACCEPT
        : IndictmentCaseReviewDecision.APPEAL

      return (defendant: Defendant) =>
        defendant.indictmentReviewDecision === targetDecision
    }

    const expandCaseWithDefendants = (
      caseItem: Case,
      filter: (defendant: Defendant) => boolean,
    ) => {
      const jsonCase = caseItem.toJSON()

      if (!caseItem.defendants?.length) {
        return [jsonCase]
      }

      const filteredDefendants = caseItem.defendants.filter(filter)

      return filteredDefendants.length > 0
        ? filteredDefendants.map((defendant) => ({
            ...jsonCase,
            defendants: [defendant],
          }))
        : []
    }

    // Display defendants in separate lines for public prosecutors office and prison admin
    let displayCases: Case[]
    if (isPublicProsecutionOfficeUser(user)) {
      displayCases = cases.flatMap((caseItem) =>
        expandCaseWithDefendants(caseItem, getDefendantFilter(type)),
      )
    } else if (isPrisonAdminUser(user)) {
      displayCases = cases.flatMap((caseItem) =>
        expandCaseWithDefendants(caseItem, (d) =>
          Boolean(d.isSentToPrisonAdmin),
        ),
      )
    } else {
      displayCases = cases
    }

    return {
      rowCount: displayCases.length,
      rows: displayCases.map((c) => ({
        caseId: c.id,
        defendantIds: c.defendants?.map((d) => d.id),
        isMyCase: isMyCase(c, user),
        actionOnRowClick: getActionOnRowClick(c, user),
        contextMenuActions: getContextMenuActions(c, user),
        cells: caseTableCellKeys.map((k) =>
          caseTableCellGenerators[k].generate(c, user),
        ),
      })),
    }
  }

  async searchCases(query: string, user: TUser): Promise<SearchCasesResponse> {
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
