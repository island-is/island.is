import {
  CompanySearchField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import React, { FC } from 'react'
import { getDefaultValue } from '../../getDefaultValue'

interface Props extends FieldBaseProps {
  field: CompanySearchField
}

export const CompanySearchFormField: FC<Props> = ({
  application,
  error,
  field,
}) => {
  const { id, title, placeholder, backgroundColor } = field
  const { formatMessage } = useLocale()
  return (
    <Box>
      <SelectController
        defaultValue={getDefaultValue(field, application)}
        label={formatText(title, application, formatMessage)}
        id={id}
        name={id}
        placeholder={
          placeholder !== undefined
            ? formatText(placeholder as string, application, formatMessage)
            : undefined
        }
      />
    </Box>
  )
}
