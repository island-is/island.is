import { FieldBaseProps } from '@island.is/application/types'
import { Box, Stack, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { ParsedCriterionDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import {
  type Employee,
  type PersonalFactor,
  type SubCriterion,
} from '../../utils/types'
import { getLiveOrSavedArray, getPathValue } from '../../utils/answerHelpers'
import {
  buildMergedStepMetaByTitle,
  buildStepAssignmentsFromSubCriteria,
  mergeStepAssignments,
} from '../JobClassificationEditor/utils'
import { EmployeeClassificationRow } from './EmployeeClassificationRow'
import { TABLE_PAGE_SIZE, TablePagination } from '../TablePagination'

const FIELD_NAME = 'employees'

export const EmployeeClassificationEditor: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { getValues, setValue } = useFormContext()
  const m = messages.report.employees

  const [page, setPage] = useState(1)

  const stepMetaByTitle = useMemo(() => {
    // Only the PERSONAL criteria: the merge is keyed by sub-criterion title
    // alone, so passing the job criteria too would let a same-titled job
    // sub-criterion overwrite this screen's scores and weights.
    const criteria = getPathValue<ParsedCriterionDto[]>(
      application.externalData,
      'parsedSalaryReport.data.criteria',
      [],
    ).filter((c) => c.type === 'PERSONAL')
    // Live sub-criteria are the base (so a criterion added after import still
    // gets metadata) — the imported external criteria overlay authoritative
    // scores/weights for titles that exist in both.
    const personalFactors = getLiveOrSavedArray<SubCriterion[]>(
      getValues,
      application.answers,
      'subCriteria.personalFactors',
    )
    return buildMergedStepMetaByTitle(criteria, personalFactors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Structure for rendering: answers > external > empty (same employees list as
  // the Starfsmenn screen — this screen only edits personalStepAssignments).
  const employees = useMemo(() => {
    const saved = getPathValue<Employee[]>(application.answers, FIELD_NAME, [])
    const source =
      saved.length > 0
        ? saved
        : getPathValue<Employee[]>(
            application.externalData,
            'parsedSalaryReport.data.employees',
            [],
          )

    // Manually-added employees start with no personalStepAssignments (there's
    // no import to populate them from) — derive the defaults from the
    // manually-entered personal-factor sub-criteria so classification is
    // possible without ever uploading a workbook.
    const personalFactors = getLiveOrSavedArray<PersonalFactor>(
      getValues,
      application.answers,
      'criteria.personalFactors',
    )
    const subCriteriaPersonalFactors = getLiveOrSavedArray<SubCriterion[]>(
      getValues,
      application.answers,
      'subCriteria.personalFactors',
    )
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
            current?.[ei]?.personalStepAssignments?.[ai]?.stepOrder ??
            assignment.stepOrder,
        }),
      ),
    }))
    setValue(FIELD_NAME, merged)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalPages = Math.ceil(employees.length / TABLE_PAGE_SIZE)

  // The employee list is fixed for the lifetime of this screen (no add/remove
  // here), so the page only ever changes when the user asks for it.
  const visibleEmployees = employees
    .map((employee, index) => ({ employee, index }))
    .slice((page - 1) * TABLE_PAGE_SIZE, page * TABLE_PAGE_SIZE)

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
            {visibleEmployees.map(({ employee, index }) => (
              <EmployeeClassificationRow
                key={`${employee.identifier}-${index}`}
                employee={employee}
                employeeIndex={index}
                stepMetaByTitle={stepMetaByTitle}
              />
            ))}
          </T.Body>
        </T.Table>

        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Stack>
    </Box>
  )
}
