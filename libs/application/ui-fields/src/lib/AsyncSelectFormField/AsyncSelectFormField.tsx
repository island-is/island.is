import React, { FC, useEffect, useState } from 'react'

import { formatText } from '@island.is/application/core'
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
    required = false,
  } = field
  const { formatMessage } = useLocale()
  const apolloClient = useApolloClient()
  const [options, setOptions] = useState<Option[]>([])
  const [hasLoadingError, setHasLoadingError] = useState<boolean>(false)

  useEffect(() => {
    async function load() {
      try {
        setHasLoadingError(false)
        const loaded = await loadOptions({ application, apolloClient })
        setOptions(loaded)
      } catch {
        setHasLoadingError(true)
      }
    }

    load()
  }, [loadOptions])

  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <SelectController
          required={required}
          dataTestId={field.dataTestId}
          defaultValue={getDefaultValue(field, application)}
          label={formatText(title, application, formatMessage)}
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
          onSelect={onSelect}
          backgroundColor={backgroundColor}
          isSearchable={isSearchable}
        />
      </Box>
    </div>
  )
}
