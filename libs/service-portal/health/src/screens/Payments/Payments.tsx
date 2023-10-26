import { lazy, useEffect, useState } from 'react'
import { Box, Button, LinkV2, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_ID,
} from '@island.is/service-portal/core'
import { useLocation } from 'react-router-dom'

const PaymentOverview = lazy(() => import('./TabPanes/PaymentOverview'))
const PaymentParticipation = lazy(() =>
  import('./TabPanes/PaymentParticipation'),
)

export enum PaymentTabs {
  PAYMENT_PARTICIPATION = 'participation',
  PAYMENT_OVERVIEW = 'overview',
}

export const Payments = () => {
  const { formatMessage } = useLocale()

  const { hash } = useLocation()
  const hashValue = hash.split('#')[1]

  const [activeTab, setActiveTab] = useState<PaymentTabs>(
    Object.values(PaymentTabs).includes(hashValue as PaymentTabs)
      ? (hashValue as PaymentTabs)
      : PaymentTabs.PAYMENT_PARTICIPATION,
  )

  // Needed to update internal state of tab component..
  const [forceRerender, setForceRerender] = useState<boolean>(false)

  useEffect(() => {
    if (forceRerender) setForceRerender(false)
  }, [forceRerender])

  const tabs = [
    {
      label: formatMessage(messages.paymentParticipation),
      id: PaymentTabs.PAYMENT_PARTICIPATION,
      content: <PaymentParticipation />,
    },
    {
      label: formatMessage(messages.paymentOverview),
      id: PaymentTabs.PAYMENT_OVERVIEW,
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
      {!forceRerender && (
        <Tabs
          label={formatMessage(messages.payments)}
          size="xs"
          tabs={tabs}
          onlyRenderSelectedTab={true}
          selected={activeTab}
        />
      )}
    </Box>
  )
}

export default Payments
