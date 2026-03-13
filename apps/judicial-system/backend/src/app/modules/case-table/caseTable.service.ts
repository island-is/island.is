import { Includeable, literal, Op, WhereOptions } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import {
  CaseTableColumnKey,
  caseTables,
  CaseTableType,
  CaseType,
  isDistrictCourtUser,
  isProsecutionUser,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { CaseRepositoryService, Defendant, User } from '../repository'
import { CaseTableResponse } from './dto/caseTable.response'
import { SearchCasesResponse } from './dto/searchCases.response'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import { caseTableDisplayCases } from './caseTable.displayCases'
import { caseIncludeSchema } from './caseTable.includeSchema'
import {
  getActionOnRowClick,
  getContextMenuActions,
  isMyCase,
} from './caseTable.utils'
import {
  caseTableDefendantWhereOptions,
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

type CellInclude = {
  attributes?: string[]
  where?: unknown
  includes?: Record<
    string,
    { attributes?: string[]; where?: unknown } | undefined
  >
}

type MergedEntry = {
  attrSets: (string[] | undefined)[]
  hasNoWhere: boolean
  wheres: unknown[]
  nested: Map<
    string,
    {
      attrSets: (string[] | undefined)[]
      hasNoWhere: boolean
      wheres: unknown[]
    }
  >
}

const mergeAttrs = (
  attrSets: (string[] | undefined)[],
): string[] | undefined => {
  if (attrSets.some((s) => s === undefined)) return undefined

  return [...new Set(attrSets.flatMap((s) => s as string[]))]
}

const mergeWhere = (hasNoWhere: boolean, wheres: unknown[]): unknown => {
  if (hasNoWhere || wheres.length === 0) return undefined

  return wheres.length === 1 ? wheres[0] : { [Op.or]: wheres }
}

const getIncludes = (
  caseTableCellKeys: CaseTableColumnKey[],
  user: TUser,
  defendantWhereOptions?: WhereOptions,
): Includeable[] => {
  const collected = new Map<string, MergedEntry>()

  for (const k of caseTableCellKeys) {
    const gen = caseTableCellGenerators[k]
    if (!gen.includes) {
      continue
    }

    for (const [assocKey, assocVal] of Object.entries(gen.includes) as [
      string,
      CellInclude | undefined,
    ][]) {
      if (!assocVal) {
        continue
      }

      if (!collected.has(assocKey)) {
        collected.set(assocKey, {
          attrSets: [],
          hasNoWhere: false,
          wheres: [],
          nested: new Map(),
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entry = collected.get(assocKey)!

      entry.attrSets.push(assocVal.attributes)
      if (assocVal.where !== undefined) {
        entry.wheres.push(assocVal.where)
      } else {
        entry.hasNoWhere = true
      }

      if (assocVal.includes) {
        for (const [nestedKey, nestedVal] of Object.entries(
          assocVal.includes,
        ) as [
          string,
          { attributes?: string[]; where?: unknown } | undefined,
        ][]) {
          if (!nestedVal) {
            continue
          }

          if (!entry.nested.has(nestedKey)) {
            entry.nested.set(nestedKey, {
              attrSets: [],
              hasNoWhere: false,
              wheres: [],
            })
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const nEntry = entry.nested.get(nestedKey)!

          nEntry.attrSets.push(nestedVal.attributes)
          if (nestedVal.where !== undefined) {
            nEntry.wheres.push(nestedVal.where)
          } else {
            nEntry.hasNoWhere = true
          }
        }
      }
    }
  }

  const result: Includeable[] = getIsMyCaseIncludes(user)

  for (const [assocKey, entry] of collected) {
    const schema = caseIncludeSchema[assocKey as keyof typeof caseIncludeSchema]
    if (!schema) continue

    const attributes = mergeAttrs(entry.attrSets)
    const cellWhere = mergeWhere(entry.hasNoWhere, entry.wheres)
    const mandatory =
      assocKey === 'defendants' ? defendantWhereOptions : undefined
    const where =
      mandatory && cellWhere
        ? { [Op.and]: [cellWhere, mandatory] }
        : mandatory ?? cellWhere

    const nestedIncludes: Includeable[] = []
    for (const [nestedKey, nEntry] of entry.nested) {
      const nestedSchema = (
        schema.includes as
          | Record<
              string,
              | { model: unknown; order?: unknown[]; separate?: boolean }
              | undefined
            >
          | undefined
      )?.[nestedKey]
      if (!nestedSchema) {
        continue
      }

      const nAttributes = mergeAttrs(nEntry.attrSets)
      const nWhere = mergeWhere(nEntry.hasNoWhere, nEntry.wheres)

      nestedIncludes.push({
        model: nestedSchema.model,
        ...(nestedSchema.order ? { order: nestedSchema.order } : {}),
        ...(nestedSchema.separate ? { separate: nestedSchema.separate } : {}),
        as: nestedKey,
        ...(nAttributes !== undefined ? { attributes: nAttributes } : {}),
        ...(nWhere !== undefined ? { where: nWhere } : {}),
      } as Includeable)
    }

    result.push({
      model: schema.model,
      ...(schema.order ? { order: schema.order } : {}),
      ...(schema.separate ? { separate: schema.separate } : {}),
      as: assocKey,
      ...(attributes !== undefined ? { attributes } : {}),
      ...(where !== undefined ? { where } : {}),
      ...(nestedIncludes.length > 0 ? { include: nestedIncludes } : {}),
    } as Includeable)
  }

  return result
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

    const defendantWhereOptions = caseTableDefendantWhereOptions[type]
    const include = getIncludes(caseTableCellKeys, user, defendantWhereOptions)

    const cases = await this.caseRepositoryService.findAll({
      attributes,
      include,
      where: caseTableWhereOptions[type](user),
    })

    const displayCases = caseTableDisplayCases[type](cases)

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
