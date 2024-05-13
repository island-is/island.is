import { Box, Text } from '@island.is/island-ui/core'
import {
  ActionCard,
  DOMSMALARADUNEYTID_SLUG,
  IntroHeader,
  m,
  THJODSKRA_SLUG,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { messages } from '../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LawAndOrderPaths } from '../lib/paths'
import { listCases } from '../helpers/mockData'

const CourtCases = () => {
  useNamespaces('sp.law-and-order')
  const cases = listCases()
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={3}>
      <IntroHeader
        title={messages.courtCases}
        intro={messages.courtCasesDescription}
        //TODO: replace service provider!
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />
      {cases.map((x) => (
        <Box marginTop={2}>
          <ActionCard
            translateLabel="no"
            heading={
              x.caseNumber ??
              formatMessage(messages.courtCaseNumberNotRegistered)
            }
            text={x.type}
            tag={{ label: x.status, variant: 'blue', outlined: false }}
            cta={{
              label: formatMessage(messages.seeInfo),
              variant: 'text',
              url: LawAndOrderPaths.CourtCaseDetail.replace(
                ':id',
                x.data.id.toString(),
              ),
            }}
          />
        </Box>
      ))}
    </Box>
  )
}
export default CourtCases
