import React, { FC } from 'react'
import { RepeaterScreen } from '../types'
import {
  RepeaterProps,
  getValueViaPath,
  Application,
} from '@island.is/application/core'
import { useFields } from './FieldContext'

const FormRepeater: FC<{
  application: Application
  repeater: RepeaterScreen
  errors: object
  expandRepeater: () => void
}> = ({ application, errors, expandRepeater, repeater }) => {
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
    application,
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
