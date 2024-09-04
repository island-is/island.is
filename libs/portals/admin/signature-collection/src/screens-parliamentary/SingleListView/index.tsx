import {
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { m, parliamentaryMessages } from '../../lib/messages'

const SingleListView = () => {
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
          <IntroHeader
            title={'Listi A'}
            intro={formatMessage(parliamentaryMessages.signatureListsIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default SingleListView
