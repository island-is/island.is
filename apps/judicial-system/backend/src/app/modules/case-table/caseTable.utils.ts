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

import { Case } from '../repository'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import { CaseIncludes, modelMap, subModelMap } from './caseTable.types'

const getIsMyCaseAttributes = (user: User): string[] => {
  if (isProsecutionUser(user)) {
    return ['creatingProsecutorId', 'prosecutorId']
  }

  if (isDistrictCourtUser(user)) {
    return ['judgeId', 'registrarId']
  }

  return []
}

const getAvailableActionsAttributes = (user: User): string[] => {
  if (isProsecutionUser(user)) {
    return ['type', 'state', 'prosecutorPostponedAppealDate']
  }

  if (isDistrictCourtUser(user)) {
    return ['type', 'state']
  }

  if (isDefenceUser(user)) {
    // prosecutorPostponedAppealDate is needed to deny the defence withdrawal
    // of a shared request case appeal the prosecution is also a party to
    return [
      'type',
      'accusedPostponedAppealDate',
      'prosecutorPostponedAppealDate',
      'defenderNationalId',
    ]
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
  if (isProsecutionUser(user)) {
    return { appealCase: { attributes: ['id', 'appealState'] } }
  }

  if (isDefenceUser(user)) {
    return {
      appealCase: {
        attributes: ['id', 'appealState', 'appealedByNationalId'],
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

export const getGlobalIncludes = (
  globalIncludes: CaseIncludes,
): [Includeable[], Order] => {
  const allIncludes: CaseIncludes = {}

  for (const m of Object.keys(globalIncludes) as Array<keyof CaseIncludes>) {
    setInclude(allIncludes, globalIncludes, m)
  }

  return getIncludeAndOrder(allIncludes)
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

  return getIncludeAndOrder(allIncludes)
}

export const isMyCase = (
  theCase: Pick<
    Case,
    'creatingProsecutorId' | 'prosecutorId' | 'judgeId' | 'registrarId'
  >,
  user: User,
): boolean => {
  if (isProsecutionUser(user)) {
    return (
      theCase.creatingProsecutorId === user.id ||
      theCase.prosecutorId === user.id
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

// Mirrors the appeal-case module's withdrawal authorization (see
// prosecutionAppealedAppealCase and defenderAppealedAppealCase in
// appeal-case/guards/rolesRules.ts) for the appeals shown in the case tables.
// The tables' appealCase slot only ever holds the case-level appeal (request
// case and dismissed indictment appeals) - ruling-order appeals are withdrawn
// from the ruling order's context menu on the case screen instead.
export const canCancelAppeal = (
  theCase: Pick<
    Case,
    | 'type'
    | 'appealCase'
    | 'prosecutorPostponedAppealDate'
    | 'accusedPostponedAppealDate'
    | 'defenderNationalId'
  >,
  user: User,
): boolean => {
  // An appeal can only be withdrawn before the court of appeals has ruled
  if (
    theCase.appealCase?.appealState !== AppealCaseState.APPEALED &&
    theCase.appealCase?.appealState !== AppealCaseState.RECEIVED
  ) {
    return false
  }

  if (isProsecutionUser(user)) {
    // The prosecution appealed iff the postponed appeal date was set on the case
    return Boolean(theCase.prosecutorPostponedAppealDate)
  }

  if (isDefenceUser(user) && user.nationalId) {
    // The defence appealed iff the postponed appeal date was set on the case
    if (!theCase.accusedPostponedAppealDate) {
      return false
    }

    // Request cases are also listed for victims' lawyers, so only the
    // assigned defender gets to withdraw the collective defence appeal.
    // The prosecution's appeal takes precedence, so the defence cannot
    // withdraw the shared appeal if the prosecution also appealed.
    if (isRequestCase(theCase.type)) {
      return (
        !theCase.prosecutorPostponedAppealDate &&
        theCase.defenderNationalId === user.nationalId
      )
    }

    // For dismissed indictment appeals, only the defender who appealed
    // (recorded on the appeal case) can withdraw
    return theCase.appealCase?.appealedByNationalId === user.nationalId
  }

  return false
}

export const getContextMenuActions = (
  theCase: Pick<
    Case,
    | 'type'
    | 'state'
    | 'appealCase'
    | 'prosecutorPostponedAppealDate'
    | 'accusedPostponedAppealDate'
    | 'defenderNationalId'
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
