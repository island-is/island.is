import { Includeable, literal, Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import {
  CaseActionType,
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseTableColumnKey,
  caseTables,
  CaseTableType,
  CaseType,
  ContextMenuCaseActionType,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
  isRequestCase,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { Case, CaseRepositoryService, Defendant, User } from '../repository'
import { CaseTableResponse } from './dto/caseTable.response'
import { SearchCasesResponse } from './dto/searchCases.response'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import {
  caseTableWhereOptions,
  userAccessWhereOptions,
} from './caseTable.whereOptions'

type SearchResult = {
  count: number
  rows: {
    id: string
    type: CaseType
    decision: CaseDecision
    policeCaseNumbers: string[]
    courtCaseNumber: string | null
    appealCaseNumber: string | null
    defendantNationalId: string | null
    defendantName: string | null
    match: {
      field:
        | 'policeCaseNumbers'
        | 'courtCaseNumber'
        | 'appealCaseNumber'
        | 'defendantNationalId'
        | 'defendantName'
      value: string
    }
  }[]
}

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

const isMyCase = (theCase: Case, user: TUser): boolean => {
  if (isProsecutionUser(user)) {
    return (
      theCase.creatingProsecutorId === user.id ||
      theCase.prosecutorId === user.id
    )
  }

  if (isDistrictCourtUser(user)) {
    return theCase.judge?.id === user.id || theCase.registrar?.id === user.id
  }

  return false
}

const getActionOnRowClick = (theCase: Case, user: TUser): CaseActionType => {
  if (
    isDistrictCourtUser(user) &&
    isIndictmentCase(theCase.type) &&
    theCase.state === CaseState.WAITING_FOR_CANCELLATION
  ) {
    return CaseActionType.COMPLETE_CANCELLED_CASE
  }

  return CaseActionType.OPEN_CASE
}

const canDeleteRequestCase = (caseToDelete: Case): boolean => {
  return (
    caseToDelete.state === CaseState.NEW ||
    caseToDelete.state === CaseState.DRAFT ||
    caseToDelete.state === CaseState.SUBMITTED ||
    caseToDelete.state === CaseState.RECEIVED
  )
}

const canDeleteIndictmentCase = (caseToDelete: Case): boolean => {
  return (
    caseToDelete.state === CaseState.DRAFT ||
    caseToDelete.state === CaseState.WAITING_FOR_CONFIRMATION
  )
}

const canDeleteCase = (caseToDelete: Case, user: TUser): boolean => {
  if (!isProsecutionUser(user)) {
    return false
  }

  if (isRequestCase(caseToDelete.type)) {
    return canDeleteRequestCase(caseToDelete)
  }

  if (isIndictmentCase(caseToDelete.type)) {
    return canDeleteIndictmentCase(caseToDelete)
  }

  return false
}

const canCancelAppeal = (theCase: Case, user: TUser): boolean => {
  if (!isProsecutionUser(user) || !isRequestCase(theCase.type)) {
    return false
  }

  if (
    (theCase.appealState === CaseAppealState.APPEALED ||
      theCase.appealState === CaseAppealState.RECEIVED) &&
    theCase.prosecutorPostponedAppealDate
  ) {
    return true
  }

  return false
}

const getContextMenuActions = (
  theCase: Case,
  user: TUser,
): ContextMenuCaseActionType[] => {
  if (
    isDistrictCourtUser(user) &&
    isIndictmentCase(theCase.type) &&
    theCase.state === CaseState.WAITING_FOR_CANCELLATION
  ) {
    return []
  }

  const actions = [ContextMenuCaseActionType.OPEN_CASE_IN_NEW_TAB]

  if (canDeleteCase(theCase, user)) {
    actions.push(ContextMenuCaseActionType.DELETE_CASE)
  }

  if (canCancelAppeal(theCase, user)) {
    actions.push(ContextMenuCaseActionType.WITHDRAW_APPEAL)
  }

  return actions
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

    return {
      rowCount: cases.length,
      rows: cases.map((c) => ({
        caseId: c.id,
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

    const results = await this.caseRepositoryService.findAndCountAll({
      attributes: [
        'id',
        'type',
        'decision',
        'policeCaseNumbers',
        'courtCaseNumber',
        'appealCaseNumber',
        [
          literal(`
            (
              SELECT d."national_id"
              FROM "defendant" d
              WHERE d."case_id" = "Case"."id"
              ORDER BY
                (d."name" ILIKE ${safeQuery} OR d."national_id" ILIKE ${safeQuery}) DESC,
                d."created" ASC
              LIMIT 1
            )
          `),
          'defendantNationalId',
        ],
        [
          literal(`
            (
              SELECT d."name"
              FROM "defendant" d
              WHERE d."case_id" = "Case"."id"
              ORDER BY
                (d."name" ILIKE ${safeQuery} OR d."national_id" ILIKE ${safeQuery}) DESC,
                d."created" ASC
              LIMIT 1
            )
          `),
          'defendantName',
        ],
        [
          literal(`
            (
              SELECT json_build_object(
                'value', match,
                'field', match_source
              )
              FROM LATERAL (
                SELECT unnest("Case"."police_case_numbers") AS match, 'policeCaseNumbers' AS match_source
                UNION ALL
                SELECT "Case"."court_case_number", 'courtCaseNumber'
                WHERE "Case"."court_case_number" ILIKE ${safeQuery}
                UNION ALL
                SELECT "Case"."appeal_case_number", 'appealCaseNumber'
                WHERE "Case"."appeal_case_number" ILIKE ${safeQuery}
                UNION ALL
                SELECT d."national_id", 'defendantNationalId'
                FROM "defendant" d
                WHERE d."case_id" = "Case"."id"
                  AND d."national_id" ILIKE ${safeQuery}
                UNION ALL
                SELECT d."name", 'defendantName'
                FROM "defendant" d
                WHERE d."case_id" = "Case"."id"
                  AND d."name" ILIKE ${safeQuery}
              ) AS matches
              WHERE match ILIKE ${safeQuery}
              LIMIT 1
            )
          `),
          'match',
        ],
      ],
      include: [
        {
          model: Defendant,
          attributes: ['nationalId', 'name'],
          as: 'defendants',
          required: true,
          duplicating: false,
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
              // Op.iLike makes it safe to use the original query string
              { court_case_number: { [Op.iLike]: `%${query}%` } },
              { appeal_case_number: { [Op.iLike]: `%${query}%` } },
              { '$defendants.name$': { [Op.iLike]: `%${query}%` } },
              { '$defendants.national_id$': { [Op.iLike]: `%${query}%` } },
            ],
          },
        ],
      },
      order: [['id', 'ASC']],
      limit: 10,
      raw: true,
    })

    const { count, rows } = results as unknown as SearchResult

    return {
      rowCount: count,
      rows: rows.map((r) => ({
        caseId: r.id,
        caseType:
          r.type === CaseType.CUSTODY &&
          r.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
            ? CaseType.TRAVEL_BAN
            : r.type,
        matchedField: r.match.field,
        matchedValue: r.match.value,
        policeCaseNumbers: r.policeCaseNumbers,
        courtCaseNumber: r.courtCaseNumber,
        appealCaseNumber: r.appealCaseNumber,
        defendantNationalId: r.defendantNationalId,
        defendantName: r.defendantName,
      })),
    }
  }
}
