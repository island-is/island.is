import { FC, useMemo } from 'react'
import {
  SliderField,
  Application,
  MaybeWithApplicationAndField,
} from '@island.is/application/types'
import { Controller, useFormContext } from 'react-hook-form'
import { Slider } from '@island.is/application/ui-components'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { getDefaultValue } from '../../getDefaultValue'

type SliderFormFieldProps = {
  field: SliderField
  application: Application
}

export const SliderFormField: FC<
  React.PropsWithChildren<SliderFormFieldProps>
> = ({ application, field }) => {
  const { clearErrors, setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const computeMax = (
    maybeMax: MaybeWithApplicationAndField<number>,
    memoApplication: Application,
    memoField: SliderField,
  ) => {
    if (typeof maybeMax === 'function') {
      return maybeMax(memoApplication, memoField)
    }
    return maybeMax
  }

  const finalMax = useMemo(
    () =>
      computeMax(
        field.max as MaybeWithApplicationAndField<number>,
        application,
        field,
      ),
    [field, application],
  )

  return (
    <Box>
      <Controller
        name={field.id}
        defaultValue={
          Number(getValueViaPath(application.answers, field.id)) ||
          getDefaultValue(field, application) ||
          field.min
        }
        render={({ field: { onChange, value } }) => (
          <Slider
            min={field.min}
            max={finalMax}
            step={field.step}
            snap={field.snap}
            trackStyle={field.trackStyle}
            calculateCellStyle={field.calculateCellStyle}
            showLabel={field.showLabel}
            showMinMaxLabels={field.showMinMaxLabels}
            showRemainderOverlay={field.showRemainderOverlay}
            showProgressOverlay={field.showProgressOverlay}
            showToolTip={field.showToolTip}
            label={{
              singular: formatText(
                field.label.singular,
                application,
                formatMessage,
              ),
              plural: formatText(
                field.label.plural,
                application,
                formatMessage,
              ),
            }}
            rangeDates={field.rangeDates}
            currentIndex={Number(value)}
            onChange={(val) => {
              clearErrors(field.id)
              const value = field.saveAsString ? String(val) : val
              onChange(value)
              setValue(field.id, value)
            }}
            onChangeEnd={field.onChangeEnd}
            labelMultiplier={field.labelMultiplier}
          />
        )}
      />
    </Box>
  )
}
