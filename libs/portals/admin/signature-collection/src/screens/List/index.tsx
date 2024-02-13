import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import Signees from './components/signees'
import ActionExtendDeadline from './components/extendDeadline'
import ActionReviewComplete from './components/completeReview'
import PaperUpload from './components/paperUpload'
import ListInfo from './components/listInfoAlert'
import electionsCommitteeLogo from '../../../assets/electionsCommittee.svg'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { format as formatNationalId } from 'kennitala'
import { ListStatus } from '../../lib/utils'

export const List = ({ allowedToProcess }: { allowedToProcess: boolean }) => {
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }
  const { formatMessage } = useLocale()

  console.log('list', listStatus)

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

              <ListInfo
                message={
                  listStatus === ListStatus.Extendable
                    ? formatMessage(m.listStatusExtendableAlert)
                    : listStatus === ListStatus.InReview
                    ? formatMessage(m.listStatusInReviewAlert)
                    : listStatus === ListStatus.Reviewed
                    ? formatMessage(m.listStatusReviewedStatusAlert)
                    : formatMessage(m.listStatusActiveAlert)
                }
                type={
                  listStatus === ListStatus.Reviewed ? 'success' : undefined
                }
              />
              {!!list.collectors?.length &&
                list.collectors.map((collector) => (
                  <Box key={collector.name} marginBottom={5}>
                    <Text variant="eyebrow">{formatMessage(m.collectors)}</Text>
                    <Text>
                      {collector.name +
                        ' ' +
                        '(' +
                        formatNationalId(collector.nationalId) +
                        ')'}
                    </Text>
                  </Box>
                ))}
              <ActionExtendDeadline
                listId={list.id}
                endTime={list.endTime}
                allowedToProcess={
                  allowedToProcess && listStatus === ListStatus.Extendable
                }
              />
              <Signees numberOfSignatures={list.numberOfSignatures ?? 0} />
              {allowedToProcess && (
                <>
                  <PaperUpload listId={list.id} listStatus={listStatus} />
                  <ActionReviewComplete
                    listId={list.id}
                    listStatus={listStatus}
                  />
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
