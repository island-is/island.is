import { Box, Divider, Text } from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  IntroHeader,
  m,
  InfoLine,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LawAndOrderPaths } from '../../lib/paths'

const LawAndOrderOverview = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()
  return (
    <>
      <IntroHeader
        title={m.overview}
        intro={m.lawAndOrderDescription}
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />
      <Box>
        <Text variant="eyebrow" color="purple400" marginBottom={2}>
          {formatMessage(messages.myData)}
        </Text>
        <InfoLine
          label={formatMessage(messages.courtCases)}
          button={{
            type: 'link',
            to: LawAndOrderPaths.CourtCases,
            label: formatMessage(messages.seeInfo),
            icon: 'arrowForward',
          }}
        />
        <Divider />
      </Box>
    </>
  )
}
export default LawAndOrderOverview
