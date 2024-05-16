import { FC } from 'react'
import { SliderField, Application } from '@island.is/application/types'
import { Controller, useFormContext } from 'react-hook-form'
import { Slider } from '@island.is/application/ui-components'
import { getValueViaPath } from '@island.is/application/core'

type SliderFormFieldProps = {
  field: Omit<SliderField, 'type' | 'component' | 'title' | 'children'>
  application: Application
}

export const SliderFormField: FC<
  React.PropsWithChildren<SliderFormFieldProps>
> = ({ application, field }) => {
  const { clearErrors } = useFormContext()
  return (
    <Controller
      name={field.id}
      defaultValue={
        Number(getValueViaPath(application.answers, field.id)) ||
        field.currentIndex ||
        field.min
      }
      render={({ field: { onChange, value } }) => (
        <Slider
          min={field.min}
          max={field.max}
          step={field.step}
          snap={field.snap}
          trackStyle={field.trackStyle}
          calculateCellStyle={field.calculateCellStyle}
          showLabel={field.showLabel}
          showMinMaxLabels={field.showMinMaxLabels}
          showRemainderOverlay={field.showRemainderOverlay}
          showProgressOverlay={field.showProgressOverlay}
          showToolTip={field.showToolTip}
          label={field.label}
          rangeDates={field.rangeDates}
          currentIndex={value}
          onChange={(val) => {
            clearErrors(field.id)
            onChange(val)
          }}
          onChangeEnd={field.onChangeEnd}
          labelMultiplier={field.labelMultiplier}
        />
      )}
    />
  )
}
