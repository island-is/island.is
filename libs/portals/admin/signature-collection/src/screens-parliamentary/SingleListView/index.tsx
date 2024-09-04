import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { m, parliamentaryMessages } from '../../lib/messages'
import ActionExtendDeadline from '../components/extendDeadline'
import Signees from '../components/signees'
import ActionReviewComplete from '../components/completeReview'

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
            title={'Norðausturkjördæmi - Listi A'}
            intro={formatMessage(parliamentaryMessages.signatureListsIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
          />
          <ActionExtendDeadline listId={'1'} endTime={'2021-09-30T00:00:00Z'} />
          <Signees numberOfSignatures={0} />
          <ActionReviewComplete listId={'1'} />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default SingleListView
