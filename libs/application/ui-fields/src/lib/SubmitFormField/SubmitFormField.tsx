import React, { FC, useMemo } from 'react'

import { formatText, formatTextWithLocale } from '@island.is/application/core'
import { SubmitField, FieldBaseProps } from '@island.is/application/types'
import { Text, Box } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'

interface Props extends FieldBaseProps {
  field: SubmitField
}

export const SubmitFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  error,
}) => {
  const {
    id,
    title = '',
    actions,
    placement,
    marginTop = 4,
    marginBottom,
  } = field
  const { formatMessage, lang: locale } = useLocale()
  const actionsAsOptions = useMemo(() => {
    return actions.map((a) => {
      return {
        label: formatText(a.name, application, formatMessage),
        dataTestId: a.dataTestId,
        value: a.event as string,
      }
    })
  }, [actions, application, formatMessage])

  if (placement === 'footer') {
    return null
  }

  return (
    <Box
      background="blue100"
      borderRadius="large"
      width="full"
      padding={4}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      <Text variant="h4">
        {formatTextWithLocale(
          title,
          application,
          locale as Locale,
          formatMessage,
        )}
      </Text>
      <Box paddingTop={1}>
        <RadioController id={id} options={actionsAsOptions} error={error} />
      </Box>
    </Box>
  )
}
