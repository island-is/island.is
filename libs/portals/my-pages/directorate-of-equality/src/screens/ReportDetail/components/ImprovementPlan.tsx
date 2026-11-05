import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  InfoLine,
  InfoLineStack,
} from '@island.is/portals/my-pages/core'

import { messages } from '../../../lib/messages'
import { DirectorateOfEqualityImprovementAction } from '../../../mocks/types'

export const ImprovementPlan = ({
  actions,
}: {
  actions: DirectorateOfEqualityImprovementAction[]
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Text variant="h4" as="h3" marginBottom={1}>
        {formatMessage(messages.improvementPlanTitle)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(messages.improvementPlanIntro)}
      </Text>
      <Stack space={4}>
        {actions.map((action, index) => (
          <InfoLineStack
            key={index}
            label={formatMessage(messages.actionGroup, { number: index + 1 })}
          >
            <InfoLine
              label={messages.deviationReason}
              content={action.reason}
            />
            <InfoLine
              label={messages.correctionPlan}
              content={action.correctionPlan}
            />
            <InfoLine
              label={messages.actionDeadline}
              content={formatDate(action.deadline)}
            />
            <InfoLine
              label={messages.responsibleName}
              content={action.responsibleName}
            />
            <InfoLine
              label={messages.responsibleTitle}
              content={action.responsibleTitle}
            />
          </InfoLineStack>
        ))}
      </Stack>
    </Box>
  )
}
