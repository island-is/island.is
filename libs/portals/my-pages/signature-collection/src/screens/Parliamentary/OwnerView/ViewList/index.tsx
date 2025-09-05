import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useParams } from 'react-router-dom'
import { useGetSignatureList } from '../../../../hooks'
import format from 'date-fns/format'
import Signees from '../../../shared/Signees'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

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
      {!loadingList && !!listInfo && (
        <Stack space={5}>
          <Box>
            <Text variant="h3">{listInfo.title}</Text>
          </Box>
          <Box display="block">
            <Box>
              <Text variant="h4">{formatMessage(m.listPeriod)}</Text>
              <Text>
                {format(new Date(listInfo.startTime), 'dd.MM.yyyy') +
                  ' - ' +
                  format(new Date(listInfo.endTime), 'dd.MM.yyyy')}
              </Text>
            </Box>
            <Box marginTop={5}>
              {!!listInfo?.collectors?.length && (
                <>
                  <Text marginTop={[2, 0]} variant="h4">
                    {formatMessage(m.coOwners)}
                  </Text>
                  {listInfo?.collectors?.map((collector) => (
                    <Box
                      key={collector.name}
                      width="half"
                      display={['block', 'flex']}
                      justifyContent="spaceBetween"
                    >
                      <Text>{collector.name}</Text>
                    </Box>
                  ))}
                </>
              )}
            </Box>
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
