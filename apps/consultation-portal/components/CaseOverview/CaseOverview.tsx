import { Box, Stack, Text } from '@island.is/island-ui/core'
import EyebrowsWithSeperator from '../EyebrowsWithSeperator/EyebrowsWithSeperator'
import * as styles from './CaseOverview.css'
import CaseStatusCard from '../CaseStatusCard/CaseStatusCard'
import { getShortDate } from '../../utils/helpers/dateFormatter'
import { Case, UserAdvice } from '../../types/interfaces'

interface CaseOverviewProps {
  chosenCase: Case
  advices?: Array<UserAdvice>
}

export const CaseOverview = ({ chosenCase }: CaseOverviewProps) => {
  const upperInstances = [
    `Mál nr. S-${chosenCase?.caseNumber}`,
    `Birt: ${getShortDate(chosenCase.created)}`,
  ]

  const lowerInstances = [
    `${chosenCase?.typeName}`,
    `${chosenCase?.institutionName}`,
    `${chosenCase?.policyAreaName}`,
  ]
  return (
    <Stack space={[4, 4, 4, 6, 6]}>
      <Stack space={3}>
        <EyebrowsWithSeperator
          instances={upperInstances}
          color="purple400"
          style={styles.upperSeperator}
          wrap={false}
          truncate={false}
        />
        <EyebrowsWithSeperator
          instances={lowerInstances}
          color="blue600"
          style={styles.lowerSeperator}
          wrap={true}
          truncate={false}
        />
        <Text variant="h1" color="blue400">
          {chosenCase?.name}
        </Text>
      </Stack>
      <CaseStatusCard status={chosenCase?.statusName} />
      <Stack space={[3, 3, 3, 4, 4]}>
        <Box>
          <Text variant="h4">Málsefni</Text>
          <Text variant="default">{chosenCase?.announcementText}</Text>
        </Box>
        <Box>
          <Text variant="h4">Nánari upplýsingar</Text>
          <Text variant="default">{chosenCase.detailedDescription}</Text>
        </Box>
      </Stack>
    </Stack>
  )
}

export default CaseOverview
