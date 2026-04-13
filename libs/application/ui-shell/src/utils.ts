import {
  getValueViaPath,
  resolveFieldId,
  resolveFormItemId,
} from '@island.is/application/core'
import {
  AccordionField,
  Application,
  DataProviderItem,
  ExternalData,
  Field,
  FieldTypes,
  FormComponent,
  FormItemTypes,
  FormValue,
  RecordObject,
  SubmitField,
} from '@island.is/application/types'
import { FormScreen, MOCKPAYMENT } from './types'
import pick from 'lodash/pick'
import get from 'lodash/get'
import { BffUser } from '@island.is/shared/types'

export const verifyExternalData = (
  externalData: ExternalData,
  dataProviders: DataProviderItem[],
  application: Application,
  user?: BffUser,
): boolean => {
  for (let i = 0; i < dataProviders.length; i++) {
    const { id } = dataProviders[i]
    const resolvedId = id
      ? resolveFieldId({ id }, application, user)
      : undefined
    const dataProviderResult = externalData[resolvedId ?? '']
    if (!dataProviderResult || dataProviderResult.status === 'failure') {
      return false
    }
  }

  return true
}

export const answerIsMissing = (answer: unknown) => {
  return answer === undefined
}

export const getFieldsWithNoAnswer = (
  screen: FormScreen,
  answers: FormValue,
  errorMessage: string,
  application?: Application,
  user?: BffUser,
): RecordObject<string> => {
  let missingAnswers: RecordObject<string> = {}
  const app = application ?? ({ answers } as Application)

  if (screen.type === FormItemTypes.MULTI_FIELD) {
    const { children } = screen

    for (const child of children) {
      missingAnswers = {
        ...missingAnswers,
        ...getFieldsWithNoAnswer(child, answers, errorMessage, app, user),
      }
    }
  } else if (screen.type !== FormItemTypes.REPEATER && screen.isNavigable) {
    const screenId = resolveFieldId(screen as Field, app, user)
    const screenAnswer = getValueViaPath(answers, screenId)
    const hasBeenAnswered = !answerIsMissing(screenAnswer)
    const shouldBeAnswered = !get(screen, 'doesNotRequireAnswer')

    if (!hasBeenAnswered && shouldBeAnswered) {
      missingAnswers[screenId] = errorMessage
    }
  }

  return missingAnswers
}

export const findSubmitField = (
  screen: FormScreen,
): Array<SubmitField> | undefined => {
  if (screen.type === FieldTypes.SUBMIT) {
    return [screen]
  }

  if (screen.type === FormItemTypes.MULTI_FIELD) {
    const reviewScreen = screen.children.filter(
      (child) => child.type === FieldTypes.SUBMIT,
    )
    if (reviewScreen.length > 0) {
      return reviewScreen as Array<SubmitField>
    }
  }

  if (
    screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER &&
    screen.submitField !== undefined
  ) {
    return [screen.submitField]
  }
  return undefined
}

export const getAccordionChildFieldIds = (
  field: Field,
  application?: Application,
  user?: BffUser,
): string[] => {
  if (field.type !== FieldTypes.ACCORDION) return []
  const accordion = field as AccordionField
  const items =
    typeof accordion.accordionItems === 'function'
      ? []
      : accordion.accordionItems
  return items.flatMap((item) =>
    item.children
      ? item.children.map((child) =>
          application
            ? resolveFieldId(child, application, user)
            : (child.id as string),
        )
      : [],
  )
}

export const extractAnswersToSubmitFromScreen = (
  data: FormValue,
  screen: FormScreen,
  application?: Application,
  user?: BffUser,
): FormValue => {
  const app = application ?? ({ answers: data } as Application)
  const screenId = resolveFormItemId(screen, app, user)

  if (
    screen.isPartOfRepeater ||
    (screenId.includes('[') && screenId.includes(']'))
  ) {
    const baseId =
      screen.type === FormItemTypes.MULTI_FIELD
        ? resolveFieldId(screen.children[0] as Field, app, user)
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
    case FormItemTypes.EXTERNAL_DATA_PROVIDER:
      return pick(data, [screenId, MOCKPAYMENT])
    case FormItemTypes.MULTI_FIELD:
      return pick(
        data,
        screen.children.flatMap<string>((c) => [
          application ? resolveFieldId(c as Field, application, user) : (c.id as string),
          ...getAccordionChildFieldIds(c as Field, application, user),
        ]),
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

export const parseMessage = (message?: string) => {
  if (!message) {
    return undefined
  }

  if (isJSONObject(message)) {
    return JSON.parse(message)
  }

  return message
}

function isFunctionalComponent(
  component: FormComponent | undefined,
): component is React.FC<React.PropsWithChildren<unknown>> {
  if (!component) return false
  return (
    typeof component === 'function' &&
    !(component.prototype && component.prototype.isReactComponent) &&
    component.length === 0
  )
}
function isFunctionReturningComponent(
  component: FormComponent | undefined,
): component is (
  application: Application,
) => React.FC<React.PropsWithChildren<unknown>> | null | undefined {
  if (!component) return false
  return typeof component === 'function' && component.length === 1
}
export function getFormComponent(
  component: FormComponent | undefined,
  application: Application,
) {
  if (isFunctionalComponent(component)) {
    return component
  }
  if (isFunctionReturningComponent(component)) {
    return component(application)
  }
  return null
}
