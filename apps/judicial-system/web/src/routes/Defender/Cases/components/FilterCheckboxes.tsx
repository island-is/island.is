import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Checkbox } from '@island.is/island-ui/core'
import { tables } from '@island.is/judicial-system-web/messages'

import * as styles from './FilterCheckboxes.css'

interface Props {
  filters: {
    indictmentCaseFilter: boolean
    investigationCaseFilter: boolean
  }
  toggleFilter: (filter: keyof Props['filters']) => void
}

const FilterCheckboxes: React.FC<Props> = ({ filters, toggleFilter }) => {
  const { formatMessage } = useIntl()

  return (
    <Box marginTop={2} className={styles.gridRow}>
      <Checkbox
        name="indictmentCaseFilter"
        label={formatMessage(tables.filterIndictmentCaseLabel)}
        checked={filters.indictmentCaseFilter}
        onChange={() => toggleFilter('indictmentCaseFilter')}
      />
      <Checkbox
        name="investigationCaseFilter"
        label={formatMessage(tables.filterInvestigationCaseLabel)}
        checked={filters.investigationCaseFilter}
        onChange={() => toggleFilter('investigationCaseFilter')}
      />
    </Box>
  )
}

export default FilterCheckboxes
