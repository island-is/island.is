import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  IntroWrapper,
  LinkButton,
  SJUKRATRYGGINGAR_SLUG,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'

type Props = {
  children: React.ReactNode
  pathname?: string
}

export const PaymentsWrapper = ({ children, pathname }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      marginBottom={5}
      title={formatMessage(messages.paymentsAndRights)}
      intro={formatMessage(messages.paymentsIntro)}
      serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
      serviceProviderTooltip={formatMessage(messages.healthTooltip)}
    >
      <TabNavigation
        label={formatMessage(messages.payments)}
        pathname={pathname}
        items={
          healthNavigation.children?.find(
            (itm) => itm.name === messages.paymentsAndRights,
          )?.children ?? []
        }
      />

      <Box paddingY={4} background="white">
        {children}
        <LinkButton
          to={formatMessage(messages.readAboutPaymentParticipationSystemsLink)}
          text={formatMessage(messages.readAboutPaymentParticipationSystems)}
          variant="text"
        />
      </Box>
    </IntroWrapper>
  )
}
