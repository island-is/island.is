import { Advice, Case } from '../../types/viewModels'
import format from 'date-fns/format'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import EyebrowsWithSeperator from '../EyebrowsWithSeperator/EyebrowsWithSeperator'
import * as styles from './CaseOverview.css'
import CaseStatusCard from '../CaseStatusCard/CaseStatusCard'

interface CaseOverviewProps {
  chosenCase: Case
  advices?: Array<Advice>
}

export const CaseOverview = ({ chosenCase }: CaseOverviewProps) => {
  const upperInstances = [
    {
      text: `Mál nr. ${chosenCase?.caseNumber}`,
    },
    {
      text: `Birt: ${format(new Date(chosenCase?.created), 'dd.MM.yyyy')}`,
    },
  ]

  const lowerInstances = [
    {
      text: `${chosenCase?.type}`,
    },
    {
      text: `${chosenCase?.institution}`,
    },
    {
      text: `${chosenCase?.policyArea}`,
    },
  ]

  return (
    <Stack space={[4, 4, 4, 6, 6]}>
      <Stack space={3}>
        <EyebrowsWithSeperator
          instances={upperInstances}
          color="purple400"
          style={styles.upperSeperator}
          wrap={false}
          truncate={true}
        />
        <EyebrowsWithSeperator
          instances={lowerInstances}
          color="blue600"
          style={styles.lowerSeperator}
          wrap={false}
          truncate={true}
        />
        <Text variant="h1" color="blue400">
          {chosenCase?.name}
        </Text>
      </Stack>
      <CaseStatusCard status={chosenCase?.status} />
      <Stack space={[3, 3, 3, 4, 4]}>
        <Box>
          <Text variant="h4">Málsefni</Text>
          <Text variant="default">{chosenCase?.announcementText}</Text>
        </Box>
        <Box>
          <Text variant="h4">Nánar um málið</Text>
          <Text variant="default">{chosenCase.detailedDescription}</Text>
        </Box>
      </Stack>
    </Stack>
  )
}

export default CaseOverview