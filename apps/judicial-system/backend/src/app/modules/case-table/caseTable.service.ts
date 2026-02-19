import { Includeable, literal, Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import {
  CaseTableColumnKey,
  caseTables,
  CaseTableType,
  IndictmentCaseReviewDecision,
  isDistrictCourtUser,
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
  getMatch,
  isMyCase,
  normalizeCaseTypeForDisplay,
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

    // Display defendants in separate lines for public prosecutors office
    const displayCases: Case[] = isPublicProsecutionOfficeUser(user)
      ? cases.flatMap((caseItem) =>
          expandCaseWithDefendants(caseItem, getDefendantFilter(type)),
        )
      : cases

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

    const cases = await this.caseRepositoryService.findAll({
      attributes: [
        'id',
        'type',
        'decision',
        'policeCaseNumbers',
        'courtCaseNumber',
        'appealCaseNumber',
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
      order: [['id', 'ASC']],
      limit: 10,
    })

    const rows = cases.flatMap((c) => {
      const match = getMatch(c, query)

      const caseType = normalizeCaseTypeForDisplay(c.type, c.decision)

      const defendants = c.defendants ?? []

      if (defendants.length === 0) {
        return [
          {
            caseId: c.id,
            caseType,
            matchedField: match.field,
            matchedValue: match.value,
            policeCaseNumbers: c.policeCaseNumbers,
            courtCaseNumber: c.courtCaseNumber ?? null,
            appealCaseNumber: c.appealCaseNumber ?? null,
            defendantNationalId: null,
            defendantName: null,
          },
        ]
      }

      return defendants.map((d) => ({
        caseId: c.id,
        caseType,
        matchedField: match.field,
        matchedValue: match.value,
        policeCaseNumbers: c.policeCaseNumbers,
        courtCaseNumber: c.courtCaseNumber ?? null,
        appealCaseNumber: c.appealCaseNumber ?? null,
        defendantNationalId: d.nationalId ?? null,
        defendantName: d.name ?? null,
      }))
    })

    const normalizedQuery = query.toLowerCase().trim()
    const isExactMatch = (value: string | null | undefined) =>
      value != null && value.toLowerCase().trim() === normalizedQuery

    rows.sort((a, b) => {
      const aExact = isExactMatch(a.matchedValue)
      const bExact = isExactMatch(b.matchedValue)
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      return 0
    })

    return {
      rowCount: rows.length,
      rows,
    }
  }
}
