import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Stack, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { messages } from '../../lib/messages'
import type { ApplicationAnswers } from '../../lib/dataSchema'
import { type Employee } from '../../utils/types'
import { getPathValue } from '../../utils/answerHelpers'
import { EmployeeRow } from './EmployeeRow'
import { EmployeeForm } from './EmployeeForm'
import { TABLE_PAGE_SIZE, TablePagination } from '../TablePagination'
import { byRoleTitle, deriveIdentifierPrefix, pageOfEmployee } from './utils'

const FIELD_NAME = 'employees'

export const EmployeesEditor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { control, getValues } = useFormContext<ApplicationAnswers>()
  const m = messages.report.employees

  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const { fields, append, remove, replace, update } = useFieldArray({
    control,
    name: FIELD_NAME,
  })

  // Seed with explicit priority: live form value > external data > empty.
  // The live react-hook-form value (seeded from application.answers) wins so
  // edits survive remounts; only fall back to the parsed Excel data when no
  // answer exists yet. Reading getValues first also makes this idempotent
  // under StrictMode's double-invoked effects.
  useEffect(() => {
    const current = getValues(FIELD_NAME)
    if (current && current.length > 0) return

    const externalEmployees = getPathValue<Employee[]>(
      application.externalData,
      'parsedSalaryReport.data.employees',
      [],
    )

    if (externalEmployees.length > 0) {
      replace(externalEmployees)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Both handlers follow the row to wherever the role-title sort puts it, so
  // the user sees the entry they just submitted instead of it vanishing onto
  // some other page.
  const handleAdd = (employee: Employee) => {
    append(employee)
    setPage(pageOfEmployee([...fields, employee], employee))
    setIsAdding(false)
  }

  const handleSave = (index: number, employee: Employee) => {
    update(index, employee)
    setPage(
      pageOfEmployee(
        fields.map((field, i) => (i === index ? employee : field)),
        employee,
      ),
    )
    setEditingIndex(null)
  }

  const employees = fields

  const nextOrdinal =
    employees.reduce((max, e) => Math.max(max, e.ordinal ?? 0), 0) + 1

  const identifierPrefix = deriveIdentifierPrefix(employees)

  // Table rows are sorted alphabetically by role title, but callbacks below
  // still need the field's real index in `fields` — remove/update/editingIndex
  // all key off that, not the sorted display position.
  const sortedFields = fields
    .map((field, index) => ({ field, index }))
    .sort((a, b) => byRoleTitle(a.field, b.field))

  const totalPages = Math.ceil(sortedFields.length / TABLE_PAGE_SIZE)

  // Deleting the last row on the final page would otherwise strand the user on
  // an empty table. Clamp for this render, then write it back so a later add
  // doesn't jump to the stale page.
  const currentPage = Math.min(page, Math.max(totalPages, 1))

  useEffect(() => {
    if (currentPage !== page) setPage(currentPage)
  }, [currentPage, page])

  const visibleFields = sortedFields.slice(
    (currentPage - 1) * TABLE_PAGE_SIZE,
    currentPage * TABLE_PAGE_SIZE,
  )

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
              <T.HeadData></T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {visibleFields.map(({ field, index }) =>
              editingIndex === index ? (
                <T.Row key={field.id}>
                  <T.Data colSpan={5} style={{ padding: 0 }}>
                    <EmployeeForm
                      employee={field}
                      nextOrdinal={nextOrdinal}
                      identifierPrefix={identifierPrefix}
                      onSubmit={(employee) => handleSave(index, employee)}
                      onCancel={() => setEditingIndex(null)}
                    />
                  </T.Data>
                </T.Row>
              ) : (
                <EmployeeRow
                  key={field.id}
                  employee={field}
                  onRemove={() => remove(index)}
                  onEdit={() => setEditingIndex(index)}
                />
              ),
            )}
          </T.Body>
        </T.Table>

        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {isAdding ? (
          <EmployeeForm
            nextOrdinal={nextOrdinal}
            identifierPrefix={identifierPrefix}
            onSubmit={handleAdd}
            onCancel={() => setIsAdding(false)}
          />
        ) : (
          <Box display="flex" justifyContent="flexStart">
            <Button
              variant="ghost"
              type="button"
              icon="add"
              onClick={() => setIsAdding(true)}
            >
              {formatMessage(m.addButton)}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
