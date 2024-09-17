import { Box, Button, Stack, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useParams } from 'react-router-dom'
import { useGetSignatureList } from '../../../../hooks'
import format from 'date-fns/format'
import Signees from './Signees'
import CancelCollection from '../modals/CancelCollection'
import copyToClipboard from 'copy-to-clipboard'

const ViewList = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { id } = useParams()
  const { listInfo, loadingList } = useGetSignatureList(id || '')

  return (
    <Box>
      {!loadingList && !!listInfo && (
        <Stack space={5}>
          <Box>
            <Text variant="h3">{listInfo.title}</Text>
          </Box>
          <Box display={['block', 'flex']} justifyContent="spaceBetween">
            <Box>
              <Text variant="h5">{formatMessage(m.listPeriod)}</Text>
              <Text>
                {format(new Date(listInfo.startTime), 'dd.MM.yyyy') +
                  ' - ' +
                  format(new Date(listInfo.endTime), 'dd.MM.yyyy')}
              </Text>
            </Box>
            <Box marginTop={[2, 0]}>
              <Text variant="h5">{formatMessage(m.numberOfSigns)}</Text>
              <Text>{listInfo?.numberOfSignatures}</Text>
            </Box>
            <Box marginTop={[2, 0]}>
              {!!listInfo?.collectors?.length && (
                <>
                  <Text marginTop={[2, 0]} variant="h5">
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
          <Box
            background="purple100"
            borderRadius="large"
            display={['block', 'flex', 'flex']}
            justifyContent="spaceBetween"
            alignItems="center"
            padding={3}
            marginY={2}
          >
            <Box marginHeight={5}>
              <Text marginBottom={[2, 0, 0]}>
                {formatMessage(m.copyLinkDescription)}
              </Text>
            </Box>
            <Button
              onClick={() => {
                const copied = copyToClipboard(
                  `${document.location.origin}${listInfo.collectionId}`,
                )
                if (!copied) {
                  return toast.error(formatMessage(m.copyLinkError))
                }
                toast.success(formatMessage(m.copyLinkSuccess))
              }}
              variant="utility"
              icon="link"
            >
              {formatMessage(m.copyLinkButton)}
            </Button>
          </Box>
          <Signees />

          <CancelCollection listId={listInfo.id} />
        </Stack>
      )}
    </Box>
  )
}

export default ViewList
