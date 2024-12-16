import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  IntroWrapper,
  LinkResolver,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages as m } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetDonorStatusQuery } from './OrganDonation.generated'
import { NoAccess } from './components/NoAccess'

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
  const isMinor = donorStatus?.isMinor
  const isTemporaryResident = donorStatus?.isTemporaryResident
  const hasLimitations = donorStatus?.limitations?.hasLimitations

  const comment = donorStatus?.limitations?.comment

  const allLimitations: Array<string> =
    donorStatus?.limitations?.limitedOrgansList?.map((item) => item.name) ?? []

  if (comment !== undefined && comment !== null && comment.length > 0) {
    allLimitations.push(comment)
  }

  const limitationText = hasLimitations
    ? formatMessage(m.iAmOrganDonorWithExceptionsText) +
      ' ' +
      allLimitations.join(', ')
    : formatMessage(m.iAmOrganDonorText)

  const cardText: string = donorStatus?.isDonor
    ? limitationText
    : formatMessage(m.iAmNotOrganDonorText)

  const heading = donorStatus?.isDonor
    ? donorStatus.limitations?.hasLimitations
      ? formatMessage(m.iAmOrganDonorWithExceptions)
      : formatMessage(m.iAmOrganDonor)
    : formatMessage(m.iAmNotOrganDonor)

  return (
    <IntroWrapper
      title={formatMessage(m.organDonation)}
      intro={formatMessage(m.organDonationDescription)}
      buttonGroup={[
        <LinkResolver
          href={formatMessage(m.organDonationLink)}
          key="organ-donation"
        >
          <Button variant="utility" size="small" icon="open" iconType="outline">
            {formatMessage(m.readAboutOrganDonation)}
          </Button>
        </LinkResolver>,
      ]}
    >
      {loading && (
        <Box marginY={4}>
          <CardLoader />
        </Box>
      )}
      {!error &&
        !loading &&
        !isMinor &&
        !isTemporaryResident &&
        donorStatus !== null && (
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
      {!error && !loading && (isMinor || isTemporaryResident) && (
        <NoAccess
          text={
            isMinor
              ? formatMessage(m.organMinor)
              : formatMessage(m.organTemporaryNationalId)
          }
        />
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && data === null && (
        <Problem type="no_data" noBorder={false} />
      )}
    </IntroWrapper>
  )
}

export default OrganDonation
