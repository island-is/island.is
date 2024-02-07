import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import Signees from './components/signees'
import ActionExtendDeadline from './components/extendDeadline'
import ActionReviewComplete from './components/completeReview'
import PaperUpload from './components/paperUpload'
import ListReviewedAlert from './components/listReviewedAlert'
import electionsCommitteeLogo from '../../../assets/electionsCommittee.svg'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'

export const List = ({ allowedToProcess }: { allowedToProcess: boolean }) => {
  const { list } = useLoaderData() as { list: SignatureCollectionList }
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
          paddingTop={[5, 5, 5, 2]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          {!!list && (
            <>
              <IntroHeader
                title={list.title}
                intro={
                  allowedToProcess
                    ? formatMessage(m.singleListIntro)
                    : formatMessage(m.singleListIntroManage)
                }
                img={
                  allowedToProcess
                    ? electionsCommitteeLogo
                    : nationalRegistryLogo
                }
                imgPosition="right"
                imgHiddenBelow="sm"
              />
              <ListReviewedAlert />
              <ActionExtendDeadline
                listId={list.id}
                endTime={list.endTime}
                allowedToProcess={allowedToProcess}
              />
              <Signees numberOfSignatures={list.numberOfSignatures ?? 0} />
              {allowedToProcess && (
                <>
                  <PaperUpload listId={list.id} />
                  <ActionReviewComplete />
                </>
              )}
            </>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
