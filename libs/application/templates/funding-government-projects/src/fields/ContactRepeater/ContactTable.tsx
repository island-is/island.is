import { Box, Button, Divider, Inline, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { informationAboutInstitution } from '../../lib/messages'

interface Props {
  name: string
  phoneNumber: string
  email?: string
  onEdit?: () => void
  onRemove?: () => void
}

export const ContactTable: FC<Props> = ({
  name,
  phoneNumber,
  email,
  onEdit,
  onRemove,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box border="standard" borderRadius="large" marginTop={3}>
      <Box padding={4}>
        <Text variant="h5">
          {formatMessage(informationAboutInstitution.labels.contactName)}
        </Text>
        <Text marginBottom={3}>{name}</Text>
        <Text variant="h5">
          {formatMessage(informationAboutInstitution.labels.contactPhoneNumber)}
        </Text>
        <Text marginBottom={3}>{phoneNumber}</Text>

        <Text variant="h5">
          {formatMessage(informationAboutInstitution.labels.contactEmail)}
        </Text>
        <Text marginBottom={3}>{email}</Text>
      </Box>
      <Divider />
      {onEdit || onRemove ? (
        <Box paddingTop={2} paddingBottom={3} paddingX={4}>
          <Inline space={3}>
            {onEdit && (
              <Button
                variant="text"
                size="small"
                icon="pencil"
                iconType="outline"
                onClick={onEdit}
              >
                {formatMessage(informationAboutInstitution.labels.edit)}
              </Button>
            )}
            {onRemove && (
              <Button
                variant="text"
                size="small"
                icon="removeCircle"
                iconType="outline"
                onClick={onRemove}
              >
                {formatMessage(informationAboutInstitution.labels.remove)}
              </Button>
            )}
          </Inline>
        </Box>
      ) : null}
    </Box>
  )
}
