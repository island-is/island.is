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
  SignatureCollectionList,
} from '@island.is/api/schema'
import { PaperSignees } from './paperSignees'
import { SignatureCollectionPaths } from '../../lib/paths'
import Signees from '../../shared-components/signees'
import electionsCommitteeLogo from '../../../assets/electionsCommittee.svg'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'

const List = () => {
  const { formatMessage } = useLocale()
  const { list } = useLoaderData() as {
    list: SignatureCollectionList
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
              formatMessage(m.singleListIntro)
            }
            imgPosition="right"
            imgHiddenBelow="sm"
            img={
              electionsCommitteeLogo
            }
          />

          <Signees numberOfSignatures={list.numberOfSignatures ?? 0} />
          <PaperSignees listId={list.id} />

          {/*<ActionExtendDeadline
            collectionType={SignatureCollectionCollectionType.Parliamentary}
            listId={list.id}
            endTime={list.endTime}
          /><ActionReviewComplete
              listId={list.id}
              listStatus={listStatus}
              collectionType={SignatureCollectionCollectionType.Parliamentary}
            />*/}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
