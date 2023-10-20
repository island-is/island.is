import addMilliseconds from 'date-fns/addMilliseconds'

import {
  DefaultStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ApplicationLifecycle,
  ApplicationStateSchema,
  ApplicationTemplate,
} from '@island.is/application/types'
import isObject from 'lodash/isObject'
import { EventObject } from 'xstate'
import { FormatMessage } from '@island.is/cms-translations'

export const getApplicationLifecycle = (
  application: Application,
  template: ApplicationTemplate<
    ApplicationContext,
    ApplicationStateSchema<EventObject>,
    EventObject
  >,
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

export const getApplicationNameTranslationString = (
  template: ApplicationTemplate<
    ApplicationContext,
    ApplicationStateSchema<EventObject>,
    EventObject
  >,
  application: Application,
  formatMessage: FormatMessage,
) => {
  if (typeof template.name === 'function') {
    const returnValue = template.name(application)
    if (
      isObject(returnValue) &&
      'value' in returnValue &&
      'name' in returnValue
    ) {
      return formatMessage(returnValue.name, {
        value: returnValue.value,
      })
    }
    return formatMessage(returnValue)
  }
  return formatMessage(template.name)
}

export const getPaymentStatusForAdmin = (
  payment: { fulfilled: boolean; created: Date } | null,
) => {
  if (payment?.fulfilled) {
    return 'paid'
  }
  if (payment?.created) {
    return 'unpaid'
  }
  return null
}

export const getApplicantName = (application: Application) => {
  if (application.externalData.nationalRegistry) {
    return getValueViaPath(
      application.externalData,
      'nationalRegistry.data.fullName',
    )
  }
  if (application.externalData.identity) {
    return getValueViaPath(application.externalData, 'identity.data.name')
  }
  // special case for parental leave
  if (application.externalData.person) {
    return getValueViaPath(application.externalData, 'person.data.fullname')
  }
  return null
}
