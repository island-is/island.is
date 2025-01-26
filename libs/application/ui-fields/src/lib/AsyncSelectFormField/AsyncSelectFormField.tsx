import React, { FC, useEffect, useState } from 'react'

import {
  buildFieldRequired,
  formatText,
  formatTextWithLocale,
} from '@island.is/application/core'
import { AsyncSelectField, FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  SelectController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useApolloClient } from '@apollo/client/react'
import { Option } from '@island.is/application/types'

import { getDefaultValue } from '../../getDefaultValue'
import { Locale } from '@island.is/shared/types'
import { useFormContext } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: AsyncSelectField
}

export const AsyncSelectFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  error,
  field,
}) => {
  const {
    id,
    title,
    description,
    loadOptions,
    loadingError,
    placeholder,
    disabled,
    onSelect,
    backgroundColor,
    isSearchable,
    isMulti,
    required = false,
    clearOnChange,
    updateOnSelect,
  } = field
  const { formatMessage, lang: locale } = useLocale()
  const apolloClient = useApolloClient()
  const [options, setOptions] = useState<Option[]>([])
  const [hasLoadingError, setHasLoadingError] = useState<boolean>(false)
  const { watch } = useFormContext()
  const [lastUpdateOnSelectValue, setLastUpdateOnSelectValue] =
    useState<string>('')

  const watchUpdateOnSelect = updateOnSelect ? watch(updateOnSelect) : []
  const load = async (selectedValue?: string[]) => {
    try {
      setHasLoadingError(false)
      const loaded = await loadOptions({
        application,
        apolloClient,
        selectedValue,
      })
      setOptions(loaded)
    } catch {
      setHasLoadingError(true)
    }
  }

  useEffect(() => {
    if (
      watchUpdateOnSelect.length > 0 &&
      watchUpdateOnSelect[0] !== undefined
    ) {
      setLastUpdateOnSelectValue(watchUpdateOnSelect[0])
    }
  }, [watchUpdateOnSelect])

  useEffect(() => {
    if (updateOnSelect) {
      const [selectedValue] = watchUpdateOnSelect
      if (selectedValue !== undefined) {
        load(selectedValue)
        setLastUpdateOnSelectValue(selectedValue)
      } else {
        load()
      }
    }
  }, [lastUpdateOnSelectValue])

  useEffect(() => {
    if (!updateOnSelect) {
      load()
    }
  }, [])

  return (
    <Box marginTop={field.marginTop} marginBottom={field.marginBottom}>
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
          dataTestId={field.dataTestId}
          defaultValue={getDefaultValue(field, application)}
          label={formatTextWithLocale(
            title,
            application,
            locale as Locale,
            formatMessage,
          )}
          name={id}
          disabled={disabled}
          error={
            error ||
            (hasLoadingError && loadingError
              ? formatText(loadingError, application, formatMessage)
              : undefined)
          }
          id={id}
          options={options.map(({ label, tooltip, ...o }) => ({
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
          backgroundColor={backgroundColor}
          isSearchable={isSearchable}
          isMulti={isMulti}
          clearOnChange={clearOnChange}
        />
      </Box>
    </Box>
  )
}
