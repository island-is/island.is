import { Box, Divider } from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  IntroHeader,
  m,
  UserInfoLine,
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
        <UserInfoLine
          title={formatMessage(messages.myData)}
          label={formatMessage(messages.courtCases)}
          editLink={{
            external: true,
            url: LawAndOrderPaths.CourtCases,
            title: formatMessage(messages.seeInfo),
            icon: 'arrowForward',
          }}
        />
        <Divider />
      </Box>
    </>
  )
}
export default LawAndOrderOverview
