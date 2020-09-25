import { FC, useEffect } from 'react'
import { FormItemTypes, FormValue } from '@island.is/application/template'
import { useWatch } from 'react-hook-form'
import { FieldDef, MultiFieldScreen } from '../types'
import { convertMultiFieldToScreen } from '../reducer/reducerUtils'

// Use this component to optimize performance for applying conditions in response to form value changes for multifields
export const ConditionHandler: FC<{
  answerQuestions(answers: FormValue): void
  formValue: FormValue
  screen: MultiFieldScreen
}> = ({ answerQuestions, formValue, screen }) => {
  const data = useWatch({ defaultValue: formValue }) as FormValue

  useEffect(() => {
    const newScreen = convertMultiFieldToScreen(screen, {
      ...formValue,
      ...data,
    })
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
  }, [answerQuestions, data, formValue, screen])
  return null
}

export default ConditionHandler
