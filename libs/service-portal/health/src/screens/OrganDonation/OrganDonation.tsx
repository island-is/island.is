import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  IntroHeader,
  LinkResolver,
} from '@island.is/service-portal/core'
import { messages as m } from '../../lib/messages'
import { Button, Box, Text } from '@island.is/island-ui/core'
import { HealthPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'
import { useGetDonorStatusQuery } from './OrganDonation.generated'
const OrganDonation = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const { data, loading, error } = useGetDonorStatusQuery({
    fetchPolicy: 'no-cache',
  })
  const donorStatus = data?.HealthDirectorateOrganDonation.donor

  //TODO: Move this to service
  const exceptionText: string = donorStatus?.limitations?.hasLimitations
    ? [
        donorStatus?.limitations.comment,
        donorStatus?.limitations.organList?.join(', '),
      ].join(':') + '.' ?? ''
    : donorStatus?.limitations?.comment ?? ''

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.organDonation)}
        intro={formatMessage(m.organDonationDescription)}
      />
      {!error && !loading && donorStatus !== null && (
        <>
          <Box>
            <LinkResolver
              href={formatMessage(m.organDonationLink)}
              key="organ-donation"
            >
              <Button
                variant="utility"
                size="small"
                icon="open"
                iconType="outline"
              >
                {formatMessage(m.readAboutOrganDonation)}
              </Button>
            </LinkResolver>
          </Box>
          <Box>
            <Text
              variant="eyebrow"
              color="purple400"
              marginTop={5}
              marginBottom={1}
            >
              {formatMessage(m.takeOnOrganDonation)}
            </Text>
            <ActionCard
              heading={
                donorStatus?.isDonor
                  ? donorStatus.limitations?.hasLimitations
                    ? formatMessage(m.iAmOrganDonorWithExceptions)
                    : formatMessage(m.iAmOrganDonor)
                  : formatMessage(m.iAmNotOrganDonor)
              }
              text={exceptionText}
              cta={{
                url: HealthPaths.HealthOrganDonationRegistration,
                label: formatMessage(m.changeTake),
                centered: true,
                variant: 'text',
              }}
            />
          </Box>
        </>
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && data === null && (
        <Problem type="no_data" noBorder={false} />
      )}
    </Box>
  )
}

export default OrganDonation
