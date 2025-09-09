import {
  Box,
  Breadcrumbs,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { m } from '../../lib/messages'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import { SignatureCollectionPaths } from '../../lib/paths'
import Signees from '../../shared-components/signees'
import ActionDrawer from '../../shared-components/actionDrawer'
import { PaperSignees } from '../../shared-components/paperSignees'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { Actions } from '../../shared-components/actionDrawer/ListActions'

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
            intro={formatMessage(m.singleListIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
            img={nationalRegistryLogo}
            buttonGroup={
              <ActionDrawer
                allowedActions={[
                  Actions.LockList,
                  Actions.ReviewComplete,
                  Actions.ExtendDeadline,
                  Actions.RemoveList,
                ]}
                withManagers
              />
            }
            marginBottom={4}
          />
          <Divider />
          <Box marginTop={9} />
          <Signees list={list} />
          {!list.reviewed && (
            <PaperSignees
              listId={list.id}
              collectionType={list.collectionType}
            />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
