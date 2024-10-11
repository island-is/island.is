import { AlertMessage, Button, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { confirmation } from '../../lib/messages'
import { SelectedProperty } from '../../shared'

type ConfirmationFieldProps = {
  field: {
    props: {
      link?: {
        title: string
        url: string
      }
    }
  }
  application: {
    externalData: {
      getMortgageCertificate: {
        data: {
          contentBase64: string
        }
      }
    }
  }
}

export const ConfirmationField: FC<
  React.PropsWithChildren<FieldBaseProps & ConfirmationFieldProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const incorrectPropertiesSent = getValueViaPath(
    application.answers,
    'incorrectPropertiesSent',
    [],
  ) as SelectedProperty[]

  return (
    <>
      <Box display="flex" wrap="nowrap" paddingBottom={4} paddingTop={2}>
        <Text variant="h5">
          {formatMessage(confirmation.labels.mortgageCertificateInboxText)}
        </Text>

        <Box paddingLeft={1}>
          <Button
            icon="open"
            iconType="outline"
            onClick={() => {
              window.open(
                formatText(
                  confirmation.labels.mortgageCertificateInboxLink,
                  application,
                  formatMessage,
                ),
                '_blank',
              )
            }}
            variant="text"
          >
            {formatText(
              confirmation.labels.mortgageCertificateInboxLinkText,
              application,
              formatMessage,
            )}
          </Button>
        </Box>
      </Box>

      {/** Will only be visible if there are any incorrectPropertiesSent data */}
      {incorrectPropertiesSent.map((property) => (
        <Box paddingBottom={3} key={`confirm-${property.propertyNumber}`}>
          <AlertMessage
            title={formatMessage(confirmation.labels.incorrectPropertyTitle, {
              propertyName: property.propertyName,
            })}
            message={formatMessage(
              confirmation.labels.incorrectPropertyMessage,
            )}
            type="info"
          />
        </Box>
      ))}
    </>
  )
}
