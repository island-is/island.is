import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
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

  const { formatMessage, lang } = useLocale()
  const { data, loading, error } = useGetDonorStatusQuery({
    fetchPolicy: 'no-cache',
    variables: {
      locale: lang,
    },
  })
  const donorStatus = data?.healthDirectorateOrganDonation.donor
  const cardText: string = donorStatus?.isDonor
    ? donorStatus?.limitations?.hasLimitations
      ? [
          formatMessage(m.iAmOrganDonorWithExceptionsText),
          donorStatus?.limitations.limitedOrgansList
            ?.map((organ) => organ.name)
            .join(', '),
        ].join(' ') + '.'
      : formatMessage(m.iAmOrganDonorText)
    : formatMessage(m.iAmNotOrganDonorText)

  const heading = donorStatus?.isDonor
    ? donorStatus.limitations?.hasLimitations
      ? formatMessage(m.iAmOrganDonorWithExceptions)
      : formatMessage(m.iAmOrganDonor)
    : formatMessage(m.iAmNotOrganDonor)

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.organDonation)}
        intro={formatMessage(m.organDonationDescription)}
      />
      <Box marginBottom={6}>
        <LinkResolver
          href={formatMessage(m.organDonationLink)}
          key="organ-donation"
        >
          <Button variant="utility" size="small" icon="open" iconType="outline">
            {formatMessage(m.readAboutOrganDonation)}
          </Button>
        </LinkResolver>
      </Box>
      {loading && (
        <Box marginY={4}>
          <CardLoader />
        </Box>
      )}
      {!error && !loading && donorStatus !== null && (
        <Box>
          <Text variant="eyebrow" color="purple400" marginBottom={1}>
            {formatMessage(m.takeOnOrganDonation)}
          </Text>
          <ActionCard
            heading={heading}
            text={cardText}
            cta={{
              url: HealthPaths.HealthOrganDonationRegistration,
              label: formatMessage(m.changeTake),
              centered: true,
              variant: 'text',
            }}
            loading={loading}
          />
        </Box>
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && data === null && (
        <Problem type="no_data" noBorder={false} />
      )}
    </Box>
  )
}

export default OrganDonation
