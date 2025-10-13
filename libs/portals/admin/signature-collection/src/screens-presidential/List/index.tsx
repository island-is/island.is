import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  Box,
  Breadcrumbs,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import Signees from '../../shared-components/signees'
import ActionDrawer from '../../shared-components/actionDrawer'
import { PaperSignees } from '../../shared-components/paperSignees'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { SignatureCollectionPaths } from '../../lib/paths'
import { Actions } from '../../shared-components/actionDrawer/ListActions'

export const List = () => {
  const { list } = useLoaderData() as {
    list: SignatureCollectionList
  }
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
          <Box marginBottom={3}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(m.signatureListsTitlePresidential),
                  href: `/stjornbord${SignatureCollectionPaths.PresidentialListOfCandidates}`,
                },
                {
                  title: list?.candidate.name,
                  href: `/stjornbord${SignatureCollectionPaths.PresidentialCandidateLists.replace(
                    ':candidateId',
                    list?.candidate.id || '',
                  )}`,
                },
                {
                  title: list.area.name,
                },
              ]}
            />
          </Box>
          {!!list && (
            <Box>
              <IntroHeader
                title={list.title}
                intro={formatMessage(m.singleListIntro)}
                img={nationalRegistryLogo}
                imgPosition="right"
                imgHiddenBelow="sm"
                buttonGroup={
                  <ActionDrawer
                    allowedActions={[
                      Actions.LockList,
                      Actions.ReviewComplete,
                      Actions.ExtendDeadline,
                    ]}
                    withManagers
                  />
                }
                marginBottom={3}
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
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
