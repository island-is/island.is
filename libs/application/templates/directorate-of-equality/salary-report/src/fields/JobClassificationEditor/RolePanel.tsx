import { FC } from 'react'
import { useWatch } from 'react-hook-form'
import { AccordionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import type { Role, StepAssignment } from '../../utils/types'
import {
  computeRoleScore,
  groupAssignmentsByCriterion,
  type StepMeta,
} from './utils'
import { StepAssignmentItem } from './StepAssignmentItem'

type Props = {
  role: Role
  roleIndex: number
  stepMetaByTitle: Record<string, StepMeta>
  startExpanded?: boolean
}

export const RolePanel: FC<Props> = ({
  role,
  roleIndex,
  stepMetaByTitle,
  startExpanded = false,
}) => {
  const { formatMessage } = useLocale()
  const m = messages.report.jobClassification

  // Live step orders for this role drive the header score total.
  const watched = useWatch({
    name: `roles.${roleIndex}.stepAssignments`,
  }) as StepAssignment[] | undefined

  const assignments = watched ?? role.stepAssignments
  const { score, max } = computeRoleScore(assignments, stepMetaByTitle)

  const groups = groupAssignmentsByCriterion(role.stepAssignments)

  return (
    <AccordionCard
      id={`role-${roleIndex}`}
      label={role.title}
      visibleContent={
        <Text variant="small" color="dark400">
          {formatMessage(m.roleScore, { score, max })}
        </Text>
      }
      startExpanded={startExpanded}
    >
      <Stack space={3}>
        {groups.map((group) => (
          <Box key={group.criterionTitle}>
            <Text variant="h5" marginBottom={2}>
              {group.criterionTitle}
            </Text>
            <Stack space={2}>
              {group.items.map(({ assignment, index }) => (
                <StepAssignmentItem
                  key={`${assignment.subTitle}-${index}`}
                  fieldName={`roles.${roleIndex}.stepAssignments.${index}.stepOrder`}
                  subTitle={assignment.subTitle}
                  defaultStepOrder={assignment.stepOrder}
                  meta={stepMetaByTitle[assignment.subTitle]}
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </AccordionCard>
  )
}
