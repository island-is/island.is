import React, { FC, useMemo } from 'react'
import {
  formatText,
  buildFieldOptions,
  getValueViaPath,
  buildFieldRequired,
  formatTextWithLocale,
} from '@island.is/application/core'
import { FieldBaseProps, SelectField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  SelectController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import { getDefaultValue } from '../../getDefaultValue'
import { Locale } from '@island.is/shared/types'
import { useFormContext } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: SelectField
}

export const SelectFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  error,
  field,
}) => {
  const {
    id,
    title = '',
    description,
    options,
    placeholder,
    disabled,
    onSelect,
    backgroundColor,
    required = false,
    isMulti,
    marginTop,
    marginBottom,
    clearOnChange,
    setOnChange,
    isClearable,
  } = field
  const { formatMessage, lang: locale } = useLocale()
  const { getValues } = useFormContext()
  const values = getValues()

  const updatedApplication = useMemo(() => {
    return {
      ...application,
      answers: {
        ...application.answers,
        ...values,
      },
    }
  }, [application, values])

  const finalOptions = useMemo(() => {
    return buildFieldOptions(options, updatedApplication, field, locale)
  }, [options, updatedApplication, field, locale])

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {description && (
        <FieldDescription
          description={formatTextWithLocale(
            description,
            application,
            locale as Locale,
            formatMessage,
          )}
        />
      )}

      <Box paddingTop={2}>
        <SelectController
          required={buildFieldRequired(application, required)}
          defaultValue={
            (getValueViaPath(application.answers, id) ??
              getDefaultValue(field, application)) ||
            (required ? '' : undefined)
          }
          label={formatTextWithLocale(
            title,
            application,
            locale as Locale,
            formatMessage,
          )}
          name={id}
          disabled={disabled}
          error={error}
          id={id}
          dataTestId={field.dataTestId}
          isMulti={isMulti}
          backgroundColor={backgroundColor}
          options={finalOptions?.map(({ label, tooltip, ...o }) => ({
            ...o,
            label: formatText(label, application, formatMessage),
            ...(tooltip && {
              tooltip: formatText(tooltip, application, formatMessage),
            }),
          }))}
          placeholder={
            placeholder !== undefined
              ? formatText(placeholder as string, application, formatMessage)
              : undefined
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          onSelect={onSelect}
          clearOnChange={clearOnChange}
          setOnChange={
            typeof setOnChange === 'function'
              ? async (optionValue) =>
                  await setOnChange(optionValue, updatedApplication)
              : setOnChange
          }
          isClearable={isClearable}
        />
      </Box>
    </Box>
  )
}
