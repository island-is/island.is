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
  Text,
} from '@island.is/island-ui/core'
import { format as formatNationalId } from 'kennitala'
import Signees from '../../shared-components/signees'
import ActionDrawer from '../../shared-components/compareLists/ActionDrawer'
import { PaperSignees } from '../../shared-components/paperSignees'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { SignatureCollectionPaths } from '../../lib/paths'
import { Actions } from '../../shared-components/compareLists/ActionDrawer/ListActions'

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
          <Box marginBottom={2}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(m.signatureListsTitlePresidential),
                  href: `/stjornbord${SignatureCollectionPaths.PresidentialLists}`,
                },
                {
                  title: list.title,
                },
              ]}
            />
          </Box>
          {!!list && (
            <>
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
                      Actions.RemoveCandidate,
                    ]}
                  />
                }
                marginBottom={4}
              />
              <Divider />
              <Box marginTop={9} />
              {!!list.collectors?.length && (
                <Box marginBottom={5}>
                  <Text variant="h5">{formatMessage(m.collectors)}</Text>
                  {list.collectors?.map((collector) => (
                    <Text variant="medium" key={collector.name}>
                      {collector.name +
                        ' ' +
                        '(' +
                        formatNationalId(collector.nationalId) +
                        ')'}
                    </Text>
                  ))}
                </Box>
              )}
              <Signees list={list} />
              <PaperSignees listId={list.id} />
            </>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
