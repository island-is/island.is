import { Box, Stack, Text } from '@island.is/island-ui/core'
import { Eyebrows } from '../../../../components'
import * as styles from './CaseOverview.css'
import CaseStatusCard from '../CaseStatusCard/CaseStatusCard'
import {
  getShortDate,
  hasDatePassed,
} from '../../../../utils/helpers/dateFunctions'
import { Case, UserAdvice } from '../../../../types/interfaces'
import localization from '../../Case.json'

interface CaseOverviewProps {
  chosenCase: Case
  advices?: Array<UserAdvice>
}

export const CaseOverview = ({ chosenCase }: CaseOverviewProps) => {
  const loc = localization['caseOverview']

  const upperInstances = [
    `${loc.upperInstances.case} S-${chosenCase?.caseNumber}`,
    `${loc.upperInstances.show}: ${getShortDate(chosenCase.created)}`,
    `${loc.upperInstances.advicesCount}: ${chosenCase?.adviceCount}`,
  ]

  const lowerInstances = [
    `${chosenCase?.typeName}`,
    `${chosenCase?.institutionName}`,
    `${chosenCase?.policyAreaName}`,
  ]

  const chosenCaseSplitted = chosenCase?.detailedDescription?.split('\n')

  return (
    <Stack space={[4, 4, 4, 6, 6]}>
      <Stack space={3}>
        <Box display={'flex'} justifyContent={'spaceBetween'}>
          <Eyebrows
            instances={upperInstances}
            color="purple400"
            style={styles.upperSeperator}
            wrap={false}
            truncate={false}
          />
        </Box>
        <Eyebrows
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
      {chosenCase.statusName === 'Niðurstöður birtar' &&
        hasDatePassed(chosenCase.summaryDate) && (
          <CaseStatusCard {...chosenCase} />
        )}
      <Stack space={[3, 3, 3, 4, 4]}>
        <Box dataTestId="short-description">
          <Text variant="h4">{loc.shortDescriptionTitle}</Text>
          <Text variant="default">{chosenCase?.shortDescription}</Text>
        </Box>
        <Box>
          <Text variant="h4">{loc.detailedDescriptionTitle}</Text>
          {chosenCaseSplitted && (
            <Stack space={1}>
              {chosenCaseSplitted.map((split) => {
                return <Text>{split}</Text>
              })}
            </Stack>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}

export default CaseOverview
