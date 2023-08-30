import { Stack, Divider, SkeletonLoader, Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { EmptyState, ExpandRow } from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useGetHealthCenterQuery } from './HealthCenterRegistration.generated'

const HealthCenterRegistration = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetHealthCenterQuery()

  const filterHealthCentersByRegion = (region: string) =>
    data?.rightsPortalPaginatedHealthCenters?.data?.filter(
      (hc) => hc.region === region,
    )

  const healthCenters = data?.rightsPortalPaginatedHealthCenters
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.healthCenterTitle)}
        intro={formatMessage(messages.healthCenterDescription)}
      />

      {!loading && healthCenters?.totalCount && healthCenters.totalCount <= 0 && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {healthCenters?.data && (
        <Box width="full" marginTop={[1, 1, 4]}>
          <Stack space={2}>
            {healthCenters.data.map((row, index) => {
              return (
                <ExpandRow
                  key={index}
                  onExpandCallback={() =>
                    filterHealthCentersByRegion(row.region)
                  }
                  data={[]}
                ></ExpandRow>
              )
            })}
          </Stack>
        </Box>
      )}

      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}
    </Box>
  )
}

export default HealthCenterRegistration
