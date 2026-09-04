import { FC, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { useWatch } from 'react-hook-form'
import { Box, Button, Stack, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { GENDER_LABELS } from '../../utils/constants'
import type {
  DisplayAssignment,
  DraftEmployeeWithStepsDto,
  StepMeta,
} from '../../utils/types'
import {
  computeAssignmentScore,
  groupAssignmentsByCriterion,
} from '../JobClassificationEditor/utils'
import { StepAssignmentItem } from '../JobClassificationEditor/StepAssignmentItem'
import * as styles from '../EmployeesEditor/EmployeesEditor.css'

type Props = {
  employee: DraftEmployeeWithStepsDto
  employeeIndex: number
  roleTitle: string
  assignments: DisplayAssignment[]
  stepMetaBySubCriterionId: Record<string, StepMeta>
}

export const EmployeeClassificationRow: FC<Props> = ({
  employee,
  employeeIndex,
  roleTitle,
  assignments,
  stepMetaBySubCriterionId,
}) => {
  const { formatMessage } = useLocale()
  const [expanded, setExpanded] = useState(false)
  const m = messages.report.employees

  // Live step orders for this employee drive the per-criterion score below
  // each title.
  const watched = useWatch({
    name: `employees.${employeeIndex}.assignments`,
  }) as DisplayAssignment[] | undefined

  const currentAssignments = watched ?? assignments

  const background = expanded ? 'blue100' : 'transparent'
  const groups = groupAssignmentsByCriterion(assignments)

  return (
    <>
      <T.Row>
        <T.Data box={{ background, position: 'relative' }}>
          {expanded && <div className={styles.line} />}
          <Button
            circle
            colorScheme="light"
            icon={expanded ? 'remove' : 'add'}
            iconType="filled"
            onClick={() => setExpanded((v) => !v)}
            size="small"
            type="button"
            variant="primary"
            title={formatMessage(m.nameColumn)}
          />
        </T.Data>
        <T.Data box={{ background }}>{employee.ordinal}</T.Data>
        <T.Data box={{ background }}>{roleTitle}</T.Data>
        <T.Data box={{ background }}>
          {GENDER_LABELS[employee.gender] ?? employee.gender}
        </T.Data>
      </T.Row>
      <T.Row>
        <T.Data
          style={{ padding: 0 }}
          box={{ background, position: 'relative' }}
          colSpan={4}
        >
          <AnimateHeight duration={300} height={expanded ? 'auto' : 0}>
            {expanded && <div className={styles.line} />}
            <Box paddingX={3} paddingTop={3} paddingBottom={3}>
              <Stack space={3}>
                {groups.map((group) => {
                  const groupAssignments = group.items.map(
                    ({ assignment, index }) =>
                      currentAssignments[index] ?? assignment,
                  )
                  const { score, max } = computeAssignmentScore(
                    groupAssignments,
                    stepMetaBySubCriterionId,
                  )
                  return (
                    <Box key={group.criterionId}>
                      <Text variant="h5" marginBottom={1}>
                        {group.criterionTitle}
                      </Text>
                      <Text variant="small" color="dark400" marginBottom={2}>
                        {formatMessage(
                          messages.report.jobClassification.roleScore,
                          { score, max },
                        )}
                      </Text>
                      <Stack space={2}>
                        {group.items.map(({ assignment, index }) => (
                          <StepAssignmentItem
                            key={assignment.subCriterionId}
                            fieldName={`employees.${employeeIndex}.assignments.${index}.stepOrder`}
                            subTitle={assignment.subTitle}
                            defaultStepOrder={assignment.stepOrder}
                            meta={
                              stepMetaBySubCriterionId[
                                assignment.subCriterionId
                              ]
                            }
                          />
                        ))}
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          </AnimateHeight>
        </T.Data>
      </T.Row>
    </>
  )
}
