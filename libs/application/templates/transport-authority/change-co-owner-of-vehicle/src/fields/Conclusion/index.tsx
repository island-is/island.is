import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  AlertMessage,
  AccordionCard,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { Jobs } from '../../assets/Jobs'
import { conclusion } from '../../lib/messages'
import { CopyLink } from '@island.is/application/ui-components'

export const Conclusion: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={2}>
      <Box marginBottom={5}>
        <AlertMessage
          type="success"
          title={formatMessage(conclusion.default.alertTitle)}
          message={formatMessage(conclusion.default.alertMessage)}
        />
      </Box>

      <AccordionCard
        id="conclustion-card"
        label={formatMessage(conclusion.default.accordionTitle)}
      >
        <Text>{formatMessage(conclusion.default.accordionText)}</Text>
      </AccordionCard>
      <Box marginTop={3}>
        <Text variant="h4">{formatMessage(conclusion.default.shareLink)}</Text>
        <Box marginTop={2}>
          <CopyLink
            linkUrl={
              `${document.location.origin}/umsoknir/breyta-medeigandi-okutaekis/` +
              application.id
            }
            buttonTitle={formatMessage(conclusion.default.copyLink)}
          />
        </Box>
      </Box>
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
