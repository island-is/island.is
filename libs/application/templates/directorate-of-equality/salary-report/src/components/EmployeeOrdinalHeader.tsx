import type { ReactNode } from 'react'
import { Box, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../lib/messages'

type Props = {
  /**
   * Wraps the label — and ONLY the label — in the caller's own control, for the
   * tables whose ordinal column is sortable (launadreifing today).
   *
   * The tooltip deliberately stays outside whatever comes back: it renders a
   * focusable element of its own, and nesting that inside a button makes the
   * button invalid HTML and swallows the tooltip's own focus. So a caller gets
   * the label to wrap, never the whole header.
   */
  renderLabel?: (label: string) => ReactNode
}

// The employee's ordinal ("#"), not the ABC-000 identifier the employee tables
// used to show: the ordinal is the number the applicant already knows from the
// workbook and every other screen, and this tooltip is what says so.
//
// One component for all four tables that head an ordinal column (innsetning
// gagna, einstaklingsmat, úrbótaáætlun, launadreifing) — and one pair of message
// ids with it, so a translator cannot make two of them say different things.
// The ids live in the `outlierGroup` namespace because that is where they were
// first published; a second pair would be a second Contentful entry to drift.
export const EmployeeOrdinalHeader = ({ renderLabel }: Props) => {
  const { formatMessage } = useLocale()
  const m = messages.salaryAnalysis.outlierGroup
  const label = formatMessage(m.ordinalColumn)

  return (
    <Box component="span" display="flex" alignItems="center" columnGap={1}>
      {renderLabel ? renderLabel(label) : label}
      <Tooltip
        placement="right"
        text={formatMessage(m.employeeColumnTooltip)}
      />
    </Box>
  )
}
