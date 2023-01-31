import { Box, GridRow, Text } from '@island.is/island-ui/core'
import CaseStatusCard from './CaseStatusCard'
import { Advice, Case } from '../../../types/viewModels'
import { format } from 'date-fns'

interface CaseOverviewProps {
  chosenCase: Case
  advices?: Array<Advice>
}

const CaseOverview: React.FC<CaseOverviewProps> = ({ chosenCase }) => {
  const datePublished = format(new Date(chosenCase.created), 'dd.MM.yyyy')

  return (
    <Box>
      <GridRow>
        <Box
          marginRight={1}
          borderRightWidth={'standard'}
          borderColor={'purple300'}
          paddingRight={1}
          paddingLeft={2}
        >
          <Text variant="eyebrow" color="purple400">
            {'Mál nr.'} {chosenCase.caseNumber}
          </Text>
        </Box>
        <Box>
          <Text variant="eyebrow" color="purple400">
            {'Birt'} {datePublished}
          </Text>
        </Box>
      </GridRow>
      <GridRow marginTop={3}>
        <Box
          marginRight={1}
          borderRightWidth={'standard'}
          borderColor={'blue200'}
          paddingRight={1}
          paddingLeft={2}
        >
          {' '}
          <Text variant="eyebrow" color="blue400">
            {chosenCase.type}
          </Text>
        </Box>
        <Box
          marginRight={2}
          borderRightWidth={'standard'}
          borderColor={'blue200'}
          paddingRight={1}
        >
          {' '}
          <Text variant="eyebrow" color="blue400">
            {chosenCase.institution}
          </Text>
        </Box>
        <Text variant="eyebrow" color="blue400">
          {chosenCase.policyArea}
        </Text>
      </GridRow>
      <Box marginBottom={4} paddingTop={2}>
        <Text variant="h1" color="blue400">
          {chosenCase.name}
        </Text>
        <CaseStatusCard />
        <Box marginBottom={6} marginTop={4}>
          <Text variant="h4">{'Málsefni'}</Text>
          <Text variant="default">{chosenCase.announcementText}</Text>
        </Box>
        <Box>
          <Text variant="h4">{'Nánar um málið'}</Text>
          <Text variant="default">{chosenCase.detailedDescription}</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default CaseOverview
