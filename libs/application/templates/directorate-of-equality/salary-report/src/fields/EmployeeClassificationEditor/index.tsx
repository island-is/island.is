import { gql } from '@apollo/client'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Stack, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { messages } from '../../lib/messages'
import {
  ApiActions,
  draftActionId,
  DRAFT_EMPLOYEES_PAGE_SIZE,
  SyncMethodEnum,
} from '../../utils/constants'
import type {
  DisplayAssignment,
  DraftCriterionWithSubCriteriaDto,
  DraftEmployeeWithStepsDto,
} from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftEmployeesQuery } from '../../utils/useDraftEmployeesQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import {
  DraftErrorState,
  DraftLoadingState,
} from '../../components/DraftScreenState'
import { formatEmployeeIdentifier } from '../../utils/employeeIdentifier'
import {
  buildDisplayAssignments,
  buildStepMetaBySubCriterionId,
  resolveStepIds,
} from '../JobClassificationEditor/utils'
import { EmployeeClassificationRow } from './EmployeeClassificationRow'
import { TablePagination } from '../TablePagination'

const DRAFT_EMPLOYEES_WITH_STEPS_QUERY = gql`
  query DirectorateOfEqualityDraftEmployeesWithSteps(
    $input: DirectorateOfEqualityDraftEmployeesInput!
  ) {
    directorateOfEqualityDraftEmployeesWithSteps(input: $input) {
      employees {
        id
        ordinal
        field
        department
        startDate
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
        roleTitle
        stepIds
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
    draftActionId(ApiActions.getDraftCriteriaTree),
    'draftCriteriaTree',
  )
  const [page, setPage] = useState(1)
  const {
    employees,
    paging,
    loading: employeesLoading,
    hasError: employeesHasError,
    refetch: refetchEmployees,
  } = useDraftEmployeesQuery<DraftEmployeeWithStepsDto>(
    DRAFT_EMPLOYEES_WITH_STEPS_QUERY,
    'directorateOfEqualityDraftEmployeesWithSteps',
    application,
    page,
    DRAFT_EMPLOYEES_PAGE_SIZE,
  )
  const { sync } = useDraftSync(application)
  const methods = useForm<FormValues>({ defaultValues: { employees: [] } })
  const [actionError, setActionError] = useState<string | undefined>()

  const loading = criteriaLoading || employeesLoading
  const hasError = criteriaHasError || employeesHasError

  const personalCriteria = useMemo(
    () =>
      (criteriaContent?.criteria ?? []).filter((c) => c.type === 'PERSONAL'),
    [criteriaContent],
  )
  const stepMetaBySubCriterionId = useMemo(
    () => buildStepMetaBySubCriterionId(personalCriteria),
    [personalCriteria],
  )

  // Re-seeds on every page turn — unlike a one-time seed, the form only ever
  // holds the currently loaded page's employees.
  useEffect(() => {
    if (employeesLoading || !criteriaContent) return
    const formEmployees: EmployeeFormEntry[] = employees.map((emp) => ({
      employeeId: emp.id,
      assignments: buildDisplayAssignments(personalCriteria, emp.stepIds),
    }))
    methods.reset({ employees: formEmployees })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, employeesLoading, criteriaContent])

  // Syncs whatever's currently in the form for the loaded page — used both on
  // page turns (the form is about to be replaced with the next page's data)
  // and on the whole-screen submit.
  const syncCurrentPage = async () => {
    const values = methods.getValues().employees
    if (values.length === 0) return true
    try {
      await sync({
        employees: values.map((entry) => ({
          method: SyncMethodEnum.UPDATE,
          id: entry.employeeId,
          data: {
            stepIds: resolveStepIds(personalCriteria, entry.assignments),
          },
        })),
      })
      return true
    } catch {
      return false
    }
  }

  const handlePageChange = async (nextPage: number) => {
    const ok = await syncCurrentPage()
    if (!ok) {
      setActionError(formatMessage(messages.errors.draftSyncFailed))
      return
    }
    setActionError(undefined)
    setPage(nextPage)
  }

  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      const ok = await syncCurrentPage()
      if (!ok) return [false, formatMessage(messages.errors.draftSyncFailed)]
      return [true, null]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBeforeSubmitCallback, methods, sync, personalCriteria, formatMessage])

  if (loading) {
    return <DraftLoadingState />
  }

  if (hasError || !criteriaContent) {
    return (
      <DraftErrorState
        onRetry={() => {
          refetchCriteria()
          refetchEmployees()
        }}
      />
    )
  }

  return (
    <FormProvider {...methods}>
      <Box>
        <Stack space={4}>
          {actionError && (
            <AlertMessage
              type="error"
              title={formatMessage(messages.errors.alertTitle)}
              message={actionError}
            />
          )}
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
                  key={employee.id}
                  employee={employee}
                  identifier={formatEmployeeIdentifier(
                    application.id,
                    employee.ordinal,
                  )}
                  employeeIndex={index}
                  roleTitle={employee.roleTitle}
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
            page={paging?.page ?? page}
            totalPages={paging?.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </Stack>
      </Box>
    </FormProvider>
  )
}
