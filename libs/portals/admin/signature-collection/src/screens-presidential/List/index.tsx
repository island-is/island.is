import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData } from 'react-router-dom'
import {
  SignatureCollectionList,
} from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  Box,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import PaperUpload from './components/paperUpload'
import electionsCommitteeLogo from '../../../assets/electionsCommittee.svg'
import { format as formatNationalId } from 'kennitala'
import Signees from '../../shared-components/signees'
import ActionDrawer from '../../shared-components/compareLists/ActionDrawer'

export const List = () => {
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
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
          {!!list && (
            <>
              <IntroHeader
                title={list.title}
                intro={formatMessage(m.singleListIntro)}
                img={electionsCommitteeLogo}
                imgPosition="right"
                imgHiddenBelow="sm"
                marginBottom={3}
                buttonGroup={<ActionDrawer />}
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
              <Signees numberOfSignatures={list.numberOfSignatures ?? 0} />
              <PaperUpload listId={list.id} listStatus={listStatus} />
            </>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
