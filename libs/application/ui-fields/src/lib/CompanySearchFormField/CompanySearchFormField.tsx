import {
  CompanySearchField,
  FieldBaseProps,
} from '@island.is/application/types'
import React, { FC, useState } from 'react'
import {
  buildFieldRequired,
  formatText,
  formatTextWithLocale,
  resolveFieldId,
} from '@island.is/application/core'

import { Box } from '@island.is/island-ui/core'
import { CompanySearchController } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
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
  const user = useUserInfo()
  const { getValues } = useFormContext()
  const resolvedId = resolveFieldId({ id }, application, user)

  const storedValue = getValues(resolvedId)
  const [searchTerm, setSearchTerm] = useState(storedValue?.label ?? '')

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <CompanySearchController
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        required={buildFieldRequired(application, required)}
        checkIfEmployerIsOnForbiddenList={checkIfEmployerIsOnForbiddenList}
        shouldIncludeIsatNumber={shouldIncludeIsatNumber}
        id={resolvedId}
        error={error}
        name={resolvedId}
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
