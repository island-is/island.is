import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_ID,
  TabNavigation,
} from '@island.is/service-portal/core'
import { messages as m } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'

export const MedicineWrapper = ({
  children,
  pathname,
}: {
  children: React.ReactNode
  pathname?: string
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.medicineTitle)}
        intro={formatMessage(m.medicineTitleIntro)}
        serviceProviderID={SJUKRATRYGGINGAR_ID}
      />
      <TabNavigation
        label={formatMessage(m.medicineTitle)}
        pathname={pathname}
        items={
          healthNavigation.children?.find((itm) => itm.name === m.medicineTitle)
            ?.children ?? []
        }
      />
      <Box paddingY={4}>{children}</Box>
    </Box>
  )
}
