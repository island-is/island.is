import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { mockList } from '../../lib/utils'
import { m } from '../../lib/messages'
import Signees from './signees'
import PaperUpload from './paperUpload'

const ViewList = () => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box>
        <Text variant="h3">{mockList.name}</Text>
      </Box>
      <Box
        marginTop={5}
        display={['block', 'flex']}
        justifyContent="spaceBetween"
        width={'half'}
      >
        <Box>
          <Text variant="h5">{formatMessage(m.listPeriod)}</Text>
          <Text>{mockList.period}</Text>
        </Box>
        <Box>
          <Text variant="h5">{formatMessage(m.numberOfSigns)}</Text>
          <Text>{mockList.votes}</Text>
        </Box>
      </Box>
      <Box marginTop={5}>
        <Text variant="h5">{formatMessage(m.coOwners)}</Text>
        {mockList.people.map((person) => (
          <Box
            key={person}
            width="half"
            marginBottom={[2, 0]}
            display={['block', 'flex']}
            justifyContent="spaceBetween"
          >
            <Text>{person}</Text>
            <Text>{'010105-1450'}</Text>
          </Box>
        ))}
      </Box>
      <Signees />
      <PaperUpload />
    </>
  )
}

export default ViewList
