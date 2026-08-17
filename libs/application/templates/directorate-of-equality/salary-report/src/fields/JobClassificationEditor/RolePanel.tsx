import { FC } from 'react'
import { useWatch } from 'react-hook-form'
import { AccordionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import type { DisplayAssignment, StepMeta } from '../../utils/types'
import {
  computeAssignmentScore,
  groupAssignmentsByCriterion,
} from './utils'
import { StepAssignmentItem } from './StepAssignmentItem'

type Props = {
  roleTitle: string
  roleIndex: number
  assignments: DisplayAssignment[]
  stepMetaBySubCriterionId: Record<string, StepMeta>
  startExpanded?: boolean
}

export const RolePanel: FC<Props> = ({
  roleTitle,
  roleIndex,
  assignments,
  stepMetaBySubCriterionId,
  startExpanded = false,
}) => {
  const { formatMessage } = useLocale()
  const m = messages.report.jobClassification

  // Live step orders for this role drive the header score total.
  const watched = useWatch({
    name: `roles.${roleIndex}.assignments`,
  }) as DisplayAssignment[] | undefined

  const currentAssignments = watched ?? assignments
  const { score, max } = computeAssignmentScore(
    currentAssignments,
    stepMetaBySubCriterionId,
  )

  const groups = groupAssignmentsByCriterion(assignments)

  return (
    <AccordionCard
      id={`role-${roleIndex}`}
      label={roleTitle}
      visibleContent={
        <Text variant="small" color="dark400">
          {formatMessage(m.roleScore, { score, max })}
        </Text>
      }
      startExpanded={startExpanded}
    >
      <Stack space={3}>
        {groups.map((group) => (
          <Box key={group.criterionId}>
            <Text variant="h5" marginBottom={2}>
              {group.criterionTitle}
            </Text>
            <Stack space={2}>
              {group.items.map(({ assignment, index }) => (
                <StepAssignmentItem
                  key={assignment.subCriterionId}
                  fieldName={`roles.${roleIndex}.assignments.${index}.stepOrder`}
                  subTitle={assignment.subTitle}
                  defaultStepOrder={assignment.stepOrder}
                  meta={stepMetaBySubCriterionId[assignment.subCriterionId]}
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </AccordionCard>
  )
}
