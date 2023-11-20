import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { mockSingleList } from '../../lib/utils'
import { m } from '../../lib/messages'
import Signees from './signees'
import PaperUpload from './paperUpload'
import { useLocation } from 'react-router-dom'
import { useGetSignatureList } from '../hooks'
import format from 'date-fns/format'

const ViewList = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { pathname } = useLocation()
  const listId = pathname.replace('/min-gogn/medmaelalistar/', '')
  const { listInfo, loadingList } = useGetSignatureList(listId)

  return (
    <>
      {!loadingList && (
        <Stack space={5}>
          <Box>
            <Text variant="h3">
              {listInfo.owner.name + ' - ' + listInfo.area.name}
            </Text>
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
              <Text>{0}</Text>
            </Box>
            <Box marginTop={[2, 0]}>
              <Text variant="h5">{formatMessage('Eitthvað meir:')}</Text>
              <Text>{formatMessage(m.tempMessage)}</Text>
            </Box>
          </Box>
          <Box>
            <Text marginTop={[2, 0]} variant="h5">
              {formatMessage(m.coOwners)}
            </Text>
            {mockSingleList.people.map((person) => (
              <Box
                key={person.id}
                width="half"
                marginBottom={[2, 0]}
                display={['block', 'flex']}
                justifyContent="spaceBetween"
              >
                <Text>{person.name}</Text>
              </Box>
            ))}
          </Box>
          <Signees />
          <PaperUpload />
        </Stack>
      )}
    </>
  )
}

export default ViewList
