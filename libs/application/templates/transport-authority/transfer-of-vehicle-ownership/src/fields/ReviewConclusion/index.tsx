import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  AlertMessage,
  AccordionCard,
  Text,
  Divider,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { Jobs } from '../../assets/Jobs'
import { conclusion } from '../../lib/messages'
import { ReviewScreenProps } from '../../types'

export const ReviewConclusion: FC<FieldBaseProps & ReviewScreenProps> = ({
  refetch,
  setStep,
}) => {
  const { formatMessage } = useLocale()

  const onForwardButtonClick = () => {
    refetch?.()
  }

  return (
    <Box>
      <Text variant="h2" marginBottom={4}>
        Eigendaskipti samþykkt
      </Text>
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
      <Divider />
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button icon="arrowForward" onClick={onForwardButtonClick}>
          Skoða stöðu
        </Button>
      </Box>
    </Box>
  )
}
