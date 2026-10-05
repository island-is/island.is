import { Box, Hidden } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { useWindowSize } from 'react-use'
import {
  IntroWrapper,
  SJUKRATRYGGINGAR_SLUG,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { messages as m } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'
import { HealthPaths } from '../../../lib/paths'
import { SECTION_GAP } from '../../../utils/constants'

export const MedicinePaymentParticipationWrapper = ({
  children,
  pathname,
}: {
  children: React.ReactNode
  pathname?: string
}) => {
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const medicineChildren = healthNavigation.children?.find(
    (itm) => itm.path === HealthPaths.HealthMedicine,
  )

  const paymentParticipationChildren =
    medicineChildren?.children?.find(
      (item) => item.path === HealthPaths.HealthMedicinePaymentParticipation,
    )?.children ?? []

  const tabItems = isMobile
    ? paymentParticipationChildren.map((item) =>
        item.path === HealthPaths.HealthMedicinePurchase
          ? { ...item, name: m.medicinePurchaseTitleShort }
          : item,
      )
    : paymentParticipationChildren

  return (
    <IntroWrapper
      title={formatMessage(m.medicineTitle)}
      intro={formatMessage(m.medicineTitleIntro)}
      serviceProvider={{
        slug: SJUKRATRYGGINGAR_SLUG,
        tooltip: formatMessage(m.healthTooltip),
      }}
    >
      <Hidden print={true}>
        <TabNavigation
          label={formatMessage(m.medicineTitle)}
          pathname={pathname}
          items={tabItems}
        />
      </Hidden>
      <Box paddingY={SECTION_GAP}>{children}</Box>
    </IntroWrapper>
  )
}
