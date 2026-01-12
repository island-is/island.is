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
  ApplicationStatus,
  ApplicationTemplate,
  ApplicationTypes,
} from '@island.is/application/types'
import { Unwrap } from '@island.is/shared/types'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import isObject from 'lodash/isObject'
import { EventObject } from 'xstate'
import { FormatMessage } from '@island.is/cms-translations'
import { ApplicationStatistics } from '../dto/applicationAdmin.response.dto'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { expandFieldKeys } from '../lifecycle/application-lifecycle.utils'
import { IdentityClientService } from '@island.is/clients/identity'

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

type Template = ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<EventObject>,
  EventObject
>

export const getApplicationNameTranslationString = (
  template: Template,
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

export const getApplicationStatisticsNameTranslationString = (
  template: Template,
  model: ApplicationStatistics,
  formatMessage: FormatMessage,
) => {
  if (typeof template.name === 'function') {
    const returnValue = template.name(
      mockApplicationFromTypeId(model.typeid as ApplicationTypes),
    )

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

export const getApplicationGenericNameTranslationString = (
  template: Template,
  formatMessage: FormatMessage,
) => {
  if (typeof template.name === 'function') {
    const returnValue = template.name(mockApplicationFromTypeId(template.type))

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

export const mockApplicationFromTypeId = (
  typeId: ApplicationTypes,
): Application => {
  return {
    id: '',
    state: ApplicationState.INPROGRESS,
    applicant: '',
    assignees: [],
    applicantActors: [],
    typeId,
    modified: new Date(),
    created: new Date(),
    answers: {},
    externalData: {},
    status: ApplicationStatus.IN_PROGRESS,
  }
}

type RecordType = Record<string, unknown>

const MAX_DEPTH = 100

export const removeObjectWithKeyFromAnswers = (
  answers: object,
  keyToRemove: string,
  depth = 0,
): object => {
  if (depth >= MAX_DEPTH) {
    console.warn(
      'Maximum recursion depth reached while calling removeObjectWithKeyFromAnswers',
    )
    return answers
  }
  // Handle arrays
  if (Array.isArray(answers)) {
    return cleanArray(answers, keyToRemove, depth)
  }

  // Handle objects
  if (isValidObject(answers)) {
    return cleanObject(answers, keyToRemove, depth)
  }

  return answers
}

const cleanArray = (
  array: unknown[],
  keyToRemove: string,
  depth: number,
): unknown[] => {
  const filteredArray = array.filter((item) => {
    if (isValidObject(item)) {
      return !containsKey(item, keyToRemove)
    }
    return item !== keyToRemove
  })

  return filteredArray.map((item) => {
    if (isObject(item)) {
      return removeObjectWithKeyFromAnswers(item, keyToRemove, depth + 1)
    }
    return item
  })
}

const cleanObject = (
  obj: object,
  keyToRemove: string,
  depth: number,
): RecordType => {
  return Object.entries(obj).reduce<RecordType>((acc, [field, value]) => {
    if (isValidObject(value)) {
      if (!Array.isArray(value) && containsKey(value, keyToRemove)) {
        return acc
      }

      const cleanedValue = removeObjectWithKeyFromAnswers(
        value,
        keyToRemove,
        depth + 1,
      )

      // For arrays or objects with content, keep them
      if (hasContent(cleanedValue)) {
        acc[field] = cleanedValue
      }
      // Special case: keep empty arrays
      else if (Array.isArray(value)) {
        acc[field] = cleanedValue
      }
      return acc
    }

    // Handle primitive values
    if (value !== keyToRemove) {
      acc[field] = value
    }
    return acc
  }, {})
}

const isValidObject = (value: unknown): value is object => {
  return value !== null && typeof value === 'object'
}

const containsKey = (obj: object, key: string): boolean => {
  return Object.values(obj).includes(key)
}

const hasContent = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0
  }
  if (isValidObject(value)) {
    return Object.keys(value).length > 0
  }
  return false
}

/**
 * Collects and formats admin-visible data from an application for the admin portal.
 *
 * - Expands keys with `$` wildcards (e.g. `coOwners.$.name`) into explicit paths.
 * - Gathers all values for each key (single or multiple, depending on wildcard).
 * - Keeps the original `key` with the `$` placeholder intact for readability in config.
 * - Returns values as a string array (`value`), even for single-value fields.
 *
 * Example 1:
 *   config = { key: 'coOwners.$.name' }
 *   answers = { coOwners: [{ name: 'Alice' }, { name: 'Bob' }] }
 *
 *   result = {
 *     key: 'coOwners.$.name',
 *     values: ['Alice', 'Bob'],
 *     label: 'Co-owner Name'
 *   }
 *
 * Example 2 (with nationalId):
 *   config = { key: 'coOwners.$.nationalId', isNationalId = true }
 *   answers = { coOwners: [{ nationalId: '1234567890' }] }
 *
 *   result = {
 *     key: 'coOwners.$.nationalId',
 *     values: ['Alice (1234567890)'],
 *     label: 'Co-owner'
 *   }
 */
export const getAdminDataForAdminPortal = async (
  template: Template,
  application: Application,
  formatMessage: FormatMessage,
  identityService: IdentityClientService,
): Promise<Array<{ key: string; values: string[]; label: string }>> => {
  if (!template.adminDataConfig?.answers) return []

  // Simple per-request memoization to reduce duplicate NR calls
  const nationalIdMap = new Map<string, string>()
  const resolveWithNationalIdMap = async (
    nationalId: string,
  ): Promise<string> => {
    const valueFromMap = nationalIdMap.get(nationalId)
    if (valueFromMap) return valueFromMap
    const valueFromApi =
      (await identityService.tryToGetNameFromNationalId(nationalId, true)) ??
      nationalId
    nationalIdMap.set(nationalId, valueFromApi)
    return valueFromApi
  }

  return Promise.all(
    template.adminDataConfig.answers
      .filter((config) => config.isListed)
      .map(async (config) => {
        let expandedKeys: string[] = []
        try {
          expandedKeys = expandFieldKeys(application.answers, [config.key])
        } catch {
          expandedKeys = []
        }

        let values: string[] = expandedKeys
          .map((expandedKey) =>
            getValueViaPath(application.answers, expandedKey),
          )
          .flatMap((v) => {
            if (v === undefined || v === null) return []
            if (Array.isArray(v)) return v.filter((x) => x != null).map(String)
            if (typeof v === 'object') return []
            return [String(v)]
          })

        // If this field contains national IDs, fetch names and format them
        if (config.isNationalId) {
          values = await Promise.all(
            values.map((nationalId) => resolveWithNationalIdMap(nationalId)),
          )
        }

        const label = config.label ? formatMessage(config.label) : ''

        return {
          key: config.key,
          values,
          label,
        }
      }),
  )
}
