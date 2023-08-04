import { useGetHealthDirectorateOccupationaLicensesQuery } from './OccupationalLicensesOverview.generated'
import { Box, Stack } from '@island.is/island-ui/core'
import {
  ActionCard,
  EmptyState,
  CardLoader,
  ServicePortalPath,
  formatDate,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'

const OccupationalLicensesOverview = () => {
  const {
    data,
    loading,
    error,
  } = useGetHealthDirectorateOccupationaLicensesQuery({})

  const licenses = data?.healthDirectorateOccupationalLicenses

  const organizations = data?.getOrganizations

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader title={m.occupationaLicenses} intro={'intro intro intro'} />
      {loading && !error && <CardLoader />}
      {!loading && !error && licenses?.length === 0 && (
        <Box marginTop={8}>
          <EmptyState
            title={defineMessage({
              id: 'sp.education-graduation:education-no-data',
              defaultMessage: 'Engin gögn fundust',
            })}
          />
        </Box>
      )}
      <Stack space={2}>
        {(licenses?.length ?? 0) > 0 &&
          licenses?.map((item, index) => {
            return (
              <ActionCard
                key={`occupational-license-${index}`}
                heading={item.name ?? ''}
                text={'Útgáfudagur: '}
                subText={item.validFrom?.toString() ?? ''}
                cta={{
                  label: defineMessage({
                    id: 'sp.education-graduation:details',
                    defaultMessage: 'Skoða nánar',
                  }).defaultMessage,
                  variant: 'text',
                  url: '',
                }}
              />
            )
          })}
      </Stack>
    </Box>
  )
}

export default OccupationalLicensesOverview
