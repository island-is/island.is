import { FC } from 'react'
import {
  ContentBlock,
  AlertMessage,
  Text,
  Box,
  AlertMessageType,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CustomField, FieldBaseProps } from '@island.is/application/types'

interface Props extends FieldBaseProps {
  field: CustomField
}

type Field = {
  heading?: string
  title?: string
  type: AlertMessageType
  message: string
}

export const Alert: FC<React.PropsWithChildren<Props>> = ({ field }) => {
  const { formatMessage } = useLocale()
  const { title, type, message, heading } = field.props as Field

  return (
    <Box>
      {heading && (
        <Text variant="h4" marginBottom={2}>
          {formatMessage(heading)}
        </Text>
      )}

      <AlertMessage
        type={type}
        title={title ? formatMessage(title) : undefined}
        message={formatMessage(message)}
      />
    </Box>
  )
}
