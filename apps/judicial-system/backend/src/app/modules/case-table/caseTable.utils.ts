import { Includeable, Order } from 'sequelize'

import {
  AppealCaseState,
  CaseActionType,
  CaseState,
  CaseTableColumnKey,
  ContextMenuCaseActionType,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
  isRequestCase,
  type User,
} from '@island.is/judicial-system/types'

import { canWithdrawCaseLevelAppeal } from '../appeal-case/appealCase.helpers'
import { Case } from '../repository'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import {
  CaseIncludes,
  modelMap,
  subModelMap,
  withAccessIncludes,
} from './caseTable.types'
import { userAccessIncludes } from './caseTable.whereOptions'

const getIsMyCaseAttributes = (user: User): string[] => {
  if (isProsecutionUser(user)) {
    return ['creatingProsecutorId', 'prosecutorId', 'indictmentApproverId']
  }

  if (isDistrictCourtUser(user)) {
    return ['judgeId', 'registrarId']
  }

  return []
}

const getAvailableActionsAttributes = (user: User): string[] => {
  if (isProsecutionUser(user)) {
    return ['type', 'state']
  }

  if (isDistrictCourtUser(user)) {
    return ['type', 'state']
  }

  if (isDefenceUser(user)) {
    // defenderNationalId resolves the collective request-case appellant to the
    // case's current registered defender (see userIsAppellant); type selects
    // that request-case branch.
    return ['type', 'defenderNationalId']
  }

  return []
}

