import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useParams } from 'react-router-dom'
import { useGetSignatureList } from '../../../../hooks'
import format from 'date-fns/format'
import Signees from '../../../shared/Signees'
import ListActions from './ListActions'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

const collectionType = SignatureCollectionCollectionType.LocalGovernmental

const ViewList = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { id } = useParams() as { id: string }
  const { listInfo } = useGetSignatureList(id || '', collectionType)

  return (
    <Box>
      {listInfo && (
        <Stack space={5}>
          <Text variant="h3">{listInfo.title}</Text>
          <Box>
            <Text variant="h5">{formatMessage(m.listPeriod)}</Text>
            <Text>
              {format(
                new Date(listInfo.startTime ?? new Date()),
                'dd.MM.yyyy',
              ) +
                ' - ' +
                format(new Date(listInfo.endTime ?? new Date()), 'dd.MM.yyyy')}
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
