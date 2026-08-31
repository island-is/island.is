import { gql } from '@apollo/client'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  Stack,
  Table as T,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { messages } from '../../lib/messages'
import {
  ApiActions,
  DRAFT_EMPLOYEES_PAGE_SIZE,
  draftActionId,
  SyncMethodEnum,
} from '../../utils/constants'
import {
  type Employee,
  type ReportEmployeeDto,
  type ReportEmployeeRoleDto,
  type Role,
} from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftEmployeesQuery } from '../../utils/useDraftEmployeesQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import {
  DraftErrorState,
  DraftLoadingState,
} from '../../components/DraftScreenState'
import { EmployeeOrdinalHeader } from '../../components/EmployeeOrdinalHeader'
import { EmployeeRow } from './EmployeeRow'
import { EmployeeForm } from './EmployeeForm'
import { TablePagination } from '../TablePagination'
import {
  componentsFromFormValues,
  findOrCreateRoleId,
  paidHoursFromFormValue,
  type EmployeeFormValues,
} from './utils'

const DRAFT_EMPLOYEES_QUERY = gql`
  query DirectorateOfEqualityDraftEmployees(
    $input: DirectorateOfEqualityDraftEmployeesInput!
  ) {
    directorateOfEqualityDraftEmployees(input: $input) {
      employees {
        id
        ordinal
        field
        department
        startDate
        paidHours
        baseSalary
        additionalFixedOvertime
        additionalFixedCarAllowance
        bonusOccasionalCarAllowance
        bonusOccasionalOvertime
        bonusPayments
        bonusOther
        additionalSalary
        bonusSalary
        gender
        reportEmployeeRoleId
        reportId
        score
      }
      paging {
        page
        totalPages
        totalItems
        nextPage
        previousPage
        pageSize
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

const toEmployee = (e: ReportEmployeeDto): Employee => ({
  id: e.id,
  ordinal: e.ordinal,
  roleId: e.reportEmployeeRoleId,
  gender: e.gender,
  field: e.field,
  department: e.department,
  startDate: e.startDate,
  paidHours: e.paidHours,
  baseSalary: e.baseSalary,
  additionalFixedOvertime: e.additionalFixedOvertime,
  additionalFixedCarAllowance: e.additionalFixedCarAllowance,
  bonusOccasionalCarAllowance: e.bonusOccasionalCarAllowance,
  bonusOccasionalOvertime: e.bonusOccasionalOvertime,
  bonusPayments: e.bonusPayments,
  bonusOther: e.bonusOther,
  outlierGroupId: null,
})

export const EmployeesEditor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const m = messages.report.employees

  const [page, setPage] = useState(1)
  const {
    employees: employeeDtos,
    paging,
    loading: employeesLoading,
    hasError: employeesHasError,
    refetch: refetchEmployees,
  } = useDraftEmployeesQuery<ReportEmployeeDto>(
    DRAFT_EMPLOYEES_QUERY,
    'directorateOfEqualityDraftEmployees',
    application,
    page,
    DRAFT_EMPLOYEES_PAGE_SIZE,
  )
  const {
    content: rolesContent,
    loading: rolesLoading,
    hasError: rolesHasError,
    refetch: refetchRoles,
  } = useDraftQuery<{ roles: ReportEmployeeRoleDto[] }>(
    application,
    draftActionId(ApiActions.listDraftRoles),
    'draftRoles',
  )
  const { sync } = useDraftSync(application)

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | undefined>()

  const loading = employeesLoading || rolesLoading
  const hasError = employeesHasError || rolesHasError

  const roles: Role[] = (rolesContent?.roles ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    stepIds: [],
  }))
  const roleTitleById: Record<string, string> = Object.fromEntries(
    roles.map((r) => [r.id, r.title]),
  )

  if (loading) {
    return <DraftLoadingState />
  }

  if (hasError) {
    return (
      <DraftErrorState
        onRetry={() => {
          refetchEmployees().catch(() => undefined)
          refetchRoles().catch(() => undefined)
        }}
      />
    )
  }

  const employees = employeeDtos.map(toEmployee)

  // A new role title resolves to a client-minted id; sync it alongside the
  // employee command so it exists before the employee references it.
  const buildRoleCommand = (roleTitle: string) => {
    const { id: roleId, isNew } = findOrCreateRoleId(roleTitle, roles)
    return {
      roleId,
      roleCommand: isNew
        ? {
            method: SyncMethodEnum.CREATE,
            id: roleId,
            data: { title: roleTitle },
          }
        : undefined,
    }
  }

  const employeeData = (values: EmployeeFormValues, roleId: string) => ({
    reportEmployeeRoleId: roleId,
    gender: values.gender,
    field: values.field || null,
    department: values.department || null,
    startDate: values.startDate,
    paidHours: paidHoursFromFormValue(values.paidHours),
    baseSalary: Number(values.baseSalary) || 0,
    ...componentsFromFormValues(values),
  })

  const runSync = async (batch: Parameters<typeof sync>[0]) => {
    setActionError(undefined)
    try {
      await sync(batch)
      if (batch.roles?.length) await refetchRoles({ silent: true })
      await refetchEmployees()
      return true
    } catch {
      setActionError(formatMessage(messages.errors.draftSyncFailed))
      return false
    }
  }

  const handleAdd = async (values: EmployeeFormValues) => {
    const { roleId, roleCommand } = buildRoleCommand(values.roleTitle)
    const ok = await runSync({
      roles: roleCommand ? [roleCommand] : undefined,
      employees: [
        {
          method: SyncMethodEnum.CREATE,
          id: crypto.randomUUID(),
          data: employeeData(values, roleId),
        },
      ],
    })
    if (ok) setIsAdding(false)
  }

  const handleSave = async (employee: Employee, values: EmployeeFormValues) => {
    const { roleId, roleCommand } = buildRoleCommand(values.roleTitle)
    const ok = await runSync({
      roles: roleCommand ? [roleCommand] : undefined,
      employees: [
        {
          method: SyncMethodEnum.UPDATE,
          id: employee.id,
          data: employeeData(values, roleId),
        },
      ],
    })
    if (ok) setEditingId(null)
  }

  const handleRemove = (employee: Employee) =>
    runSync({
      employees: [{ method: SyncMethodEnum.REMOVE, id: employee.id }],
    })

  return (
    <Box>
      <Stack space={4}>
        {actionError && <AlertMessage type="error" message={actionError} />}
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData></T.HeadData>
              <T.HeadData>
                <EmployeeOrdinalHeader />
              </T.HeadData>
              <T.HeadData>{formatMessage(m.roleColumn)}</T.HeadData>
              <T.HeadData>{formatMessage(m.genderColumn)}</T.HeadData>
              <T.HeadData></T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {employees.map((employee) =>
              editingId === employee.id ? (
                <T.Row key={employee.id}>
                  <T.Data colSpan={5} style={{ padding: 0 }}>
                    <EmployeeForm
                      employee={employee}
                      roleTitleById={roleTitleById}
                      onSubmit={(values) => handleSave(employee, values)}
                      onCancel={() => setEditingId(null)}
                    />
                  </T.Data>
                </T.Row>
              ) : (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  roleTitleById={roleTitleById}
                  onRemove={() => handleRemove(employee)}
                  onEdit={() => setEditingId(employee.id)}
                />
              ),
            )}
          </T.Body>
        </T.Table>

        <TablePagination
          page={paging?.page ?? page}
          totalPages={paging?.totalPages ?? 1}
          onPageChange={(newPage) => {
            setEditingId(null)
            setPage(newPage)
          }}
        />

        {isAdding ? (
          <EmployeeForm
            roleTitleById={roleTitleById}
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
