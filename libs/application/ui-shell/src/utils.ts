import { buildSubmitField, getValueViaPath } from '@island.is/application/core'
import {
  DataProviderItem,
  ExternalData,
  FieldTypes,
  FormItemTypes,
  FormValue,
  RecordObject,
  SubmitField,
} from '@island.is/application/types'
import { FormScreen } from './types'
import pick from 'lodash/pick'
import get from 'lodash/get'

export function verifyExternalData(
  externalData: ExternalData,
  dataProviders: DataProviderItem[],
): boolean {
  for (let i = 0; i < dataProviders.length; i++) {
    const { id } = dataProviders[i]
    const dataProviderResult = externalData[id]
    console.log(dataProviderResult)
    console.log('id', id)
    if (!dataProviderResult || dataProviderResult.status === 'failure') {
      console.log('verifyExternalData', id, dataProviderResult)
      return false
    }
  }

  return true
}

export function answerIsMissing(answer: unknown) {
  return answer === undefined
}

export function getFieldsWithNoAnswer(
  screen: FormScreen,
  answers: FormValue,
  errorMessage: string,
): RecordObject<string> {
  let missingAnswers: RecordObject<string> = {}

  if (screen.type === FormItemTypes.MULTI_FIELD) {
    const { children } = screen

    for (const child of children) {
      missingAnswers = {
        ...missingAnswers,
        ...getFieldsWithNoAnswer(child, answers, errorMessage),
      }
    }
  } else if (screen.type !== FormItemTypes.REPEATER && screen.isNavigable) {
    const screenId = screen.id!
    const screenAnswer = getValueViaPath(answers, screenId)
    const hasBeenAnswered = !answerIsMissing(screenAnswer)
    const shouldBeAnswered = !get(screen, 'doesNotRequireAnswer')

    if (!hasBeenAnswered && shouldBeAnswered) {
      missingAnswers[screenId] = errorMessage
    }
  }

  return missingAnswers
}

export function findSubmitField(screen: FormScreen): SubmitField | undefined {
  console.log('findSubmitField', screen)
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
  if (screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER) {
    return buildSubmitField({
      id: 'submit',
      placement: 'footer',
      title: 'externalData.submitButtonTitle',
      refetchApplicationAfterSubmit: true,
      actions: [
        {
          event: 'SUBMIT',
          name: 'externalData.submitButtonTitle',
          type: 'primary',
        },
      ],
    })
  }
  return undefined
}

export function extractAnswersToSubmitFromScreen(
  data: FormValue,
  screen: FormScreen,
): FormValue {
  const screenId = screen.id ?? ''

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

  if (
    screen.type === FieldTypes.CUSTOM &&
    screen.childInputIds &&
    screen.childInputIds.length > 1
  ) {
    return pick(
      data,
      screen.childInputIds.map((id) => id),
    )
  }

  switch (screen.type) {
    case FormItemTypes.MULTI_FIELD:
      return pick(
        data,
        screen.children.map((c) => c.id),
      )
    case FormItemTypes.REPEATER:
      return {}
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
