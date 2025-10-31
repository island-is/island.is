import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  AlertMessage,
  Text,
  Divider,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Jobs } from '../assets/Jobs'
import { confirmation } from '../lib/messages'

export const Confirmation: FC<React.PropsWithChildren<FieldBaseProps>> = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="h2" marginBottom={4}>
        {formatMessage(confirmation.general.title)}
      </Text>
      <Box marginBottom={5}>
        <AlertMessage
          type="success"
          title={formatMessage(confirmation.general.alertMessageTitle)}
        />
      </Box>

      <Box
        marginTop={[5, 5, 5]}
        marginBottom={[5, 8]}
        display="flex"
        justifyContent="center"
      >
        <Jobs />
      </Box>

      <Divider />

      <Box
        display="flex"
        justifyContent="flexEnd"
        paddingTop={4}
        marginBottom={4}
      >
        <Button
          icon="arrowForward"
          iconType="outline"
          onClick={() => {
            window.open(`${window.location.origin}/minarsidur`, '_blank')
          }}
        >
          {formatMessage(confirmation.general.openMySiteLinkText)}
        </Button>
      </Box>
    </Box>
  )
}
