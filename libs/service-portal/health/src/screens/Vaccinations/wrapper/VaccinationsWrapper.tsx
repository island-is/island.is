import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Hidden } from '@island.is/island-ui/core'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroHeader,
  LinkButton,
  TabNavigation,
} from '@island.is/service-portal/core'
import { messages as m } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'
import { SECTION_GAP } from '../../../utils/constants'

export const VaccinationsWrapper = ({
  children,
  pathname,
}: {
  children: React.ReactNode
  pathname?: string
}) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.vaccinations)}
        intro={formatMessage(m.vaccinationsIntro)}
        serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
        serviceProviderTooltip={formatMessage(m.landlaeknirVaccinationsTooltip)}
      />
      {/* Buttons */}
      <Box printHidden display="flex" flexDirection="row" marginBottom={6}>
        <LinkButton
          to={formatMessage(m.readAboutVaccinationsLink)}
          icon="open"
          variant="button"
          text={formatMessage(m.readAboutVaccinations)}
        />
        <Box marginLeft={1}>
          <LinkButton
            to={formatMessage(m.makeVaccinationAppointmentLink)}
            icon="open"
            variant="button"
            text={formatMessage(m.makeVaccinationAppointment)}
          />
        </Box>
      </Box>
      {/* Tabs content */}
      <Hidden print={true}>
        <TabNavigation
          label={formatMessage(m.vaccinations)}
          pathname={pathname}
          items={
            healthNavigation.children?.find(
              (itm) => itm.name === m.vaccinations,
            )?.children ?? []
          }
        />
      </Hidden>
      <Box paddingY={SECTION_GAP}>{children}</Box>
    </Box>
  )
}
