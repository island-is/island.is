import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { mockList } from '../../lib/utils'
import { m } from '../../lib/messages'
import Signees from './signees'
import PaperUpload from './paperUpload'
import { CopyLink } from '@island.is/application/ui-components'

const ViewList = () => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={5}>
      <Box>
        <Text variant="h3">{mockList.name}</Text>
      </Box>
      <Box display={['block', 'flex']} justifyContent="spaceBetween">
        <Box>
          <Text variant="h5">{formatMessage(m.listPeriod)}</Text>
          <Text>{mockList.period}</Text>
        </Box>
        <Box marginTop={[2, 0]}>
          <Text variant="h5">{formatMessage(m.numberOfSigns)}</Text>
          <Text>{mockList.votes}</Text>
        </Box>
        <Box marginTop={[2, 0]}>
          <Text variant="h5">{formatMessage('Eitthvað meir:')}</Text>
          <Text>{'Lorem'}</Text>
        </Box>
      </Box>
      <Box>
        <Text variant="h5">{formatMessage(m.coOwners)}</Text>
        {mockList.people.map((person) => (
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
