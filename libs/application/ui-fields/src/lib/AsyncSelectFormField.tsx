import React, { FC, useEffect, useState } from 'react'
import {
  AsyncSelectField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import {
  SelectController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useApolloClient } from '@apollo/client/react'
import { Option } from '@island.is/application/core'

interface Props extends FieldBaseProps {
  field: AsyncSelectField
}
const AsyncSelectFormField: FC<Props> = ({ application, error, field }) => {
  const { id, name, description, loadOptions, placeholder, disabled } = field
  const { formatMessage } = useLocale()
  const apolloClient = useApolloClient()
  const [options, setOptions] = useState<Option[]>([])

  useEffect(() => {
    async function load() {
      const loaded = await loadOptions({ application, apolloClient })
      setOptions(loaded)
    }

    load()
  }, [])

  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <SelectController
          label={formatText(name, application, formatMessage)}
          name={id}
          disabled={disabled}
          error={error}
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
        />
      </Box>
    </div>
  )
}

export default AsyncSelectFormField
