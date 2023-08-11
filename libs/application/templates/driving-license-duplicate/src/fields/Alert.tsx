import { FC } from 'react'
import {
  ContentBlock,
  AlertMessage,
  Text,
  Box,
  AlertMessageType,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
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

export const Alert: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
}) => {
  const { formatMessage } = useLocale()
  const { title, type, message, heading } = field.props as Field
  console.log('message', formatText(message, application, formatMessage))
  return (
    <Box justifyContent={'spaceBetween'}>
      {heading && (
        <Text variant="h3" marginBottom={2}>
          {formatText(heading, application, formatMessage)}
        </Text>
      )}

      <Box marginBottom={3}>
        <ContentBlock>
          <AlertMessage
            type={type}
            title={
              title ? formatText(title, application, formatMessage) : undefined
            }
            message={formatText(message, application, formatMessage)}
          />
        </ContentBlock>
      </Box>
    </Box>
  )
}
