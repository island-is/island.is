import { useMemo } from 'react'
import { Box, Checkbox, createColumnHelper } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type {
  SalaryAnalysisOutlierDto,
  ScoreBucketDto,
} from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { formatCurrency } from '../EmployeesEditor/utils'

const SELECT_COLUMN_WIDTH = 32

const columnHelper = createColumnHelper<SalaryAnalysisOutlierDto>()

type UseOutlierColumnsArgs = {
  formatMessage: FormatMessage
  scoreBuckets: ScoreBucketDto[]
  pageRows: SalaryAnalysisOutlierDto[]
  selected: Set<number>
  setSelected: (updater: (prev: Set<number>) => Set<number>) => void
  allSelectedOnPage: boolean
  identifierForOrdinal: (ordinal: number) => string
  toggleSelect: (ordinal: number) => void
}

// The outlier table's column defs — split out of OutlierEditor since it's the
// single largest, most self-contained chunk of that file.
export const useOutlierColumns = ({
  formatMessage,
  scoreBuckets,
  pageRows,
  selected,
  setSelected,
  allSelectedOnPage,
  identifierForOrdinal,
  toggleSelect,
}: UseOutlierColumnsArgs) => {
  const m = messages.salaryAnalysis.outlierGroup

  const scoreRangeLabel = (outlier: SalaryAnalysisOutlierDto) =>
    `${outlier.scoreBucketRangeFrom}-${outlier.scoreBucketRangeTo}`

  const medianSalaryForOutlier = (outlier: SalaryAnalysisOutlierDto) =>
    scoreBuckets.find(
      (b) =>
        b.rangeFrom === outlier.scoreBucketRangeFrom &&
        b.rangeTo === outlier.scoreBucketRangeTo,
    )?.overallMedianSalary

  return useMemo(
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
    [pageRows, selected, allSelectedOnPage, scoreBuckets, formatMessage],
  )
}
