import { formatText } from '@island.is/application/core'
import {
  CompanySearchField,
  FieldBaseProps,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { CompanySearchController } from '@island.is/application/ui-components'
import { selectCompanySearchField } from '@island.is/application/ui-components'

interface Props extends FieldBaseProps {
  field: CompanySearchField
}

export const CompanySearchFormField: FC<Props> = ({ application, field }) => {
  const {
    id,
    title,
    placeholder,
    setLabelToDataSchema = true,
    shouldIncludeIsatNumber,
  } = field
  const { formatMessage } = useLocale()

  const { searchField } = application.answers
    .selectCompany as selectCompanySearchField
  const defaultAnswer = {
    value: searchField.nationalId,
    label: searchField.label,
  }
  const initialValue = (application.answers[id] || { ...defaultAnswer }) as {
    value: string
    label: string
  }

  return (
    <Box marginTop={[2, 4]}>
      <CompanySearchController
        shouldIncludeIsatNumber={shouldIncludeIsatNumber}
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
