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
  const { data, loading, error } = useGetDonorStatusQuery()
  const donorStatus = data?.HealthDirectorateOrganDonationGetDonorStatus

  const exceptionText: string =
    donorStatus?.exceptions?.length && donorStatus.exceptions.length > 0
      ? [
          donorStatus?.exceptionComment,

          donorStatus?.exceptions?.join(', '),
        ].join(':') ?? ''
      : donorStatus?.exceptionComment ?? ''
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
                  ? formatMessage(m.iAmOrganDonor)
                  : formatMessage(m.iAmNotOrganDonor)
              }
              text={exceptionText}
              cta={{
                url: HealthPaths.HealthOrganDonationRegistration,
                label: formatMessage(m.changeTake),
                centered: true,
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
