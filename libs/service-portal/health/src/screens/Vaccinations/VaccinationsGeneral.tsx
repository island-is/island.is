import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { HealthPaths } from '../../lib/paths'
import { VaccinationsWrapper } from './wrapper/VaccinationsWrapper'
import { generalVaccinationsData } from './dataStructure'
import { SortedVaccinationsTable } from './tables/SortedVaccinationsTable'

export const VaccinationsGeneral = () => {
  const loading = false

  // Fetch data here
  const data = generalVaccinationsData

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
        <SortedVaccinationsTable data={data} />
      </Box>
    </VaccinationsWrapper>
  )
}

export default VaccinationsGeneral
