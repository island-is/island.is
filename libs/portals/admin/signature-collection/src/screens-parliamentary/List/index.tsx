import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { m } from '../../lib/messages'
import { useLoaderData } from 'react-router-dom'
import {
  ListStatus,
  SignatureCollectionCollectionType,
  SignatureCollectionList,
} from '@island.is/api/schema'
import { PaperSignees } from './paperSignees'
import { SignatureCollectionPaths } from '../../lib/paths'
import ActionExtendDeadline from '../../shared-components/extendDeadline'
import Signees from '../../shared-components/signees'
import ActionReviewComplete from '../../shared-components/completeListReview'
import electionsCommitteeLogo from '../../../assets/electionsCommittee.svg'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'

const List = ({ allowedToProcess }: { allowedToProcess: boolean }) => {
  const { formatMessage } = useLocale()
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }

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
          <Box marginBottom={3}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(m.parliamentaryCollectionTitle),
                  href: `/stjornbord${SignatureCollectionPaths.ParliamentaryRoot}`,
                },
                {
                  title: list.area.name,
                  href: `/stjornbord${SignatureCollectionPaths.ParliamentaryConstituency.replace(
                    ':constituencyName',
                    list.area.name,
                  )}`,
                },
                { title: list.candidate.name },
              ]}
            />
          </Box>
          <IntroHeader
            title={list?.title}
            intro={
              allowedToProcess
                ? formatMessage(m.singleListIntro)
                : formatMessage(m.singleListIntroManage)
            }
            imgPosition="right"
            imgHiddenBelow="sm"
            img={
              allowedToProcess ? electionsCommitteeLogo : nationalRegistryLogo
            }
          />
          <ActionExtendDeadline
            collectionType={SignatureCollectionCollectionType.Parliamentary}
            listId={list.id}
            endTime={list.endTime}
            allowedToProcess={
              allowedToProcess && listStatus === ListStatus.Extendable
            }
          />
          {((allowedToProcess && !list.active) || !allowedToProcess) && (
            <Signees numberOfSignatures={list.numberOfSignatures ?? 0} />
          )}
          {allowedToProcess && (
            <Box>
              {!list.active && !list.reviewed && (
                <PaperSignees listId={list.id} />
              )}
              <ActionReviewComplete
                listId={list.id}
                listStatus={listStatus}
                collectionType={SignatureCollectionCollectionType.Parliamentary}
              />
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
