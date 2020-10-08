import React, { FC } from 'react'
import { RepeaterScreen } from '../types'
import {
  RepeaterProps,
  FormValue,
  getValueViaPath,
  ExternalData,
} from '@island.is/application/core'
import { useFields } from './FieldContext'

const FormRepeater: FC<{
  repeater: RepeaterScreen
  formValue: FormValue
  errors: object
  expandRepeater: () => void
  externalData: ExternalData
}> = ({ errors, expandRepeater, externalData, repeater, formValue }) => {
  const [allFields] = useFields()
  if (!repeater.isNavigable) {
    return null
  }

  const error = getValueViaPath(errors, repeater.id, undefined) as
    | string
    | undefined
  const repeaterProps: RepeaterProps = {
    expandRepeater,
    error,
    repeater,
    formValue,
    externalData,
  }
  const Component = allFields[repeater.component] as
    | FC<RepeaterProps>
    | undefined
  if (!Component) {
    return <p>We have not implemented this repeater yet {repeater.type}</p>
  }

  return <Component {...repeaterProps} />
}

export default FormRepeater
