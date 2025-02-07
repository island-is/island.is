import {
  ActionCard,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import ScreenHeader from '../../shared-components/screenHeader'

const LandAreas = () => {
  const { formatMessage } = useLocale()
  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <PortalNavigation
            navigation={signatureCollectionNavigation}
            title={formatMessage(m.signatureListsTitle)}
          />
        </GridColumn>

        <GridColumn
          paddingTop={[5, 5, 5, 0]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          <ScreenHeader
            electionName={formatMessage(m.municipalCollectionTitle)}
            intro={formatMessage(m.municipalCollectionIntro)}
            image={nationalRegistryLogo}
          />
          <ActionCard
            key={'test'}
            eyebrow={'Höfuðborgarsvæði (3000)'}
            heading={'Reykjavík'}
            text={'Fjöldi framboða: 12'}
            cta={{
              label: 'Skoða sveitarfélag',
              variant: 'text',
              icon: 'arrowForward',
              onClick: () => {
                console.log('hæjjaaa')
              },
            }}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default LandAreas
