import { getValueViaPath } from '@island.is/application/core'
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
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { messages } from '../../lib/messages'
import { SyncMethodEnum } from '../../utils/constants'
import type {
  DisplayAssignment,
  DraftCriterionWithSubCriteriaDto,
  DraftEmployeeWithStepsDto,
  DraftRoleWithStepsDto,
} from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync, type SyncCommand } from '../../utils/useDraftSync'
import {
  buildDisplayAssignments,
  buildStepMetaBySubCriterionId,
  resolveStepIds,
} from '../JobClassificationEditor/utils'
import { EmployeeClassificationRow } from './EmployeeClassificationRow'
import { TABLE_PAGE_SIZE, TablePagination } from '../TablePagination'

type EmployeeFormEntry = {
  employeeId: string
  assignments: DisplayAssignment[]
}
type FormValues = { employees: EmployeeFormEntry[] }

export const EmployeeClassificationEditor: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setBeforeSubmitCallback }) => {
  const { formatMessage } = useLocale()
  const m = messages.report.employees
  const {
    content: criteriaContent,
    loading: criteriaLoading,
    hasError: criteriaHasError,
    refetch: refetchCriteria,
  } = useDraftQuery<{ criteria: DraftCriterionWithSubCriteriaDto[] }>(
    application,
    'DirectorateOfEquality.getDraftCriteriaTree',
    'draftCriteriaTree',
  )
  const {
    content: employeesContent,
    loading: employeesLoading,
    hasError: employeesHasError,
    refetch: refetchEmployees,
  } = useDraftQuery<{ employees: DraftEmployeeWithStepsDto[] }>(
    application,
    'DirectorateOfEquality.listDraftEmployeesWithSteps',
    'draftEmployeesWithSteps',
  )
  const { sync } = useDraftSync(application)
  const methods = useForm<FormValues>({ defaultValues: { employees: [] } })
  const seeded = useRef(false)
  const [page, setPage] = useState(1)

  const loading = criteriaLoading || employeesLoading
  const hasError = criteriaHasError || employeesHasError
  const employees = employeesContent?.employees ?? []

  // Role titles are display-only here — read passively off externalData
  // rather than calling listDraftRolesWithSteps again. JobClassificationEditor
  // (one screen earlier in the flow) already populated `draftRolesWithSteps`
  // with a live fetch, so it's fresh in application.externalData by the
  // time this screen mounts.
  const roles = useMemo(
    () =>
      getValueViaPath<{ roles: DraftRoleWithStepsDto[] }>(
        application.externalData,
        'draftRolesWithSteps.data',
        { roles: [] },
      )?.roles ?? [],
    [application.externalData],
  )
  const roleTitleById = useMemo(
    () => Object.fromEntries(roles.map((r) => [r.id, r.title])),
    [roles],
  )

  const personalCriteria = useMemo(
    () =>
      (criteriaContent?.criteria ?? []).filter((c) => c.type === 'PERSONAL'),
    [criteriaContent],
  )
  const stepMetaBySubCriterionId = useMemo(
    () => buildStepMetaBySubCriterionId(personalCriteria),
    [personalCriteria],
  )

  useEffect(() => {
    if (!criteriaContent || !employeesContent || seeded.current) return
    seeded.current = true
    const formEmployees: EmployeeFormEntry[] = employees.map((emp) => ({
      employeeId: emp.id,
      assignments: buildDisplayAssignments(personalCriteria, emp.stepIds),
    }))
    methods.reset({ employees: formEmployees })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteriaContent, employeesContent])

  useEffect(() => {
    if (!setBeforeSubmitCallback || !criteriaContent || !employeesContent) {
      return
    }
    setBeforeSubmitCallback(async () => {
      const values = methods.getValues().employees
      const employeeCommands: SyncCommand[] = values.map((entry) => ({
        method: SyncMethodEnum.UPDATE,
        id: entry.employeeId,
        data: { stepIds: resolveStepIds(personalCriteria, entry.assignments) },
      }))
      try {
        await sync({ employees: employeeCommands })
        // Silent: we're about to navigate away, so don't flash a loading
        // state on the current screen.
        await Promise.all([
          refetchCriteria({ silent: true }),
          refetchEmployees({ silent: true }),
        ])
      } catch {
        return [false, formatMessage(messages.errors.draftSyncFailed)]
      }
      return [true, null]
    })
  }, [
    setBeforeSubmitCallback,
    methods,
    sync,
    refetchCriteria,
    refetchEmployees,
    criteriaContent,
    employeesContent,
    personalCriteria,
    formatMessage,
  ])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  if (hasError || !criteriaContent || !employeesContent) {
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
            onClick={() => {
              refetchCriteria()
              refetchEmployees()
            }}
          >
            {formatMessage(messages.errors.retryButton)}
          </Button>
        </Box>
      </Box>
    )
  }

  const totalPages = Math.ceil(employees.length / TABLE_PAGE_SIZE)
  const visibleEmployees = employees
    .map((employee, index) => ({ employee, index }))
    .slice((page - 1) * TABLE_PAGE_SIZE, page * TABLE_PAGE_SIZE)

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
              </T.Row>
            </T.Head>
            <T.Body>
              {visibleEmployees.map(({ employee, index }) => (
                <EmployeeClassificationRow
                  key={employee.id}
                  employee={employee}
                  employeeIndex={index}
                  roleTitle={roleTitleById[employee.reportEmployeeRoleId] ?? ''}
                  assignments={buildDisplayAssignments(
                    personalCriteria,
                    employee.stepIds,
                  )}
                  stepMetaBySubCriterionId={stepMetaBySubCriterionId}
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
    </FormProvider>
  )
}
