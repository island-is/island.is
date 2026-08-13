import { FC, useMemo, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'
import { Application, RecordObject } from '@island.is/application/types'
import {
  AccordionCard,
  Box,
  Button,
  Checkbox,
  createColumnHelper,
  InteractiveTable,
  Text,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import type {
  SalaryAnalysisOutlierDto,
  ScoreBucketDto,
} from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import type { Employee } from '../../utils/types'
import { getPathValue } from '../../utils/answerHelpers'
import { isOutlierGroupComplete } from '../../utils/outlierGroups'
import type { OutlierGroupAnswer } from '../../utils/outlierGroups'
import { formatCurrency } from '../EmployeesEditor/utils'
import { TablePagination } from '../TablePagination'

const OUTLIERS_PAGE_SIZE = 10
const SELECT_COLUMN_WIDTH = 40

type Props = {
  application: Application
  outliers: SalaryAnalysisOutlierDto[]
  scoreBuckets: ScoreBucketDto[]
  errors?: RecordObject
}

const columnHelper = createColumnHelper<SalaryAnalysisOutlierDto>()

export const OutlierEditor: FC<Props> = ({
  application,
  outliers,
  scoreBuckets,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()
  const m = messages.salaryAnalysis.outlierGroup

  const employees = getPathValue<Employee[]>(
    application.answers,
    'employees',
    [],
  )
  const identifierForOrdinal = (ordinal: number) =>
    employees.find((e) => e.ordinal === ordinal)?.identifier ?? `#${ordinal}`

  const scoreRangeLabel = (outlier: SalaryAnalysisOutlierDto) =>
    `${outlier.scoreBucketRangeFrom}-${outlier.scoreBucketRangeTo}`

  const medianSalaryForOutlier = (outlier: SalaryAnalysisOutlierDto) =>
    scoreBuckets.find(
      (b) =>
        b.rangeFrom === outlier.scoreBucketRangeFrom &&
        b.rangeTo === outlier.scoreBucketRangeTo,
    )?.overallMedianSalary

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'salaryAnalysis.outlierGroups',
  })

  // useFieldArray's `fields` only updates on structural changes (append/
  // remove) — it does NOT reflect keystrokes in the reason/action/signature
  // inputs below. The completeness warning needs live values, so it reads
  // from useWatch instead.
  const watchedGroups: OutlierGroupAnswer[] =
    useWatch({ name: 'salaryAnalysis.outlierGroups' }) ?? []

  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [page, setPage] = useState(1)

  // Once an outlier is put into a group it leaves the table below — the
  // group card owns it from then on. Removing a group frees its members
  // back into this list.
  const assignedOrdinals = new Set(
    (fields as unknown as (OutlierGroupAnswer & { id: string })[]).flatMap(
      (g) => g.employeeOrdinals,
    ),
  )
  const unassignedOutliers = outliers.filter(
    (o) => !assignedOrdinals.has(o.employeeOrdinal),
  )

  const totalPages = Math.max(
    1,
    Math.ceil(unassignedOutliers.length / OUTLIERS_PAGE_SIZE),
  )
  const currentPage = Math.min(page, totalPages)
  const pageRows = unassignedOutliers.slice(
    (currentPage - 1) * OUTLIERS_PAGE_SIZE,
    currentPage * OUTLIERS_PAGE_SIZE,
  )

  const toggleSelect = (ordinal: number) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(ordinal)) next.delete(ordinal)
      else next.add(ordinal)
      return next
    })

  const handleCreateGroup = () => {
    append({ employeeOrdinals: [...selected] } as OutlierGroupAnswer)
    setSelected(new Set())
    // The current page may no longer exist once its rows leave the table.
    setPage(1)
  }

  const allSelectedOnPage =
    pageRows.length > 0 &&
    pageRows.every((o) => selected.has(o.employeeOrdinal))

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: () => (
          <Box
            display="flex"
            justifyContent="center"
            style={{ maxWidth: SELECT_COLUMN_WIDTH }}
          >
            <Checkbox
              label=""
              ariaLabel={formatMessage(m.selectAllLabel)}
              checked={allSelectedOnPage}
              disabled={pageRows.length === 0}
              onChange={() =>
                setSelected((prev) => {
                  const next = new Set(prev)
                  pageRows.forEach((o) =>
                    allSelectedOnPage
                      ? next.delete(o.employeeOrdinal)
                      : next.add(o.employeeOrdinal),
                  )
                  return next
                })
              }
            />
          </Box>
        ),
        meta: { type: 'interactive' },
        cell: (info) => (
          <Box
            display="flex"
            justifyContent="center"
            style={{ maxWidth: SELECT_COLUMN_WIDTH }}
          >
            <Checkbox
              label=""
              ariaLabel={formatMessage(m.selectEmployeeLabel, {
                employee: identifierForOrdinal(
                  info.row.original.employeeOrdinal,
                ),
              })}
              checked={selected.has(info.row.original.employeeOrdinal)}
              onChange={() => toggleSelect(info.row.original.employeeOrdinal)}
            />
          </Box>
        ),
      }),
      columnHelper.accessor('employeeOrdinal', {
        id: 'employee',
        header: formatMessage(m.employeeColumn),
        cell: (info) => identifierForOrdinal(info.getValue()),
      }),
      columnHelper.accessor((row) => row.scoreBucketRangeFrom, {
        id: 'score',
        header: formatMessage(m.scoreColumn),
        enableSorting: true,
        cell: (info) => scoreRangeLabel(info.row.original),
      }),
      columnHelper.accessor('adjustedBaseSalary', {
        id: 'salary',
        header: formatMessage(m.salaryColumn),
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.display({
        id: 'medianSalary',
        header: formatMessage(m.medianSalaryColumn),
        cell: (info) =>
          formatCurrency(medianSalaryForOutlier(info.row.original)),
      }),
      columnHelper.accessor('differencePercent', {
        id: 'difference',
        header: formatMessage(m.differenceColumn),
        cell: (info) => {
          const value = info.getValue()
          const sign = value > 0 ? '+' : value < 0 ? '-' : ''
          return `${sign}${Math.abs(value).toFixed(1)}%`
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageRows, selected, allSelectedOnPage, employees, scoreBuckets],
  )

  const groupError = (index: number, suffix: string) =>
    errors
      ? getErrorViaPath(
          errors,
          `salaryAnalysis.outlierGroups.${index}.${suffix}`,
        )
      : undefined

  return (
    <Box marginTop={4}>
      {unassignedOutliers.length > 0 && (
        <>
          <InteractiveTable
            columns={columns}
            data={pageRows}
            mobileTitleKey="employee"
          />

          <Box marginTop={2}>
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Box>

          <Box marginTop={2} marginBottom={2}>
            <Button
              variant="ghost"
              size="small"
              icon="add"
              disabled={selected.size === 0}
              onClick={handleCreateGroup}
            >
              {formatMessage(m.createGroupButton)}
            </Button>
          </Box>
        </>
      )}

      <Box>
        {fields.map((field, index) => {
          const group = field as unknown as OutlierGroupAnswer & {
            id: string
          }
          return (
            <Box key={field.id} marginBottom={3}>
              <AccordionCard
                id={field.id}
                label={`${formatMessage(m.groupHeading)} ${index + 1}`}
                visibleContent={`${formatMessage(
                  m.groupMembers,
                )}: ${group.employeeOrdinals
                  .map(identifierForOrdinal)
                  .join(', ')}`}
                startExpanded
              >
                <Box marginBottom={2} display="flex" justifyContent="flexEnd">
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => remove(index)}
                  >
                    {formatMessage(m.removeGroupButton)}
                  </Button>
                </Box>
                <InputController
                  id={`salaryAnalysis.outlierGroups.${index}.reason`}
                  name={`salaryAnalysis.outlierGroups.${index}.reason`}
                  label={formatMessage(m.reasonLabel)}
                  textarea
                  backgroundColor="blue"
                  error={groupError(index, 'reason')}
                />
                <Box marginTop={2}>
                  <InputController
                    id={`salaryAnalysis.outlierGroups.${index}.action`}
                    name={`salaryAnalysis.outlierGroups.${index}.action`}
                    label={formatMessage(m.actionLabel)}
                    textarea
                    backgroundColor="blue"
                    error={groupError(index, 'action')}
                  />
                </Box>
                <Box marginTop={2} display="flex" columnGap={2}>
                  <Box style={{ flex: 1 }}>
                    <InputController
                      id={`salaryAnalysis.outlierGroups.${index}.signatureName`}
                      name={`salaryAnalysis.outlierGroups.${index}.signatureName`}
                      label={formatMessage(m.signatureNameLabel)}
                      backgroundColor="blue"
                      error={groupError(index, 'signatureName')}
                    />
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <InputController
                      id={`salaryAnalysis.outlierGroups.${index}.signatureRole`}
                      name={`salaryAnalysis.outlierGroups.${index}.signatureRole`}
                      label={formatMessage(m.signatureRoleLabel)}
                      backgroundColor="blue"
                      error={groupError(index, 'signatureRole')}
                    />
                  </Box>
                </Box>
              </AccordionCard>
            </Box>
          )
        })}
      </Box>

      {unassignedOutliers.length > 0 && (
        <Box marginTop={2}>
          <Text variant="small" color="red600">
            {formatMessage(m.unassignedWarning)}
          </Text>
        </Box>
      )}
      {unassignedOutliers.length === 0 &&
        watchedGroups.some((g) => g.employeeOrdinals.length > 0) &&
        watchedGroups.some((g) => !isOutlierGroupComplete(g)) && (
          <Box marginTop={2}>
            <Text variant="small" color="red600">
              {formatMessage(m.incompleteGroupWarning)}
            </Text>
          </Box>
        )}
    </Box>
  )
}
