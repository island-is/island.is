import { useLocale, useNamespaces } from '@island.is/localization'
import { getOrganDonor } from '../../utils/OrganDonationMock'
import {
  ActionCard,
  IntroHeader,
  LinkResolver,
} from '@island.is/service-portal/core'
import { messages as m } from '../../lib/messages'
import { Button, Box, Text } from '@island.is/island-ui/core'
import { HealthPaths } from '../../lib/paths'
const OrganDonation = () => {
  useNamespaces('sp.health')

  const { formatMessage, lang } = useLocale()
  const { data, loading, error } = getOrganDonor(lang)

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.organDonation)}
        intro={formatMessage(m.organDonationDescription)}
      />
      <Box>
        <LinkResolver
          href={formatMessage(m.organDonationLink)}
          key="organ-donation"
        >
          <Button variant="utility" size="small" icon="open" iconType="outline">
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
          heading={data.data.title}
          text={data.data.description}
          cta={{
            url: HealthPaths.HealthOrganDonationRegistration,
            label: formatMessage(m.changeTake),
            centered: true,
          }}
        />
      </Box>
    </Box>
  )
}

export default OrganDonation
