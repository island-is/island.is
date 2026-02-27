import { Box, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapper } from '@island.is/portals/my-pages/core'
import { ATVINNUVEGARADUNEYTID_SLUG } from '@island.is/portals/my-pages/core'
import { farmerLandsMessages } from '../../../lib/messages'
import RightsHolders from './RightsHolders/RightHolders'
import LandRegistry from './LandRegistry/LandRegistry'
import Subsidies from './Subsidies/Subsidies'

export const Detail = () => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()

  const tabs = [
    {
      label: 'Handhafar',
      content: <RightsHolders />,
    },
    {
      label: 'Jarðaskrá',
      content: <LandRegistry />,
    },
    {
      label: 'Stuðningsgreiðslur',
      content: <Subsidies />,
    },
  ]

  return (
    <IntroWrapper
      title={formatMessage(farmerLandsMessages.title)}
      intro={formatMessage(farmerLandsMessages.description)}
      serviceProviderSlug={ATVINNUVEGARADUNEYTID_SLUG}
      span={'5/12'}
    >
      <Tabs
        label="Velja flipa"
        tabs={tabs}
        contentBackground="transparent"
        selected="0"
        size="xs"
      />
    </IntroWrapper>
  )
}

export default Detail
