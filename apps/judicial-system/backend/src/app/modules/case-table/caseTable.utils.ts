import { Includeable, Order } from 'sequelize'

import {
  CaseActionType,
  CaseAppealState,
  CaseState,
  CaseTableColumnKey,
  ContextMenuCaseActionType,
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

  return []
}

const getAvailableActionsAttributes = (user: User): string[] => {
  if (isProsecutionUser(user)) {
    return ['type', 'state', 'appealState', 'prosecutorPostponedAppealDate']
  }

  if (isDistrictCourtUser(user)) {
    return ['type', 'state']
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

const getIsMyCaseIncludes = (user: User): CaseIncludes => {
  if (isDistrictCourtUser(user)) {
    return { judge: { attributes: ['id'] }, registrar: { attributes: ['id'] } }
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

export const getIncludes = (
  globalIncludes: CaseIncludes,
  caseTableCellKeys: CaseTableColumnKey[],
  user: User,
): [Includeable[], Order] => {
  const allIncludes: CaseIncludes = {}
  const globalOrder: Order = []

  for (const m of Object.keys(globalIncludes) as Array<keyof CaseIncludes>) {
    setInclude(allIncludes, globalIncludes, m)
  }

  const isMyCaseIncludes = getIsMyCaseIncludes(user)

  for (const m of Object.keys(isMyCaseIncludes) as Array<keyof CaseIncludes>) {
    setInclude(allIncludes, isMyCaseIncludes, m)
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
              attributes: sv!.attributes ?? [],
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
      attributes: v.attributes,
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

export const isMyCase = (
  theCase: Pick<
    Case,
    'creatingProsecutorId' | 'prosecutorId' | 'judge' | 'registrar'
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
    return theCase.judge?.id === user.id || theCase.registrar?.id === user.id
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

export const canCancelAppeal = (
  theCase: Pick<Case, 'type' | 'appealState' | 'prosecutorPostponedAppealDate'>,
  user: User,
): boolean => {
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

export const getContextMenuActions = (
  theCase: Pick<
    Case,
    'type' | 'state' | 'appealState' | 'prosecutorPostponedAppealDate'
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

  const actions = [ContextMenuCaseActionType.OPEN_CASE_IN_NEW_TAB]

  if (canDeleteCase(theCase, user)) {
    actions.push(ContextMenuCaseActionType.DELETE_CASE)
  }

  if (canCancelAppeal(theCase, user)) {
    actions.push(ContextMenuCaseActionType.WITHDRAW_APPEAL)
  }

  return actions
}
