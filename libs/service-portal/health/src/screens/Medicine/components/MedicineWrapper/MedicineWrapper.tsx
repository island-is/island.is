import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_ID,
} from '@island.is/service-portal/core'
import { messages as m } from '../../../../lib/messages'
import { HealthPaths } from '../../../../lib/paths'
import { PortalNavigation, PortalNavigationItem } from '@island.is/portals/core'

const medicineNavigation: PortalNavigationItem = {
  name: m.medicineTitle,
  path: HealthPaths.HealthMedicine,
  children: [
    {
      name: m.medicinePurchaseTitle,
      path: HealthPaths.HealthMedicine,
      activeIfExact: true,
    },
    {
      name: m.medicineCalculatorTitle,
      path: HealthPaths.HealthMedicineCalculator,
      activeIfExact: true,
    },
    {
      name: m.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificates,
      activeIfExact: true,
    },
  ],
}

export const MedicineWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.medicineTitle)}
        intro={formatMessage(m.medicineTitleIntro)}
        serviceProviderID={SJUKRATRYGGINGAR_ID}
      />
      <PortalNavigation navigation={medicineNavigation} />
      <Box paddingY={4}>{children}</Box>
    </Box>
  )
}