export const getAttributes = (
  caseTableCellKeys: CaseTableColumnKey[],
  user: User,
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

const getAvailableActionsIncludes = (user: User): CaseIncludes => {
  // Withdrawal eligibility is read from the case-level appeal's APPEALED event
  // log (userIsAppellant), matching the appeal-case withdrawal guard.
  if (isProsecutionUser(user)) {
    return {
      appealCase: {
        attributes: ['id', 'appealState'],
        includes: {
          appealEventLogs: { attributes: ['eventType', 'userRole'] },
        },
      },
    }
  }

  if (isDefenceUser(user)) {
    return {
      appealCase: {
        attributes: ['id', 'appealState'],
        includes: {
          appealEventLogs: {
            attributes: [
              'eventType',
              'userRole',
              'defendantId',
              'civilClaimantId',
            ],
          },
        },
      },
      // Needed to resolve a per-party (dismissed indictment) defence appellant to
      // the current confirmed defender / spokesperson.
      defendants: {
        attributes: ['id', 'isDefenderChoiceConfirmed', 'defenderNationalId'],
      },
      civilClaimants: {
        attributes: [
          'id',
          'hasSpokesperson',
          'isSpokespersonConfirmed',
          'spokespersonNationalId',
        ],
      },
    }
  }

  return {}
}

const mergeAttributes = <T>(target: T[], source: T[]) => {
  return [...new Set([...target, ...source])]
}

const setInclude = <K extends keyof CaseIncludes>(
  target: CaseIncludes,
  source: CaseIncludes,
  key: K,
) => {
  const sourceValue = source[key]
  if (!sourceValue) return

  const targetValue = target[key]
  if (!targetValue) {
    target[key] = sourceValue
    return
  }

  targetValue.attributes = mergeAttributes(
    targetValue.attributes,
    sourceValue.attributes,
  )

  if (!sourceValue.includes) {
    return
  }

  if (!targetValue.includes) {
    targetValue.includes = sourceValue.includes
    return
  }

  for (const nestedKey of Object.keys(sourceValue.includes) as Array<
    keyof NonNullable<typeof sourceValue.includes>
  >) {
    const nestedSource = sourceValue.includes[nestedKey]
    if (!nestedSource) continue

    const nestedTarget = targetValue.includes[nestedKey]
    if (!nestedTarget) {
      targetValue.includes[nestedKey] = nestedSource
      continue
    }

    nestedTarget.attributes = mergeAttributes(
      nestedTarget.attributes,
      nestedSource.attributes,
    )
  }
}

const getIncludeAndOrder = (
  allIncludes: CaseIncludes,
): [Includeable[], Order] => {
  const globalOrder: Order = []

  const include = Object.entries(allIncludes).map(([k, v]) => {
    const modelDef = modelMap[k as keyof typeof modelMap]
    const order =
      modelDef.separate && modelDef.order ? { ...modelDef.order } : undefined
    const include = v.includes
      ? {
          include: Object.entries(v.includes).map(([sk, sv]) => {
            const subModelDef = subModelMap[sk as keyof typeof subModelMap]
            const order =
              subModelDef.separate && subModelDef.order
                ? { ...subModelDef.order }
                : undefined

            if (!subModelDef.separate && subModelDef.order) {
              globalOrder.push([
                { model: modelDef.model, as: k },
                { model: subModelDef.model, as: sk },
                ...subModelDef.order[0],
              ])
            }

            return {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              attributes: mergeAttributes(['id'], sv!.attributes ?? []),
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              required: sv!.required,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              where: sv!.where,
              model: subModelDef.model,
              as: sk,
              separate: subModelDef.separate,
              ...order,
            }
          }),
        }
      : undefined

    if (!modelDef.separate && modelDef.order) {
      globalOrder.push([{ model: modelDef.model, as: k }, ...modelDef.order[0]])
    }

    return {
      attributes: mergeAttributes(['id'], v.attributes),
      required: v.required,
      where: v.where,
      model: modelDef.model,
      as: k,
      separate: modelDef.separate,
      ...order,
      ...include,
    } as Includeable
  })

  return [include, globalOrder]
}

// Every query built here joins whatever the user's access rule reads, on top of
// what the list asked for. Doing it in one place is the point: a list that had
// to request those joins itself could forget, and the rule would then compile
// into SQL that Postgres rejects outright.
const addAccessIncludes = (allIncludes: CaseIncludes, user: User) =>
  withAccessIncludes(userAccessIncludes(user), allIncludes) ?? allIncludes

/**
 * The joins a user's access rule needs, for a query that assembles its own
 * include list instead of going through getGlobalIncludes - searchCases is the
 * only one. Aliases the caller already joins are left alone, so the caller's
 * own version wins exactly as it does everywhere else.
 *
 * A caller that skips this gets SQL naming an alias it never joined, which
 * Postgres rejects outright: `missing FROM-clause entry`.
 */
export const getAccessIncludes = (
  user: User,
  joinedAliases: string[],
): Includeable[] => {
  const accessIncludes = withAccessIncludes(userAccessIncludes(user), {}) ?? {}

  for (const alias of joinedAliases) {
    delete accessIncludes[alias as keyof CaseIncludes]
  }

  const [include] = getIncludeAndOrder(accessIncludes)

  return include
}

export const getGlobalIncludes = (
  globalIncludes: CaseIncludes,
  user: User,
): [Includeable[], Order] => {
  const allIncludes: CaseIncludes = {}

  for (const m of Object.keys(globalIncludes) as Array<keyof CaseIncludes>) {
    setInclude(allIncludes, globalIncludes, m)
  }

  return getIncludeAndOrder(addAccessIncludes(allIncludes, user))
}

export const getAllIncludes = (
  globalIncludes: CaseIncludes,
  caseTableCellKeys: CaseTableColumnKey[],
  user: User,
): [Includeable[], Order] => {
  const allIncludes: CaseIncludes = {}

  for (const m of Object.keys(globalIncludes) as Array<keyof CaseIncludes>) {
    setInclude(allIncludes, globalIncludes, m)
  }

  const availableActionsIncludes = getAvailableActionsIncludes(user)

  for (const m of Object.keys(availableActionsIncludes) as Array<
    keyof CaseIncludes
  >) {
    setInclude(allIncludes, availableActionsIncludes, m)
  }

  for (const k of caseTableCellKeys) {
    if (!caseTableCellGenerators[k].includes) {
      continue
    }

    for (const m of Object.keys(caseTableCellGenerators[k].includes) as Array<
      keyof CaseIncludes
    >) {
      setInclude(allIncludes, caseTableCellGenerators[k].includes, m)
    }
  }

  return getIncludeAndOrder(addAccessIncludes(allIncludes, user))
}

export const isMyCase = (
  theCase: Pick<
    Case,
    | 'creatingProsecutorId'
    | 'prosecutorId'
    | 'indictmentApproverId'
    | 'judgeId'
    | 'registrarId'
  >,
  user: User,
): boolean => {
  if (isProsecutionUser(user)) {
    return (
      theCase.creatingProsecutorId === user.id ||
      theCase.prosecutorId === user.id ||
      theCase.indictmentApproverId === user.id
    )
  }

  if (isDistrictCourtUser(user)) {
    return theCase.judgeId === user.id || theCase.registrarId === user.id
  }

  return false
}

export const getActionOnRowClick = (
  theCase: Pick<Case, 'type' | 'state'>,
  user: User,
): CaseActionType => {
  if (
    isDistrictCourtUser(user) &&
    isIndictmentCase(theCase.type) &&
    theCase.state === CaseState.WAITING_FOR_CANCELLATION
  ) {
    return CaseActionType.COMPLETE_CANCELLED_CASE
  }

  if (isCourtOfAppealsUser(user)) {
    return CaseActionType.OPEN_APPEAL_CASE
  }

  return CaseActionType.OPEN_CASE
}

export const canDeleteRequestCase = (
  caseToDelete: Pick<Case, 'state'>,
): boolean => {
  return (
    caseToDelete.state === CaseState.NEW ||
    caseToDelete.state === CaseState.DRAFT ||
    caseToDelete.state === CaseState.SUBMITTED ||
    caseToDelete.state === CaseState.RECEIVED
  )
}

export const canDeleteIndictmentCase = (
  caseToDelete: Pick<Case, 'state'>,
): boolean => {
  return (
    caseToDelete.state === CaseState.DRAFT ||
    caseToDelete.state === CaseState.WAITING_FOR_REVIEW ||
    caseToDelete.state === CaseState.WAITING_FOR_CONFIRMATION
  )
}

export const canDeleteCase = (
  caseToDelete: Pick<Case, 'type' | 'state'>,
  user: User,
): boolean => {
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

// Mirrors the appeal-case module's withdrawal authorization
// (userAppealedAppealCase in appeal-case/guards/rolesRules.ts) for the appeals
// shown in the case tables. The tables' appealCase slot only ever holds the
// case-level appeal (request case and dismissed indictment appeals) -
// ruling-order appeals are withdrawn from the ruling order's context menu on the
// case screen instead. So it shares the guard's case-level eligibility check
// (canWithdrawCaseLevelAppeal): the appellant is read from the APPEALED event
// log, with request-case prosecution precedence.
export const canCancelAppeal = (
  theCase: Pick<
    Case,
    | 'type'
    | 'appealCase'
    | 'defenderNationalId'
    | 'defendants'
    | 'civilClaimants'
  >,
  user: User,
): boolean => {
  const appealCase = theCase.appealCase

  // An appeal can only be withdrawn before the court of appeals has ruled
  if (
    !appealCase ||
    (appealCase.appealState !== AppealCaseState.APPEALED &&
      appealCase.appealState !== AppealCaseState.RECEIVED)
  ) {
    return false
  }

  return canWithdrawCaseLevelAppeal(theCase, appealCase, user)
}

export const getContextMenuActions = (
  theCase: Pick<
    Case,
    | 'type'
    | 'state'
    | 'appealCase'
    | 'defenderNationalId'
    | 'defendants'
    | 'civilClaimants'
  >,
  user: User,
): ContextMenuCaseActionType[] => {
  if (
    isDistrictCourtUser(user) &&
    isIndictmentCase(theCase.type) &&
    theCase.state === CaseState.WAITING_FOR_CANCELLATION
  ) {
    return []
  }

  const actions = [
    isCourtOfAppealsUser(user)
      ? ContextMenuCaseActionType.OPEN_APPEAL_CASE_IN_NEW_TAB
      : ContextMenuCaseActionType.OPEN_CASE_IN_NEW_TAB,
  ]

  if (canDeleteCase(theCase, user)) {
    actions.push(ContextMenuCaseActionType.DELETE_CASE)
  }

  if (canCancelAppeal(theCase, user)) {
    actions.push(ContextMenuCaseActionType.WITHDRAW_APPEAL)
  }

  return actions
}
