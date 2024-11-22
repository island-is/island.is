import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, SkeletonLoader, Tabs } from '@island.is/island-ui/core'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroHeader,
  LinkButton,
  EmptyTable,
} from '@island.is/portals/my-pages/core'
import { messages as m } from '../../lib/messages'
import { SECTION_GAP } from '../../utils/constants'
import { useGetVaccinationsQuery } from './Vaccinations.generated'
import { SortedVaccinationsTable } from './tables/SortedVaccinationsTable'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'

export const VaccinationsWrapper = () => {
  useNamespaces('sp.health')
  const { formatMessage, locale } = useLocale()
  const { data, loading, error } = useGetVaccinationsQuery({
    variables: {
      locale: locale,
    },
  })

  const vaccinations = data?.healthDirectorateVaccinations.vaccinations

  const general = vaccinations?.filter((x) => x.isFeatured)
  const other = vaccinations?.filter((x) => !x.isFeatured)

  const tabs = [
    {
      label: formatMessage(m.generalVaccinations),
      content: <SortedVaccinationsTable data={general} />,
    },
    {
      label: formatMessage(m.otherVaccinations),
      content: <SortedVaccinationsTable data={other} />,
    },
  ].filter(isDefined)

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
          variant="utility"
          text={formatMessage(m.readAboutVaccinations)}
        />
        <Box marginLeft={1}>
          <LinkButton
            to={formatMessage(m.makeVaccinationAppointmentLink)}
            icon="open"
            variant="utility"
            text={formatMessage(m.makeVaccinationAppointment)}
          />
        </Box>
      </Box>

      <Box>
        {loading && (
          <SkeletonLoader repeat={3} space={2} height={24} borderRadius="xs" />
        )}
        {!error && vaccinations?.length === 0 && (
          <EmptyTable message={formatMessage(m.noVaccinesRegistered)} />
        )}

        {!loading && error && <Problem error={error} noBorder={false} />}
      </Box>
      {/* Tabs content */}
      {!loading && !error && (
        <Box paddingY={SECTION_GAP}>
          <Tabs
            label={''}
            tabs={tabs}
            contentBackground="transparent"
            selected="0"
            size="xs"
          />
        </Box>
      )}
    </Box>
  )
}
export default VaccinationsWrapper
