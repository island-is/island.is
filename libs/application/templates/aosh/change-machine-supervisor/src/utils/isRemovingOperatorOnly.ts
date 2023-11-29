import { getValueViaPath } from '@island.is/application/core'
import { ApplicationContext } from '@island.is/application/types'
import {
  OperatorInformation,
  UserInformation,
  OldOperatorInformation,
} from '../shared'

// If you are only removing operator and there are no coowners, you can just submit
// the application right away.
export const isRemovingOperatorOnly = (context: ApplicationContext) => {
  const { answers } = context.application
  const ownerCoOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]
  if (ownerCoOwners.length > 0) return false

  const operators = getValueViaPath(
    answers,
    'operators',
    [],
  ) as OperatorInformation[]
  if (operators.filter(({ wasRemoved }) => wasRemoved !== 'true').length > 0)
    return false

  const oldOperators = getValueViaPath(
    answers,
    'oldOperators',
    [],
  ) as OldOperatorInformation[]

  const isBeingRemoved = oldOperators.find(
    (operator) => operator.wasRemoved === 'true',
  )
  if (isBeingRemoved) return true
  return false
}
