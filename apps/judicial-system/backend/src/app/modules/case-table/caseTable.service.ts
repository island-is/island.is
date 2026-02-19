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
  IndictmentCaseReviewDecision,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
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
      const match = this.getMatch(c, query)

      const caseType =
        c.type === CaseType.CUSTODY &&
        c.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
          ? CaseType.TRAVEL_BAN
          : c.type

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

    return {
      rowCount: rows.length,
      rows,
    }
  }

  private getMatch(
    theCase: Case,
    query: string,
  ): { field: string; value: string } {
    const lowerQuery = query.toLowerCase()

    const matchingPoliceCaseNumber = theCase.policeCaseNumbers?.find((pcn) =>
      pcn.toLowerCase().includes(lowerQuery),
    )

    if (matchingPoliceCaseNumber) {
      return { field: 'policeCaseNumbers', value: matchingPoliceCaseNumber }
    }

    if (theCase.courtCaseNumber?.toLowerCase().includes(lowerQuery)) {
      return { field: 'courtCaseNumber', value: theCase.courtCaseNumber }
    }

    if (theCase.appealCaseNumber?.toLowerCase().includes(lowerQuery)) {
      return { field: 'appealCaseNumber', value: theCase.appealCaseNumber }
    }

    for (const d of theCase.defendants ?? []) {
      if (d.nationalId?.toLowerCase().includes(lowerQuery)) {
        return { field: 'defendantNationalId', value: d.nationalId }
      }
    }

    for (const d of theCase.defendants ?? []) {
      if (d.name?.toLowerCase().includes(lowerQuery)) {
        return { field: 'defendantName', value: d.name }
      }
    }

    return {
      field: 'policeCaseNumbers',
      value: theCase.policeCaseNumbers?.[0] ?? '',
    }
  }
}
