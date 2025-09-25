import {
  CompanySearchField,
  FieldBaseProps,
} from '@island.is/application/types'
import React, { FC, useState } from 'react'
import {
  buildFieldRequired,
  formatText,
  formatTextWithLocale,
} from '@island.is/application/core'

import { Box } from '@island.is/island-ui/core'
import { CompanySearchController } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { useFormContext } from 'react-hook-form'

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
    title = '',
    placeholder,
    setLabelToDataSchema = true,
    shouldIncludeIsatNumber,
    checkIfEmployerIsOnForbiddenList,
    required,
    marginTop = [2, 4],
    marginBottom,
  } = field
  const { formatMessage, lang: locale } = useLocale()
  const { getValues } = useFormContext()

  const storedValue = getValues(id)
  const [searchTerm, setSearchTerm] = useState(storedValue?.label ?? '')

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <CompanySearchController
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        required={buildFieldRequired(application, required)}
        checkIfEmployerIsOnForbiddenList={checkIfEmployerIsOnForbiddenList}
        shouldIncludeIsatNumber={shouldIncludeIsatNumber}
        id={id}
        error={error}
        name={id}
        label={formatTextWithLocale(
          title,
          application,
          locale as Locale,
          formatMessage,
        )}
        placeholder={
          placeholder !== undefined
            ? formatText(placeholder as string, application, formatMessage)
            : undefined
        }
        colored
        setLabelToDataSchema={setLabelToDataSchema}
      />
    </Box>
  )
}
