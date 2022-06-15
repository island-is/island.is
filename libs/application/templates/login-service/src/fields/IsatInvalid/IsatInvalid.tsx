import React from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import {
  AlertMessage,
  Box,
  GridColumn,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { errorMessages } from '../../lib/messages'

export const IsatInvalid = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <GridColumn span={['1/1', '1/1', '1/1']} paddingTop={2}>
        <AlertMessage
          type="error"
          title={formatText(
            errorMessages.invalidIsatMessage,
            application,
            formatMessage,
          )}
          message={
            <Box component="span" display="block">
              <Link
                href={formatText(
                  errorMessages.invalidIsatPdfUrl,
                  application,
                  formatMessage,
                )}
              >
                <Text variant="small">
                  {formatText(
                    errorMessages.invalidIsatPdfUrl,
                    application,
                    formatMessage,
                  )}
                </Text>
              </Link>
            </Box>
          }
        />
      </GridColumn>
    </>
  )
}
