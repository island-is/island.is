import { useMemo } from 'react'
import { Box, Checkbox, createColumnHelper } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import type { SalaryAnalysisOutlierDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { formatHourlyWage } from '../EmployeesEditor/utils'
import { formatPercentMagnitude } from '../../utils/wageGap'

const SELECT_COLUMN_WIDTH = 32

const columnHelper = createColumnHelper<SalaryAnalysisOutlierDto>()

type UseOutlierColumnsArgs = {
  formatMessage: FormatMessage
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
  pageRows,
  selected,
  setSelected,
  allSelectedOnPage,
  identifierForOrdinal,
  toggleSelect,
}: UseOutlierColumnsArgs) => {
  const m = messages.salaryAnalysis.outlierGroup

  // payStatus must be rendered, not inferred from the sign. A row can be listed
  // for being paid ABOVE what their stig imply, which is the opposite of what a
  // reader expects, and deviationPercent's sign only conveys that to someone who
  // already knows the convention.
  const payStatusWord = (status: SalaryAnalysisOutlierDto['payStatus']) =>
    formatMessage(
      status === 'UNDERPAID'
        ? m.payStatusUnderpaid
        : status === 'OVERPAID'
        ? m.payStatusOverpaid
        : m.payStatusOnLine,
    )

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
      columnHelper.accessor('score', {
        id: 'score',
        header: formatMessage(m.scoreColumn),
        enableSorting: true,
        cell: (info) => String(info.getValue()),
      }),
      columnHelper.accessor('regularHourlyWage', {
        id: 'hourlyWage',
        header: formatMessage(m.hourlyWageColumn),
        cell: (info) => formatHourlyWage(info.getValue()),
      }),
      columnHelper.accessor('expectedHourlyWage', {
        id: 'expectedHourlyWage',
        header: formatMessage(m.expectedHourlyWageColumn),
        cell: (info) => formatHourlyWage(info.getValue()),
      }),
      // Signed here, unlike the company-level gender gaps: this is a deviation
      // from a fitted line, so the sign is meaningful and the word glosses it.
      // The company figures are magnitude-only because their sign would imply a
      // denominator convention the reader does not have.
      columnHelper.accessor('deviationPercent', {
        id: 'deviation',
        header: formatMessage(m.deviationColumn),
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue()
          const sign = value > 0 ? '+' : value < 0 ? '-' : ''
          return formatMessage(m.deviationCell, {
            sign,
            value: formatPercentMagnitude(value),
            status: payStatusWord(info.row.original.payStatus),
          })
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageRows, selected, allSelectedOnPage, formatMessage],
  )
}
