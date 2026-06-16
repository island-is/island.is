import { FC, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { Box, Button, Stack, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { GENDER_LABELS, type Employee } from '../../lib/constants'
import {
  groupAssignmentsByCriterion,
  type StepMeta,
} from '../JobClassificationEditor/utils'
import { StepAssignmentItem } from '../JobClassificationEditor/StepAssignmentItem'
import * as styles from '../EmployeesEditor/EmployeesEditor.css'

type Props = {
  employee: Employee
  employeeIndex: number
  stepMetaByTitle: Record<string, StepMeta>
}

export const EmployeeClassificationRow: FC<Props> = ({
  employee,
  employeeIndex,
  stepMetaByTitle,
}) => {
  const { formatMessage } = useLocale()
  const [expanded, setExpanded] = useState(false)
  const m = messages.report.employees

  const background = expanded ? 'blue100' : 'transparent'
  const groups = groupAssignmentsByCriterion(employee.personalStepAssignments)

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
        <T.Data box={{ background }}>{employee.identifier}</T.Data>
        <T.Data box={{ background }}>{employee.roleTitle}</T.Data>
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
                {groups.map((group) => (
                  <Box key={group.criterionTitle}>
                    <Text variant="h5" marginBottom={2}>
                      {group.criterionTitle}
                    </Text>
                    <Stack space={2}>
                      {group.items.map(({ assignment, index }) => (
                        <StepAssignmentItem
                          key={`${assignment.subTitle}-${index}`}
                          fieldName={`employees.${employeeIndex}.personalStepAssignments.${index}.stepOrder`}
                          subTitle={assignment.subTitle}
                          defaultStepOrder={assignment.stepOrder}
                          meta={stepMetaByTitle[assignment.subTitle]}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </AnimateHeight>
        </T.Data>
      </T.Row>
    </>
  )
}
