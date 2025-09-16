import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useParams } from 'react-router-dom'
import { useGetSignatureList } from '../../../../hooks'
import format from 'date-fns/format'
import Signees from '../../../shared/Signees'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import ListActions from './ListActions'
import { Skeleton } from '../../../../lib/skeletons'

const collectionType = SignatureCollectionCollectionType.Parliamentary

const ViewList = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { id } = useParams<{ id: string }>()
  const { listInfo, loadingList } = useGetSignatureList(
    id || '',
    collectionType,
  )

  return (
    <Box>
      {!loadingList && !!listInfo ? (
        <Stack space={5}>
          <Text variant="h3">
            {`${listInfo.title} - ${listInfo.area.name}`}
          </Text>
          <Box>
            <Text variant="h4">{formatMessage(m.listPeriod)}</Text>
            <Text>
              {`${format(
                new Date(listInfo.startTime),
                'dd.MM.yyyy',
              )} - ${format(new Date(listInfo.endTime), 'dd.MM.yyyy')}`}
            </Text>
            <ListActions list={listInfo} />
            <Divider />
          </Box>
          <Signees
            collectionType={collectionType}
            totalSignees={listInfo?.numberOfSignatures ?? 0}
          />
        </Stack>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default ViewList
