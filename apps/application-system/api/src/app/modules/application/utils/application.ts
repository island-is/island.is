import addMilliseconds from 'date-fns/addMilliseconds'

import { DefaultStateLifeCycle } from '@island.is/application/core'
import { Application, ApplicationLifecycle } from '@island.is/application/types'
import { Unwrap } from '@island.is/shared/types'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'

export const getApplicationLifecycle = (
  application: Application,
  template: Unwrap<typeof getApplicationTemplateByTypeId>,
): ApplicationLifecycle => {
  const stateConfig = template.stateMachineConfig.states[application.state]

  if (stateConfig.meta === undefined) {
    return {
      isListed: DefaultStateLifeCycle.shouldBeListed,
      pruneAt: null,
    }
  }

  const { lifecycle } = stateConfig.meta
  const { shouldBeListed } = lifecycle

  if (!lifecycle.shouldBePruned) {
    return {
      isListed: shouldBeListed,
      pruneAt: null,
    }
  }

  const { whenToPrune } = lifecycle

  const pruneAt =
    typeof whenToPrune === 'function'
      ? whenToPrune(application)
      : addMilliseconds(new Date(), whenToPrune)

  return {
    isListed: shouldBeListed,
    pruneAt,
  }
}
