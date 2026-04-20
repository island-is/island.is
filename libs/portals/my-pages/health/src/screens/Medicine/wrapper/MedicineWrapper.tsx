import { Box, Hidden } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  IntroWrapper,
  SJUKRATRYGGINGAR_SLUG,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { messages as m } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'
import { SECTION_GAP } from '../../../utils/constants'

export const MedicinePaymentParticipationWrapper = ({
  children,
  pathname,
}: {
  children: React.ReactNode
  pathname?: string
}) => {
  const { formatMessage } = useLocale()

  const medicineChildren = healthNavigation.children?.find(
    (itm) => itm.name === m.medicineTitle,
  )

  const paymentParticipationChildren =
    medicineChildren?.children?.find(
      (item) => item.name === m.medicinePaymentParticipation,
    )?.children ?? []

  return (
    <IntroWrapper
      title={formatMessage(m.medicineTitle)}
      intro={formatMessage(m.medicineTitleIntro)}
      serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
      serviceProviderTooltip={formatMessage(m.healthTooltip)}
      childrenWidthFull
    >
      <Hidden print={true}>
        <TabNavigation
          label={formatMessage(m.medicineTitle)}
          pathname={pathname}
          items={paymentParticipationChildren}
        />
      </Hidden>
      <Box paddingY={SECTION_GAP}>{children}</Box>
    </IntroWrapper>
  )
}
