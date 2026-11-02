import { Includeable, Order, OrderItem } from 'sequelize'

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
  AnyModelDef,
  CaseIncludes,
  CaseTableRowCase,
  copyIncludeInto,
  copyIncludeNode,
  IncludeTree,
  IncludeTreeNode,
  mergeAccessIncludes,
  modelMapsByDepth,
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
    // type selects the request-case vs indictment branch of userIsAppellant;
    // defendant defenderNationalId is loaded via includes below.
    return ['type']
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
      // Needed to resolve defence appellants: request-case collective defenders
      // and per-party (dismissed indictment) confirmed defenders / spokespersons.
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

// Merges one node of an include declaration into another, attributes and
// nested associations alike, at any depth.
const mergeIncludeNode = (target: IncludeTreeNode, source: IncludeTreeNode) => {
  target.attributes = mergeAttributes(target.attributes, source.attributes)

  if (!source.includes) {
    return
  }

  if (!target.includes) {
    target.includes = {}
  }

  for (const [key, nestedSource] of Object.entries(source.includes)) {
    if (!nestedSource) {
      continue
    }

    const nestedTarget = target.includes[key]

    if (!nestedTarget) {
      target.includes[key] = copyIncludeNode(nestedSource)
      continue
    }

    mergeIncludeNode(nestedTarget, nestedSource)
  }
}

// Merges one association's include into the tree being built for a query.
//
// Every value that enters the tree is copied first (see copyIncludeInto): the
// cell generators are module level constants, and the merges below write into
// whatever object they are handed. Aliasing one in would leave another list's
// attributes and joins on the generator afterwards.
const setInclude = <K extends keyof CaseIncludes>(
  target: CaseIncludes,
  source: CaseIncludes,
  key: K,
) => {
  const sourceValue = source[key]
  if (!sourceValue) return

  const targetValue = target[key]
  if (!targetValue) {
    copyIncludeInto(target, source, key)
    return
  }

  mergeIncludeNode(
    targetValue as IncludeTreeNode,
    sourceValue as IncludeTreeNode,
  )
}

type OrderPath = { model: AnyModelDef['model']; as: string }[]

// Builds the Sequelize includes for one level of a declaration and recurses
// into the next, looking each alias up in the model map for its depth.
const buildIncludes = (
  tree: IncludeTree,
  depth: number,
  parents: OrderPath,
  globalOrder: OrderItem[],
): Includeable[] =>
  Object.entries(tree).flatMap(([as, node]) => {
    if (!node) {
      return []
    }

    const modelDef = modelMapsByDepth[depth]?.[as]

    if (!modelDef) {
      throw new Error(
        `No model definition for the association ${[
          ...parents.map((parent) => parent.as),
          as,
        ].join('.')} of a case table include`,
      )
    }

    const path: OrderPath = [...parents, { model: modelDef.model, as }]

    // Named, not spread. `order` is an array, so spreading it would put the
    // term under "0" and Sequelize would ignore the include's ordering without
    // saying so.
    const order =
      modelDef.separate && modelDef.order
        ? { order: modelDef.order }
        : undefined

    if (!modelDef.separate && modelDef.order) {
      globalOrder.push([...path, ...modelDef.order[0]] as OrderItem)
    }

    const include = node.includes
      ? { include: buildIncludes(node.includes, depth + 1, path, globalOrder) }
      : undefined

    return [
      {
        attributes: mergeAttributes(['id'], node.attributes),
        required: node.required,
        where: node.where,
        model: modelDef.model,
        as,
        separate: modelDef.separate,
        ...order,
        ...include,
      } as Includeable,
    ]
  })

const getIncludeAndOrder = (
  allIncludes: CaseIncludes,
): [Includeable[], Order] => {
  const globalOrder: OrderItem[] = []
  const include = buildIncludes(allIncludes as IncludeTree, 0, [], globalOrder)

  return [include, globalOrder]
}

// Every query built here joins whatever the user's access rule reads, on top of
// what the list asked for. Doing it in one place is the point: a list that had
// to request those joins itself could forget, and the rule would then compile
// into SQL that Postgres rejects outright.
const addAccessIncludes = (allIncludes: CaseIncludes, user: User) =>
  mergeAccessIncludes(userAccessIncludes(user), allIncludes) ?? allIncludes

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
  joinedAliases: Array<keyof CaseIncludes>,
): Includeable[] => {
  const accessIncludes = mergeAccessIncludes(userAccessIncludes(user), {}) ?? {}

  // Typed rather than loose strings: an alias that does not match deletes
  // nothing, and the query then carries the same `as` twice, which Postgres
  // rejects with `table name specified more than once` - the same runtime only
  // failure this whole change exists to remove.
  for (const alias of joinedAliases) {
    delete accessIncludes[alias]
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
// shown in the case tables. The row's appeal slot only ever holds the
// case-level appeal (request case and dismissed indictment appeals) -
// ruling-order appeals are withdrawn from the ruling order's context menu on the
// case screen instead. So it shares the guard's case-level eligibility check
// (canWithdrawCaseLevelAppeal): the appellant is read from the APPEALED event
// log, with request-case prosecution precedence.
export const canCancelAppeal = (
  theCase: Pick<
    CaseTableRowCase,
    'type' | 'appeal' | 'defendants' | 'civilClaimants'
  >,
  user: User,
): boolean => {
  const appealCase = theCase.appeal

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
    CaseTableRowCase,
    'type' | 'state' | 'appeal' | 'defendants' | 'civilClaimants'
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
