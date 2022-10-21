import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  AlertMessage,
  AccordionCard,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { Jobs } from '../assets/Jobs'
import { conclusion } from '../lib/messages'

export const Conclusion: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginBottom={5}>
        <AlertMessage
          type="success"
          title={formatMessage(conclusion.seller.alertMessage)}
        />
      </Box>

      <AccordionCard
        id="conclustion-card"
        label={formatMessage(conclusion.seller.accordionTitle)}
      >
        <Text>{formatMessage(conclusion.seller.accordionText)}</Text>
      </AccordionCard>
      <Box
        marginTop={[5, 5, 5]}
        marginBottom={[5, 8]}
        display="flex"
        justifyContent="center"
      >
        <Jobs />
      </Box>
    </Box>
  )
}
