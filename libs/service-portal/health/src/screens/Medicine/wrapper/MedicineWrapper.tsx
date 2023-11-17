import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_SLUG,
  TabNavigation,
} from '@island.is/service-portal/core'
import { messages as m } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'

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
        serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
      />
      <TabNavigation
        label="test"
        items={
          healthNavigation.children?.find((itm) => itm.name === m.medicineTitle)
            ?.children ?? []
        }
      />
      <Box paddingY={4}>{children}</Box>
    </Box>
  )
}
