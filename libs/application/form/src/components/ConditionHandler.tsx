import { FC, useEffect } from 'react'
import { FormItemTypes, FormValue } from '@island.is/application/schema'
import { useWatch } from 'react-hook-form'
import { FieldDef, FormScreen } from '../types'
import { convertLeafToScreen } from '../reducer/reducerUtils'

// Use this component to optimize performance for applying conditions in response to form value changes
export const ConditionHandler: FC<{
  answerQuestions(Answers): void
  formValue: FormValue
  screen: FormScreen
}> = ({ answerQuestions, formValue, screen }) => {
  const data = useWatch({ defaultValue: formValue })
  console.log({ data, formValue, screen })
  useEffect(() => {
    const newScreen = convertLeafToScreen(screen, {
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
