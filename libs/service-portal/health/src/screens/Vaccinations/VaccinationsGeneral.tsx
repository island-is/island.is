import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { HealthPaths } from '../../lib/paths'
import { VaccinationsWrapper } from './wrapper/VaccinationsWrapper'
import { SortedVaccinationsTable } from './tables/SortedVaccinationsTable'
import { useGetVaccinationsQuery } from './Vaccinations.generated'
import { EmptyTable } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { messages as m } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'

export const VaccinationsGeneral = () => {
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetVaccinationsQuery()

  const vaccinations = data?.HealthDirectorateVaccinationsGetVaccinations
  return (
    <VaccinationsWrapper pathname={HealthPaths.HealthVaccinationsGeneral}>
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
        {!error && !loading && vaccinations !== undefined && (
          <SortedVaccinationsTable data={vaccinations} />
        )}
        {!loading && error && <Problem error={error} noBorder={false} />}
      </Box>
    </VaccinationsWrapper>
  )
}

export default VaccinationsGeneral
