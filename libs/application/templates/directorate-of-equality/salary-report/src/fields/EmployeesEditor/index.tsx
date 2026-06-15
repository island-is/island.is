import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Stack, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { ParsedEmployeeDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { type Employee } from '../../lib/constants'
import { EmployeeRow } from './EmployeeRow'
import { AddEmployeeForm } from './AddEmployeeForm'
import { deriveIdentifierPrefix } from './utils'

const FIELD_NAME = 'employees'

export const EmployeesEditor: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { control, getValues } = useFormContext()
  const m = messages.report.employees

  const [isAdding, setIsAdding] = useState(false)

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: FIELD_NAME,
  })

  // Seed with explicit priority: live form value > external data > empty.
  // The live react-hook-form value (seeded from application.answers) wins so
  // edits survive remounts; only fall back to the parsed Excel data when no
  // answer exists yet. Reading getValues first also makes this idempotent
  // under StrictMode's double-invoked effects.
  useEffect(() => {
    const current = getValues(FIELD_NAME) as Employee[] | undefined
    if (current && current.length > 0) return

    const externalEmployees = (getValueViaPath<ParsedEmployeeDto[]>(
      application.externalData,
      'parsedSalaryReport.data.employees',
      [],
    ) ?? []) as Employee[]

    if (externalEmployees.length > 0) {
      replace(externalEmployees)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAdd = (employee: Employee) => {
    append(employee)
    setIsAdding(false)
  }

  const employees = fields as unknown as Employee[]

  const nextOrdinal =
    employees.reduce((max, e) => Math.max(max, e.ordinal ?? 0), 0) + 1

  const identifierPrefix = deriveIdentifierPrefix(employees)

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
            {(fields as unknown as (Employee & { id: string })[]).map(
              (field, index) => (
                <EmployeeRow
                  key={field.id}
                  employee={field}
                  onRemove={() => remove(index)}
                />
              ),
            )}
          </T.Body>
        </T.Table>

        {isAdding ? (
          <AddEmployeeForm
            nextOrdinal={nextOrdinal}
            identifierPrefix={identifierPrefix}
            onAdd={handleAdd}
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
