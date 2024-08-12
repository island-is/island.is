import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { HealthPaths } from '../../lib/paths'
import { VaccinationsWrapper } from './wrapper/VaccinationsWrapper'
import { otherVaccinationsData } from './dataStructure'
import { SortedVaccinationsTable } from './tables/SortedVaccinationsTable'

export const VaccinationsOther = () => {
  const loading = false
  const data = otherVaccinationsData
  // Fetch data here

  return (
    <VaccinationsWrapper pathname={HealthPaths.HealthVaccinationsOther}>
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

export default VaccinationsOther
