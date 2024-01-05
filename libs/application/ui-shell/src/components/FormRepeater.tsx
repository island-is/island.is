import React, { FC } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import {
  RepeaterProps,
  Application,
  RecordObject,
  SetBeforeSubmitCallback,
  SetFieldLoadingState,
} from '@island.is/application/types'

import { useFields } from '../context/FieldContext'
import { RepeaterScreen } from '../types'
import { FetchResult } from '@apollo/client'

type RepeaterItems = unknown[]

const FormRepeater: FC<
  React.PropsWithChildren<{
    application: Application
    repeater: RepeaterScreen
    errors: RecordObject
    setBeforeSubmitCallback: SetBeforeSubmitCallback
    setFieldLoadingState: SetFieldLoadingState
    expandRepeater: () => void
    onUpdateRepeater: (
      newRepeaterItems: RepeaterItems,
    ) => Promise<{ errors?: FetchResult['errors'] }>
  }>
> = ({
  application,
  errors,
  setBeforeSubmitCallback,
  setFieldLoadingState,
  expandRepeater,
  onUpdateRepeater,
  repeater,
}) => {
  const [allFields] = useFields()
  if (!repeater.isNavigable) {
    return null
  }

  const error = getValueViaPath(errors, repeater.id, undefined) as
    | string
    | undefined

  const repeaterItems = getValueViaPath(
    application.answers,
    repeater.id,
    [],
  ) as RepeaterItems

  async function removeRepeaterItem(index: number) {
    if (index >= 0 && index < repeaterItems.length) {
      const newRepeaterItems = [
        ...repeaterItems.slice(0, index),
        ...repeaterItems.slice(index + 1),
      ]
      await onUpdateRepeater(newRepeaterItems)
    }
  }

  async function setRepeaterItems(items: RepeaterItems) {
    return await onUpdateRepeater(items)
  }

  const repeaterProps: RepeaterProps = {
    expandRepeater,
    error,
    repeater,
    application,
    removeRepeaterItem,
    setRepeaterItems,
    setBeforeSubmitCallback,
    setFieldLoadingState,
  }
  const Component = allFields[repeater.component] as
    | FC<React.PropsWithChildren<RepeaterProps>>
    | undefined
  if (!Component) {
    return <p>We have not implemented this repeater yet {repeater.type}</p>
  }

  return <Component {...repeaterProps} />
}

export default FormRepeater
