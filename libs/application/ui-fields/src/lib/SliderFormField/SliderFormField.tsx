import { FC } from 'react'
import { SliderField, Application } from '@island.is/application/types'
import { Controller, useFormContext } from 'react-hook-form'
import { Slider } from '@island.is/application/ui-components'
import { getValueViaPath } from '@island.is/application/core'

export const SliderFormField: FC<
  React.PropsWithChildren<{
    field: Omit<SliderField, 'type' | 'component' | 'title' | 'children'>
    application: Application
  }>
> = ({ application, field }) => {
  const { clearErrors } = useFormContext()
  return (
    <Controller
      name={field.id}
      defaultValue={
        Number(getValueViaPath(application.answers, field.id)) ||
        field.currentIndex
      }
      render={({ field: { onChange, value } }) => (
        <Slider
          {...field}
          onChange={(val) => {
            clearErrors(field.id)
            onChange(val)
          }}
          currentIndex={value}
        />
      )}
    />
  )
}
