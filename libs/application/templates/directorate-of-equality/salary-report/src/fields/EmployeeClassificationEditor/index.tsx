import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Stack, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import type {
  ParsedCriterionDto,
  ParsedEmployeeDto,
} from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import {
  type Employee,
  type PersonalFactor,
  type SubCriterion,
} from '../../utils/types'
import {
  buildMergedStepMetaByTitle,
  buildStepAssignmentsFromSubCriteria,
  mergeStepAssignments,
} from '../JobClassificationEditor/utils'
import { EmployeeClassificationRow } from './EmployeeClassificationRow'

const FIELD_NAME = 'employees'

export const EmployeeClassificationEditor: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { getValues, setValue } = useFormContext()
  const m = messages.report.employees

  const stepMetaByTitle = useMemo(() => {
    const criteria = (getValueViaPath<ParsedCriterionDto[]>(
      application.externalData,
      'parsedSalaryReport.data.criteria',
      [],
    ) ?? []) as ParsedCriterionDto[]
    // Live sub-criteria are the base (so a criterion added after import still
    // gets metadata) — the imported external criteria overlay authoritative
    // scores/weights for titles that exist in both.
    const personalFactors = (getValueViaPath<SubCriterion[][]>(
      application.answers,
      'subCriteria.personalFactors',
      [],
    ) ?? []) as SubCriterion[][]
    return buildMergedStepMetaByTitle(criteria, personalFactors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Structure for rendering: answers > external > empty (same employees list as
  // the Starfsmenn screen — this screen only edits personalStepAssignments).
  const employees = useMemo(() => {
    const saved = getValueViaPath<Employee[]>(application.answers, FIELD_NAME)
    const source =
      saved && saved.length > 0
        ? saved
        : ((getValueViaPath<ParsedEmployeeDto[]>(
            application.externalData,
            'parsedSalaryReport.data.employees',
            [],
          ) ?? []) as Employee[])

    // Manually-added employees start with no personalStepAssignments (there's
    // no import to populate them from) — derive the defaults from the
    // manually-entered personal-factor sub-criteria so classification is
    // possible without ever uploading a workbook.
    const personalFactors = (getValueViaPath<PersonalFactor[]>(
      application.answers,
      'criteria.personalFactors',
      [],
    ) ?? []) as PersonalFactor[]
    const subCriteriaPersonalFactors = (getValueViaPath<SubCriterion[][]>(
      application.answers,
      'subCriteria.personalFactors',
      [],
    ) ?? []) as SubCriterion[][]
    const defaultAssignments = buildStepAssignmentsFromSubCriteria(
      personalFactors.map((f) => f.title),
      subCriteriaPersonalFactors,
    )

    return source.map((emp) => ({
      ...emp,
      personalStepAssignments: mergeStepAssignments(
        emp.personalStepAssignments ?? [],
        defaultAssignments,
      ),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ensure the full employee objects are in the form so the whole record is
  // submitted — the per-step Select controllers only register stepOrder. Rebuild
  // from the structure source, overlaying any stepOrder already entered so edits
  // survive. Idempotent under StrictMode's double-invoked effects.
  useEffect(() => {
    if (employees.length === 0) return
    const current = getValues(FIELD_NAME) as Employee[] | undefined
    const merged = employees.map((emp, ei) => ({
      ...emp,
      personalStepAssignments: emp.personalStepAssignments.map(
        (assignment, ai) => ({
          ...assignment,
          stepOrder:
            (current?.[ei]?.personalStepAssignments?.[ai]?.stepOrder as
              | number
              | undefined) ?? assignment.stepOrder,
        }),
      ),
    }))
    setValue(FIELD_NAME, merged)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Stack space={4}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData></T.HeadData>
              <T.HeadData>{formatMessage(m.nameColumn)}</T.HeadData>
              <T.HeadData>{formatMessage(m.roleColumn)}</T.HeadData>
              <T.HeadData>{formatMessage(m.genderColumn)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {employees.map((employee, index) => (
              <EmployeeClassificationRow
                key={`${employee.identifier}-${index}`}
                employee={employee}
                employeeIndex={index}
                stepMetaByTitle={stepMetaByTitle}
              />
            ))}
          </T.Body>
        </T.Table>
      </Stack>
    </Box>
  )
}
