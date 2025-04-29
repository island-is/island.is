import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useParams } from 'react-router-dom'
import { useGetSignatureList } from '../../../../hooks'
import format from 'date-fns/format'
import Signees from '../../../shared/Signees'
import ListActions from './ListActions'

const ViewList = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { id } = useParams() as { id: string }
  const { listInfo } = useGetSignatureList(id || '')

  return (
    <Stack space={5}>
      <Text variant="h3">
        {listInfo?.title ?? 'Test - Borgarbyggð Framboð A'}
      </Text>
      <Box>
        <Text variant="h5">{formatMessage(m.listPeriod)}</Text>
        <Text>
          {format(new Date(listInfo?.startTime ?? new Date()), 'dd.MM.yyyy') +
            ' - ' +
            format(new Date(listInfo?.endTime ?? new Date()), 'dd.MM.yyyy')}
        </Text>
        <ListActions />
        <Divider />
      </Box>
      <Signees />
    </Stack>
  )
}

export default ViewList
