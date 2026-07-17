import { FC, useMemo } from 'react'
import {
  FieldBaseProps,
  ScaleField,
  Application,
  MaybeWithApplicationAndFieldAndLocale,
} from '@island.is/application/types'
import { Controller, useFormContext } from 'react-hook-form'
import { Scale } from '@island.is/island-ui/core'
import {
  getValueViaPath,
  resolveFieldId,
  formatTextWithLocale,
  buildFieldRequired,
} from '@island.is/application/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Box } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: ScaleField
}

export const ScaleFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  error,
}) => {
  const {
    id,
    title = '',
    min,
    max,
    step,
    minLabel,
    maxLabel,
    showLabels,
    disabled,
    marginTop,
    marginBottom,
    required,
  } = field
  const { formatMessage, lang: locale } = useLocale()
  const user = useUserInfo()
  const resolvedId = resolveFieldId({ id }, application, user)
  const { clearErrors, setValue } = useFormContext()

  const computeMax = (
    maybeMax: MaybeWithApplicationAndFieldAndLocale<number | string>,
    memoApplication: Application,
    memoField: ScaleField,
    memoLocale: Locale,
  ) => {
    if (typeof maybeMax === 'function') {
      return maybeMax(memoApplication, memoField, memoLocale)
    }
    return maybeMax
  }

  const finalMax = useMemo(
    () =>
      computeMax(
        max as MaybeWithApplicationAndFieldAndLocale<number | string>,
        application,
        field,
        locale,
      ),
    [field, max, application, locale],
  )

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <Controller
        name={resolvedId}
        defaultValue={
          getValueViaPath<string>(application.answers, resolvedId) ?? null
        }
        render={({ field: { onChange, value } }) => (
          <Scale
            id={resolvedId}
            label={formatTextWithLocale(
              title,
              application,
              locale as Locale,
              formatMessage,
            )}
            min={min}
            max={finalMax}
            step={step}
            minLabel={minLabel}
            maxLabel={maxLabel}
            showLabels={showLabels}
            value={value}
            onChange={(val) => {
              clearErrors(resolvedId)
              onChange(val)
              setValue(resolvedId, val)
            }}
            disabled={disabled}
            error={error}
            required={buildFieldRequired(application, required)}
          />
        )}
      />
    </Box>
  )
}
