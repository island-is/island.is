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
import { Text, Box } from '@island.is/island-ui/core'
import { getDefaultValue } from '../../getDefaultValue'

type SliderFormFieldProps = {
  field: SliderField
  application: Application
}

export const SliderFormField: FC<
  React.PropsWithChildren<SliderFormFieldProps>
> = ({ application, field }) => {
  const {
    id,
    min,
    max,
    trackStyle,
    calculateCellStyle,
    showLabel,
    showMinMaxLabels,
    showRemainderOverlay,
    showProgressOverlay,
    showToolTip,
    label,
    rangeDates,
    onChangeEnd,
    labelMultiplier,
    snap,
    step,
    saveAsString,
    textColor,
    progressOverlayColor,
    marginTop,
    marginBottom,
  } = field
  const { clearErrors, setValue } = useFormContext()
  const { formatMessage, lang: locale } = useLocale()
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
        max as MaybeWithApplicationAndField<number>,
        application,
        field,
      ),
    [field, max, application],
  )

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <Controller
        name={field.id}
        defaultValue={
          Number(getValueViaPath(application.answers, id)) ||
          getDefaultValue(field, application, locale) ||
          min
        }
        render={({ field: { onChange, value } }) => (
          <Slider
            min={min}
            max={finalMax}
            step={step}
            snap={snap}
            trackStyle={trackStyle}
            calculateCellStyle={calculateCellStyle}
            showLabel={showLabel}
            showMinMaxLabels={showMinMaxLabels}
            showRemainderOverlay={showRemainderOverlay}
            showProgressOverlay={showProgressOverlay}
            showToolTip={showToolTip}
            label={
              label && {
                singular: formatText(
                  label.singular,
                  application,
                  formatMessage,
                ),
                plural: formatText(label.plural, application, formatMessage),
              }
            }
            rangeDates={rangeDates}
            currentIndex={Number(value)}
            onChange={(val) => {
              clearErrors(id)
              const value = saveAsString ? String(val) : val
              onChange(value)
              setValue(id, value)
            }}
            onChangeEnd={onChangeEnd}
            labelMultiplier={labelMultiplier}
            textColor={textColor}
            progressOverlayColor={progressOverlayColor}
          />
        )}
      />
    </Box>
  )
}
