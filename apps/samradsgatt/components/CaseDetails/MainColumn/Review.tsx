import { Box, Text } from '@island.is/island-ui/core'
import { format } from 'date-fns'
import { Advice } from '../../../types/viewModels'

interface Props {
  key: number
  advice: Advice
}

const Review: React.FC<Props> = ({ advice }) => {
  return (
    <Box
      marginBottom={6}
      borderColor="blue300"
      borderWidth="standard"
      padding={3}
      borderStyle="solid"
      borderRadius="standard"
    >
      <Text variant="eyebrow" color="purple400">
        {format(new Date(advice.created), 'dd.MM.yyyy')}
      </Text>
      <Text variant="h3">
        {advice.number} - {advice.participantName}
      </Text>
      <Text variant="default">{advice.content}</Text>
    </Box>
  )
}

export default Review
