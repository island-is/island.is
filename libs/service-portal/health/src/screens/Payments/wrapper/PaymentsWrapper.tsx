import { Box, Button, LinkV2 } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_SLUG,
  TabNavigation,
  m,
} from '@island.is/service-portal/core'
import { healthNavigation } from '../../../lib/navigation'

type Props = {
  children: React.ReactNode
  pathname?: string
}

export const PaymentsWrapper = ({ children, pathname }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginBottom={5}>
        <IntroHeader
          title={formatMessage(messages.payments)}
          intro={formatMessage(messages.paymentsIntro)}
          serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
          serviceProviderTooltip={formatMessage(messages.healthTooltip)}
        />
        <LinkV2
          href={formatMessage(
            messages.readAboutPaymentParticipationSystemsLink,
          )}
        >
          <Button
            size="small"
            variant="text"
            icon="open"
            iconType="outline"
            as="span"
            unfocusable
          >
            {formatMessage(messages.readAboutPaymentParticipationSystems)}
          </Button>
        </LinkV2>
      </Box>

      <TabNavigation
        label={formatMessage(messages.payments)}
        pathname={pathname}
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
