import {
  CompanySearchField,
  FieldBaseProps,
} from '@island.is/application/types'
import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'

import { Box } from '@island.is/island-ui/core'
import { CompanySearchController } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: CompanySearchField
}

export const CompanySearchFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  error,
}) => {
  const {
    id,
    title,
    placeholder,
    setLabelToDataSchema = true,
    shouldIncludeIsatNumber,
    checkIfEmployerIsOnForbiddenList,
    required,
  } = field
  const { formatMessage } = useLocale()

  const searchField = getValueViaPath(application.answers, id, {
    nationalId: '',
    label: '',
  })
  const defaultAnswer = {
    value: searchField?.nationalId ?? '',
    label: searchField?.label ?? '',
  }
  const initialValue = (application.answers[id] || { ...defaultAnswer }) as {
    value: string
    label: string
  }

  return (
    <Box marginTop={[2, 4]}>
      <CompanySearchController
        required={required}
        checkIfEmployerIsOnForbiddenList={checkIfEmployerIsOnForbiddenList}
        shouldIncludeIsatNumber={shouldIncludeIsatNumber}
        id={id}
        error={error}
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
