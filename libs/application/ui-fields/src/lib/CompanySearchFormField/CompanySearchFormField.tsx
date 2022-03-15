import {
  CompanySearchField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { CompanySearchController } from '@island.is/shared/form-fields'

interface Props extends FieldBaseProps {
  field: CompanySearchField
}

export const CompanySearchFormField: FC<Props> = ({ application, field }) => {
  const { id, title, placeholder, setLabelToDataSchema = true } = field
  const { formatMessage } = useLocale()

  const defaultAnswer = { value: '', label: '' }
  const initialValue = (application.answers[id] || { ...defaultAnswer }) as {
    value: string
    label: string
  }

  return (
    <Box marginTop={[2, 4]}>
      <CompanySearchController
        id={id}
        defaultValue={initialValue}
        name={id}
        label={formatText(title, application, formatMessage)}
        placeholder={
          placeholder !== undefined
            ? formatText(placeholder as string, application, formatMessage)
            : undefined
        }
        initialInputValue={initialValue.label}
        colored
        setLabelToDataSchema={setLabelToDataSchema}
      />
    </Box>
  )
}
