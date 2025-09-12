import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useParams } from 'react-router-dom'
import { useGetSignatureList } from '../../../../hooks'
import format from 'date-fns/format'
import Signees from '../../../shared/Signees'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'
import ListActions from './ListActions'

const collectionType = SignatureCollectionCollectionType.Presidential

const ViewList = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { id } = useParams() as { id: string }
  const { listInfo, loadingList } = useGetSignatureList(id, collectionType)

  return (
    <Box>
      {!loadingList && !!listInfo && (
        <Stack space={5}>
          <Text variant="h3">
            {listInfo.candidate.name + ' - ' + listInfo.area.name}
          </Text>
          <Box>
            <Text variant="h5">{formatMessage(m.listPeriod)}</Text>
            <Text>
              {`${format(
                new Date(listInfo.startTime),
                'dd.MM.yyyy',
              )} - ${format(new Date(listInfo.endTime), 'dd.MM.yyyy')}`}
            </Text>
            <ListActions listId={listInfo.id} />
            <Divider />
          </Box>
          <Signees
            collectionType={collectionType}
            totalSignees={listInfo?.numberOfSignatures ?? 0}
          />
        </Stack>
      )}
    </Box>
  )
}

export default ViewList
