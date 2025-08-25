import { Application, Field, RecordObject } from '@island.is/application/types'
import { AlertMessage, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { disabilityPensionFormMessage } from '../../lib/messages'
import { Markdown } from '@island.is/shared/components'
import * as styles from './confirmation.css'

interface ConfirmationScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  refetch?: () => void
  errors?: RecordObject
  editable?: boolean
}

export const Confirmation: FC<ConfirmationScreenProps> = () => {
  const { formatMessage } = useLocale()
  return (
    <Stack space={6}>
      <AlertMessage
        type="warning"
        title={formatMessage(
          disabilityPensionFormMessage.confirmation.warningTitle,
        )}
        message={
          <Box className={styles.markdownContent}>
            <Text variant="small">
              <Markdown
                options={{ openLinksInNewTab: true }}
                children={formatMessage(
                  disabilityPensionFormMessage.confirmation.warningDescription,
                )}
              />
            </Text>
          </Box>
        }
      />
    </Stack>
  )
}

export default Confirmation
