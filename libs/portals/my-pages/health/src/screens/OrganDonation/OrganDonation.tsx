import { Box, Button, Text, ActionCard } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  LinkResolver,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages as m } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetDonorStatusQuery } from './OrganDonation.generated'
import { NoAccess } from './components/NoAccess'
import { getOrganText } from './helpers/textMapper'
import { useNavigate } from 'react-router-dom'

const OrganDonation = () => {
  useNamespaces('sp.health')

  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const { data, loading, error } = useGetDonorStatusQuery({
    fetchPolicy: 'no-cache',
    variables: {
      locale: lang,
    },
  })
  const donorStatus = data?.healthDirectorateOrganDonation.donor
  const isMinor = donorStatus?.isMinor
  const isTemporaryResident = donorStatus?.isTemporaryResident

  const comment = donorStatus?.limitations?.comment

  const allLimitations: Array<string> =
    donorStatus?.limitations?.limitedOrgansList?.map((item) => item.name) ?? []

  if (comment !== undefined && comment !== null && comment.length > 0) {
    allLimitations.push(comment)
  }

  const texts = getOrganText(
    donorStatus?.isDonor ?? true,
    donorStatus?.limitations?.hasLimitations ?? false,
    {
      iAmOrganDonorWithExceptionsText: formatMessage(
        m.iAmOrganDonorWithExceptionsText,
      ),
      iAmNotOrganDonorText: formatMessage(m.iAmNotOrganDonorText),
      iAmOrganDonorText: formatMessage(m.iAmOrganDonorText),
      iAmOrganDonorWithExceptions: formatMessage(m.iAmOrganDonorWithExceptions),
      iAmOrganDonor: formatMessage(m.iAmOrganDonor),
      iAmNotOrganDonor: formatMessage(m.iAmNotOrganDonor),
    },
    allLimitations,
  )

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
              heading={texts.heading}
              text={texts.cardText}
              cta={{
                onClick: () =>
                  navigate(HealthPaths.HealthOrganDonationRegistration),
                label: formatMessage(m.changeTake),
                variant: 'text',
              }}
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
