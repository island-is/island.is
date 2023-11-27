import { FC, useEffect } from 'react'
import { useWatch } from 'react-hook-form'

import {
  ExternalData,
  FormItemTypes,
  FormValue,
} from '@island.is/application/types'
import { useAuth } from '@island.is/auth/react'

import { FieldDef, MultiFieldScreen } from '../types'
import { convertMultiFieldToScreen } from '../reducer/reducerUtils'

// Use this component to optimize performance for applying conditions in response to form value changes for multifields
export const ConditionHandler: FC<
  React.PropsWithChildren<{
    answerQuestions(answers: FormValue): void
    externalData: ExternalData
    formValue: FormValue
    screen: MultiFieldScreen
  }>
> = ({ answerQuestions, externalData, formValue, screen }) => {
  const data = useWatch({ defaultValue: formValue }) as FormValue
  const { userInfo: user } = useAuth()

  useEffect(() => {
    const newScreen = convertMultiFieldToScreen(
      screen,
      {
        ...formValue,
        ...data,
      },
      externalData,
      true,
      screen.sectionIndex,
      screen.subSectionIndex,
      user,
    )

    let hasUpdated = false

    if (screen.isNavigable !== newScreen.isNavigable) {
      answerQuestions(data)
      hasUpdated = true
    }

    if (screen.type === FormItemTypes.MULTI_FIELD && !hasUpdated) {
      screen.children.forEach((child: FieldDef, index) => {
        if (child.isNavigable !== newScreen.children[index].isNavigable) {
          answerQuestions(data)
          return false
        }
      })
    }
  }, [answerQuestions, data, externalData, formValue, screen, user])
  return null
}

export default ConditionHandler
