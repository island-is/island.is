import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  Stack,
  Table as T,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { messages } from '../../lib/messages'
import { SyncMethodEnum } from '../../utils/constants'
import {
  type Employee,
  type ReportEmployeeDto,
  type ReportEmployeeRoleDto,
  type Role,
} from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync, type SyncCommand } from '../../utils/useDraftSync'
import { EmployeeRow } from './EmployeeRow'
import { EmployeeForm } from './EmployeeForm'
import { TABLE_PAGE_SIZE, TablePagination } from '../TablePagination'
import {
  byRoleTitle,
  componentsFromFormValues,
  findOrCreateRoleId,
  pageOfEmployee,
  type EmployeeFormValues,
} from './utils'

const FIELD_NAME = 'employees'

type FormValues = { employees: Employee[] }

export const EmployeesEditor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const m = messages.report.employees
  const {
    content: employeesContent,
    loading: employeesLoading,
    hasError: employeesHasError,
    refetch: refetchEmployees,
  } = useDraftQuery<{ employees: ReportEmployeeDto[] }>(
    application,
    'DirectorateOfEquality.listDraftEmployees',
    'draftEmployees',
  )
  const {
    content: rolesContent,
    loading: rolesLoading,
    hasError: rolesHasError,
    refetch: refetchRoles,
  } = useDraftQuery<{ roles: ReportEmployeeRoleDto[] }>(
    application,
    'DirectorateOfEquality.listDraftRoles',
    'draftRoles',
  )
  const loading = employeesLoading || rolesLoading
  const hasError = employeesHasError || rolesHasError
  const content = useMemo(
    () =>
      employeesContent && rolesContent
        ? { employees: employeesContent.employees, roles: rolesContent.roles }
        : undefined,
    [employeesContent, rolesContent],
  )
  const refetch = useCallback(
    (options?: { silent?: boolean }) =>
      Promise.all([refetchEmployees(options), refetchRoles(options)]),
    [refetchEmployees, refetchRoles],
  )
  const { sync } = useDraftSync(application)
  const methods = useForm<FormValues>({ defaultValues: { employees: [] } })
  const { control, getValues } = methods

  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [roles, setRoles] = useState<Role[]>([])

  const originalEmployeeIds = useRef<Set<string>>(new Set())
  const originalRoleIds = useRef<Set<string>>(new Set())
  const newRoleIds = useRef<Set<string>>(new Set())
  const seeded = useRef(false)

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: FIELD_NAME,
  })

  useEffect(() => {
    if (!content || seeded.current) return
    seeded.current = true

    const employees: Employee[] = content.employees.map((e) => ({
      id: e.id,
      ordinal: e.ordinal,
      // No pseudonym field on the draft, so the client-minted id doubles as
      // the stable display handle (a recomputed label would drift instead).
      identifier: e.id,
      roleId: e.reportEmployeeRoleId,
      gender: e.gender,
      field: e.field,
      department: e.department,
      startDate: e.startDate,
      workRatio: e.workRatio,
      baseSalary: e.baseSalary,
      additionalFixedOvertime: e.additionalFixedOvertime,
      additionalFixedCarAllowance: e.additionalFixedCarAllowance,
      bonusOccasionalCarAllowance: e.bonusOccasionalCarAllowance,
      bonusOccasionalOvertime: e.bonusOccasionalOvertime,
      bonusPayments: e.bonusPayments,
      bonusOther: e.bonusOther,
      outlierGroupId: null,
    }))

    originalEmployeeIds.current = new Set(employees.map((e) => e.id))
    originalRoleIds.current = new Set(content.roles.map((r) => r.id))
    setRoles(
      content.roles.map((r) => ({ id: r.id, title: r.title, stepIds: [] })),
    )
    methods.reset({ employees })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  const roleTitleById: Record<string, string> = Object.fromEntries(
    roles.map((r) => [r.id, r.title]),
  )

  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      const employees = getValues(FIELD_NAME) as Employee[]
      const finalIds = new Set(employees.map((e) => e.id))

      const employeeCommands: SyncCommand[] = employees.map((e) => ({
        method: originalEmployeeIds.current.has(e.id)
          ? SyncMethodEnum.UPDATE
          : SyncMethodEnum.CREATE,
        id: e.id,
        data: {
          reportEmployeeRoleId: e.roleId,
          gender: e.gender,
          field: e.field ?? null,
          department: e.department ?? null,
          startDate: e.startDate,
          workRatio: e.workRatio,
          baseSalary: e.baseSalary,
          additionalFixedOvertime: e.additionalFixedOvertime ?? null,
          additionalFixedCarAllowance: e.additionalFixedCarAllowance ?? null,
          bonusOccasionalCarAllowance: e.bonusOccasionalCarAllowance ?? null,
          bonusOccasionalOvertime: e.bonusOccasionalOvertime ?? null,
          bonusPayments: e.bonusPayments ?? null,
          bonusOther: e.bonusOther ?? null,
        },
      }))
      const removedEmployeeCommands: SyncCommand[] = [
        ...originalEmployeeIds.current,
      ]
        .filter((id) => !finalIds.has(id))
        .map((id) => ({ method: SyncMethodEnum.REMOVE, id }))

      const roleCommands: SyncCommand[] = [...newRoleIds.current]
        .filter((id) => roles.some((r) => r.id === id))
        .map((id) => ({
          method: SyncMethodEnum.CREATE,
          id,
          data: { title: roleTitleById[id] },
        }))

      try {
        await sync({
          roles: roleCommands.length > 0 ? roleCommands : undefined,
          employees: [...employeeCommands, ...removedEmployeeCommands],
        })
        newRoleIds.current.clear()
        // Silent: about to navigate away, so skip the loading flash.
        await refetch({ silent: true })
      } catch {
        return [false, formatMessage(messages.errors.draftSyncFailed)]
      }
      return [true, null]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBeforeSubmitCallback, getValues, roles, sync, refetch, formatMessage])

  const resolveEmployee = (
    values: EmployeeFormValues,
    existing?: Employee,
  ): Employee => {
    const { id: roleId, isNew } = findOrCreateRoleId(values.roleTitle, roles)
    if (isNew) {
      setRoles((prev) => [
        ...prev,
        { id: roleId, title: values.roleTitle, stepIds: [] },
      ])
      newRoleIds.current.add(roleId)
    }
    const components = componentsFromFormValues(values)
    const id = existing?.id ?? crypto.randomUUID()
    return {
      id,
      ordinal: existing?.ordinal ?? 0,
      // Mirrors `id` — see the seeding effect above for why.
      identifier: id,
      roleId,
      gender: values.gender,
      field: values.field,
      department: values.department,
      startDate: values.startDate,
      workRatio: (Number(values.workRatio) || 0) / 100,
      baseSalary: Number(values.baseSalary) || 0,
      ...components,
      outlierGroupId: existing?.outlierGroupId ?? null,
    }
  }

  const handleAdd = (values: EmployeeFormValues) => {
    const employee = resolveEmployee(values)
    append(employee)
    setPage(
      pageOfEmployee(
        [...fields, employee] as Employee[],
        employee,
        roleTitleById,
      ),
    )
    setIsAdding(false)
  }

  const handleSave = (index: number, values: EmployeeFormValues) => {
    const existing = fields[index] as unknown as Employee
    const employee = resolveEmployee(values, existing)
    update(index, employee)
    setPage(
      pageOfEmployee(
        fields.map((field, i) =>
          i === index ? employee : (field as unknown as Employee),
        ) as Employee[],
        employee,
        roleTitleById,
      ),
    )
    setEditingIndex(null)
  }

  const sortedFields = fields
    .map((field, index) => ({ field: field as unknown as Employee, index }))
    .sort((a, b) => byRoleTitle(roleTitleById)(a.field, b.field))

  const totalPages = Math.ceil(sortedFields.length / TABLE_PAGE_SIZE)
  const currentPage = Math.min(page, Math.max(totalPages, 1))

  useEffect(() => {
    if (currentPage !== page) setPage(currentPage)
  }, [currentPage, page])

  const visibleFields = sortedFields.slice(
    (currentPage - 1) * TABLE_PAGE_SIZE,
    currentPage * TABLE_PAGE_SIZE,
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  if (hasError || !content) {
    return (
      <Box>
        <AlertMessage
          type="error"
          message={formatMessage(messages.errors.draftLoadFailed)}
        />
        <Box marginTop={2}>
          <Button
            variant="ghost"
            size="small"
            icon="reload"
            onClick={() => refetch()}
          >
            {formatMessage(messages.errors.retryButton)}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <FormProvider {...methods}>
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
                        roleTitleById={roleTitleById}
                        onSubmit={(values) => handleSave(index, values)}
                        onCancel={() => setEditingIndex(null)}
                      />
                    </T.Data>
                  </T.Row>
                ) : (
                  <EmployeeRow
                    key={field.id}
                    employee={field}
                    roleTitleById={roleTitleById}
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
    </FormProvider>
  )
}
