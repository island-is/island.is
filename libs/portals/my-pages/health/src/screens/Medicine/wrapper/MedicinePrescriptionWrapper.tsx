import { useLocale } from '@island.is/localization'
import { Box, Hidden } from '@island.is/island-ui/core'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroHeader,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { messages as m } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'
import { SECTION_GAP } from '../constants'

export const MedicinePrescriptionWrapper = ({
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

  const prescriptionChildren =
    medicineChildren?.children?.find(
      (item) => item.name === m.medicinePrescriptions,
    )?.children ?? []

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.medicinePrescriptions)}
        intro={formatMessage(m.medicinePrescriptionIntroText)}
        serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
        serviceProviderTooltip={formatMessage(
          m.landlaeknirMedicinePrescriptionsTooltip,
        )}
      />

      <Hidden print={true}>
        <TabNavigation
          label={formatMessage(m.medicinePrescriptions)}
          pathname={pathname}
          items={prescriptionChildren}
        />
      </Hidden>
      <Box paddingY={SECTION_GAP}>{children}</Box>
    </Box>
  )
}
