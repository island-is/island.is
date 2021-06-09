import {
  DataProviderItem,
  ExternalData,
  FieldTypes,
  FormItemTypes,
  FormValue,
  SubmitField,
} from '@island.is/application/core'
import { FormScreen } from './types'
import pick from 'lodash/pick'

export function verifyExternalData(
  externalData: ExternalData,
  dataProviders: DataProviderItem[],
): boolean {
  for (let i = 0; i < dataProviders.length; i++) {
    const { id } = dataProviders[i]
    const dataProviderResult = externalData[id]
    if (!dataProviderResult || dataProviderResult.status === 'failure') {
      return false
    }
  }
  return true
}

export function findSubmitField(screen: FormScreen): SubmitField | undefined {
  if (screen.type === FieldTypes.SUBMIT) {
    return screen
  }
  if (screen.type === FormItemTypes.MULTI_FIELD) {
    const reviewScreen = screen.children.find(
      (child) => child.type === FieldTypes.SUBMIT,
    )
    if (reviewScreen !== undefined) {
      return reviewScreen as SubmitField
    }
  }
  return undefined
}

export function extractAnswersToSubmitFromScreen(
  data: FormValue,
  screen: FormScreen,
  newData?: FormValue,
): FormValue {
  const screenId = screen.id ?? ''
  console.log('-screenId', screenId)

  if (
    screen.isPartOfRepeater ||
    (screenId.includes('[') && screenId.includes(']'))
  ) {
    const baseId =
      screen.type === FormItemTypes.MULTI_FIELD
        ? screen.children[0].id
        : screenId

    // We always submit the whole array for the repeater answers
    const repeaterId = baseId.split('[')[0] ?? ''

    return pick(data, [repeaterId])
  }

  console.log('-screen.type', screen.type)

  switch (screen.type) {
    case FormItemTypes.MULTI_FIELD:
      return pick(
        data,
        screen.children.map((c) => c.id),
      )

    case FormItemTypes.EXTERNAL_DATA_PROVIDER:
    case FormItemTypes.REPEATER:
      return {}

    case FieldTypes.CUSTOM:
      if (screen.childInputIds && screen.childInputIds.length > 1) {
        return pick(
          data,
          screen.childInputIds.map((id) => id),
        )
      }

      if (newData) {
        console.log('-yo', Object.keys(newData))

        const externalFields =
          Object.keys(newData).find((field) => field !== screenId) ?? ''
        console.log('-externalFields', externalFields)

        console.log('-data', data)
        console.log('-newData', newData)
        console.log('-screenId', screenId)

        return pick(data, [screenId, externalFields])
      }

      return pick(data, [screenId])

    default:
      return pick(data, [screenId])
  }
}

export const isJSONObject = (message?: string): boolean => {
  if (!message) {
    return false
  }

  try {
    JSON.parse(message)
    return true
  } catch {
    return false
  }
}

export function parseMessage(message?: string) {
  if (!message) {
    return undefined
  }

  if (isJSONObject(message)) {
    return JSON.parse(message)
  }

  return message
}
