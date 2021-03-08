import { AlertMessage, Button, Link } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { sharedFields } from '../lib/messages'

export const FieldAlertMessage: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { title, description } = field
  const { formatMessage } = useLocale()

  // TODO: This should be passed down as a custom prop
  // but support is not available in the application system atm
  const buttonUrl = field.defaultValue as string | undefined

  return (
    <Box marginBottom={5}>
      <AlertMessage
        type="info"
        title={formatText(title, application, formatMessage)}
        message={
          description ? (
            <>
              {formatText(description, application, formatMessage)}{' '}
              {buttonUrl && (
                <Link href={buttonUrl}>
                  <Button
                    variant="text"
                    icon="open"
                    iconType="outline"
                    size="small"
                  >
                    {formatText(
                      sharedFields.moreInfoButtonLabel,
                      application,
                      formatMessage,
                    )}
                  </Button>
                </Link>
              )}
            </>
          ) : undefined
        }
      />
    </Box>
  )
}
