import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { mockSingleList } from '../../lib/utils'
import { m } from '../../lib/messages'
import Signees from './signees'
import PaperUpload from './paperUpload'
import { CopyLink } from '@island.is/application/ui-components'

const ViewList = () => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={5}>
      <Box>
        <Text variant="h3">{mockSingleList.name}</Text>
      </Box>
      <Box display={['block', 'flex']} justifyContent="spaceBetween">
        <Box>
          <Text variant="h5">{formatMessage(m.listPeriod)}</Text>
          <Text>{mockSingleList.period}</Text>
        </Box>
        <Box marginTop={[2, 0]}>
          <Text variant="h5">{formatMessage(m.numberOfSigns)}</Text>
          <Text>{mockSingleList.votes}</Text>
        </Box>
        <Box marginTop={[2, 0]}>
          <Text variant="h5">{formatMessage('Eitthvað meir:')}</Text>
          <Text>{formatMessage(m.tempMessage)}</Text>
        </Box>
      </Box>
      <Box>
        <Text variant="h5">{formatMessage(m.coOwners)}</Text>
        {mockSingleList.people.map((person) => (
          <Box
            key={person.name}
            width="half"
            marginBottom={[2, 0]}
            display={['block', 'flex']}
            justifyContent="spaceBetween"
          >
            <Text>{person.name}</Text>
          </Box>
        ))}
      </Box>
      <CopyLink
        linkUrl={`${document.location.origin}/umsoknir/maela-med-lista/`}
        buttonTitle={formatMessage(m.copyLink)}
      />
      <Signees />
      <PaperUpload />
    </Stack>
  )
}

export default ViewList
