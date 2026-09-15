import { Box, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../lib/messages'

// The employee's ordinal ("#"), not the ABC-000 identifier the employee tables
// used to show: the ordinal is the number the applicant already knows from the
// workbook and every other screen, and this tooltip is what says so.
//
// One component for all four tables that head an ordinal column (innsetning
// gagna, einstaklingsmat, úrbótaáætlun, launadreifing) — and one pair of message
// ids with it, so a translator cannot make two of them say different things.
// The ids live in the `outlierGroup` namespace because that is where they were
// first published; a second pair would be a second Contentful entry to drift.
export const EmployeeOrdinalHeader = () => {
  const { formatMessage } = useLocale()
  const m = messages.salaryAnalysis.outlierGroup

  return (
    <Box component="span" display="flex" alignItems="center" columnGap={1}>
      {formatMessage(m.ordinalColumn)}
      <Tooltip
        placement="right"
        text={formatMessage(m.employeeColumnTooltip)}
      />
    </Box>
  )
}
