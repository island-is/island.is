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
import { type Employee, type SubCriterion } from '../../lib/constants'
import {
  buildStepMetaByTitle,
  buildStepMetaFromSubCriteria,
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
    const fromExternal = buildStepMetaByTitle(criteria)
    if (Object.keys(fromExternal).length > 0) return fromExternal
    // External data unavailable (stale right after import) — fall back to the
    // sub-criteria in answers so the step dropdowns still render options.
    const subCriteria = (getValueViaPath(application.answers, 'subCriteria', {}) ??
      {}) as { jobFactors?: SubCriterion[][]; personalFactors?: SubCriterion[][] }
    return buildStepMetaFromSubCriteria(subCriteria)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Structure for rendering: answers > external > empty (same employees list as
  // the Starfsmenn screen — this screen only edits personalStepAssignments).
  const employees = useMemo(() => {
    const saved = getValueViaPath<Employee[]>(application.answers, FIELD_NAME)
    if (saved && saved.length > 0) return saved
    return (getValueViaPath<ParsedEmployeeDto[]>(
      application.externalData,
      'parsedSalaryReport.data.employees',
      [],
    ) ?? []) as Employee[]
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
