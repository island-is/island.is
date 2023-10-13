import { lazy } from 'react'
import { Box, Button, LinkV2, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_ID,
} from '@island.is/service-portal/core'

const PaymentOverview = lazy(() => import('./TabPanes/PaymentOverview'))
const PaymentParticipation = lazy(() =>
  import('./TabPanes/PaymentParticipation'),
)

export enum TabPanes {
  PAYMENT_PARTICIPATION = 'participation',
  PAYMENT_OVERVIEW = 'overview',
}

export const Payments = () => {
  const { formatMessage } = useLocale()

  const tabs = [
    {
      label: formatMessage(messages.paymentParticipation),
      id: TabPanes.PAYMENT_PARTICIPATION,
      content: <PaymentParticipation />,
    },
    {
      label: formatMessage(messages.paymentOverview),
      id: TabPanes.PAYMENT_OVERVIEW,
      content: <PaymentOverview />,
    },
  ]

  return (
    <Box>
      <Box marginBottom={5}>
        <IntroHeader
          title={formatMessage(messages.payments)}
          intro={formatMessage(messages.paymentsIntro)}
          serviceProviderID={SJUKRATRYGGINGAR_ID}
        />
        <LinkV2 href="#">
          <Button size="small" variant="text" icon="open" iconType="outline">
            {formatMessage(messages.readAboutPaymentParticipationSystems)}
          </Button>
        </LinkV2>
      </Box>
      <Tabs
        label={formatMessage(messages.payments)}
        size="xs"
        tabs={tabs}
        onlyRenderSelectedTab={true}
        selected={TabPanes.PAYMENT_PARTICIPATION}
      />
    </Box>
  )
}

export default Payments
