import { Tabs, TabType } from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  m,
  IntroWrapper,
  RIKISLOGREGLUSTJORI_SLUG,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import PoliceCases from '../PoliceCases/PoliceCases'
import { useState } from 'react'
import CourtCases from '../CourtCases/CourtCases'

const CASE_TAB_TYPES = [
  RIKISLOGREGLUSTJORI_SLUG,
  DOMSMALARADUNEYTID_SLUG,
] as const
type CaseTabType = typeof CASE_TAB_TYPES[number]

const LawAndOrderOverview = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const [selectedTab, setSelectedTab] = useState<CaseTabType>(
    RIKISLOGREGLUSTJORI_SLUG,
  )

  const tabs: Array<TabType> = [
    {
      id: RIKISLOGREGLUSTJORI_SLUG,
      label: formatMessage(m.policeCases),
      content: <PoliceCases />,
    },
    {
      id: DOMSMALARADUNEYTID_SLUG,
      label: formatMessage(m.courtCases),
      content: <CourtCases />,
    },
  ]
  return (
    <IntroWrapper
      title={m.myCases}
      intro={m.myCasesIntro}
      serviceProviderSlug={selectedTab}
      serviceProviderTooltip={formatMessage(
        selectedTab === RIKISLOGREGLUSTJORI_SLUG
          ? m.nationalPoliceCommissionerTooltip
          : m.domsmalaraduneytidTooltip,
      )}
    >
      <Tabs
        label={formatMessage(messages.cancel)}
        tabs={tabs}
        contentBackground="transparent"
        selected="0"
        onChange={(index) => {
          setSelectedTab(index as CaseTabType)
        }}
        onlyRenderSelectedTab
        size="xs"
      />
    </IntroWrapper>
  )
}
export default LawAndOrderOverview
