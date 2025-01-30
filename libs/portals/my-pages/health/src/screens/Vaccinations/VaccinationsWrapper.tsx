import { Box, SkeletonLoader, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyTable,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import { messages as m } from '../../lib/messages'
import { SECTION_GAP } from '../../utils/constants'
import { useGetVaccinationsQuery } from './Vaccinations.generated'
import { SortedVaccinationsTable } from './tables/SortedVaccinationsTable'

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
    <IntroWrapper
      title={formatMessage(m.vaccinations)}
      intro={formatMessage(m.vaccinationsIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(m.landlaeknirVaccinationsTooltip)}
      buttonGroup={[
        <LinkButton
          key="vaccinations-read-about"
          to={formatMessage(m.readAboutVaccinationsLink)}
          icon="open"
          variant="utility"
          text={formatMessage(m.readAboutVaccinations)}
        />,
        <LinkButton
          key="vaccinations-make-appointment"
          to={formatMessage(m.makeVaccinationAppointmentLink)}
          icon="open"
          variant="utility"
          text={formatMessage(m.makeVaccinationAppointment)}
        />,
      ]}
    >
      <Box>
        {loading && (
          <SkeletonLoader
            repeat={3}
            space={2}
            height={24}
            borderRadius="standard"
          />
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
    </IntroWrapper>
  )
}
export default VaccinationsWrapper
