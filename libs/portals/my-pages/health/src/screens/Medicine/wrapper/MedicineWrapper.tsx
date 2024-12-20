import { useLocale } from '@island.is/localization'
import { Box, Hidden } from '@island.is/island-ui/core'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_SLUG,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { messages as m } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'
import { SECTION_GAP } from '../constants'

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
        serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
        serviceProviderTooltip={formatMessage(m.healthTooltip)}
      />

      <Hidden print={true}>
        <TabNavigation
          label={formatMessage(m.medicineTitle)}
          pathname={pathname}
          items={
            healthNavigation.children?.find(
              (itm) => itm.name === m.medicineTitle,
            )?.children ?? []
          }
        />
      </Hidden>
      <Box paddingY={SECTION_GAP}>{children}</Box>
    </Box>
  )
}
