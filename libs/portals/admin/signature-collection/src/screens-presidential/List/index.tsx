import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { useLoaderData } from 'react-router-dom'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionList,
} from '@island.is/api/schema'
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
import PaperUpload from './components/paperUpload'
import ListInfo from '../../shared-components/listInfoAlert'
import electionsCommitteeLogo from '../../../assets/electionsCommittee.svg'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import { format as formatNationalId } from 'kennitala'
import { ListStatus } from '../../lib/utils'
import ActionReviewComplete from '../../shared-components/completeReview'
import Signees from '../../shared-components/signees'
import ActionExtendDeadline from '../../shared-components/extendDeadline'

export const List = ({ allowedToProcess }: { allowedToProcess: boolean }) => {
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
                    : listStatus === ListStatus.Inactive
                    ? formatMessage(m.listStatusReviewedStatusAlert)
                    : formatMessage(m.listStatusActiveAlert)
                }
                type={
                  listStatus === ListStatus.Reviewed ? 'success' : undefined
                }
              />
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
              <Box marginBottom={5}>
                <Text variant="h5">{formatMessage(m.candidateNationalId)}</Text>
                <Text variant="medium">
                  {formatNationalId(list.candidate.nationalId)}
                </Text>
              </Box>
              <ActionExtendDeadline
                listId={list.id}
                endTime={list.endTime}
                collectionType={SignatureCollectionCollectionType.Presidential}
                allowedToProcess={
                  allowedToProcess && listStatus === ListStatus.Extendable
                }
              />
              <Signees numberOfSignatures={list.numberOfSignatures ?? 0} />
              {allowedToProcess && (
                <>
                  <PaperUpload listId={list.id} listStatus={listStatus} />
                  <ActionReviewComplete
                    collectionType={
                      SignatureCollectionCollectionType.Presidential
                    }
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
