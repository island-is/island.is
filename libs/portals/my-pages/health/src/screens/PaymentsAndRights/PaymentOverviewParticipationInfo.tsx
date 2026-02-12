import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkButton } from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import * as styles from './Payments.css'

export const PaymentOverviewParticipationInfo = () => {
  const { formatMessage } = useLocale()

  return (
    <Box className={styles.linkText} marginTop={4} marginBottom={2}>
      <Text variant="small">
        {formatMessage(messages.paymentsParticipationInfo, {
          link: (str: React.ReactNode) => (
            <LinkButton
              to={formatMessage(
                messages.readAboutPaymentParticipationSystemsLink,
              )}
              text={String(str ?? '')}
              variant="text"
            />
          ),
        })}
      </Text>
    </Box>
  )
}
