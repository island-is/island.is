import { Box, Button, LinkV2 } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_ID,
  TabNavigation,
  m,
} from '@island.is/service-portal/core'
import { healthNavigation } from '../../../lib/navigation'

type Props = {
  children: React.ReactNode
}

export const PaymentsWrapper = ({ children }: Props) => {
  const { formatMessage } = useLocale()

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

      <TabNavigation
        label="test"
        items={
          healthNavigation.children?.find((itm) => itm.name === m.payments)
            ?.children ?? []
        }
      />

      <Box paddingY={4} background="white">
        {children}
      </Box>
    </Box>
  )
}
