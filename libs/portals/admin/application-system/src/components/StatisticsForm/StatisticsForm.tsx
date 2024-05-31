import {
  Box,
  DatePicker,
  Filter,
  FilterInput,
  FilterMultiChoice,
  Select,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { ApplicationFilters, MultiChoiceFilter } from '../../types/filters'
import { m } from '../../lib/messages'
import { statusMapper } from '../../shared/utils'
import { log } from 'console'
import { ApplicationStatus } from '@island.is/application/types'

type Props = {
  onDateChange: (period: ApplicationFilters['period']) => void
}

export const StatisticsForm = ({ onDateChange }: Props) => {
  const { formatMessage } = useLocale()
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  const filters: ApplicationFilters = {
    nationalId: undefined,
    period: { from: undefined, to: undefined },
    institution: undefined,
    status: undefined,
  }

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <Box display="flex" flexDirection={['column', 'column', 'row']}>
        <Box marginX={[0, 0, 2]} marginY={[2, 2, 0]}>
          <DatePicker
            id="periodFrom"
            label=""
            backgroundColor="blue"
            maxDate={filters.period.to}
            selected={filters.period.from}
            placeholderText={formatMessage(m.filterFrom)}
            handleChange={(from) => onDateChange({ from })}
            size="xs"
            locale="is"
          />
        </Box>
        <DatePicker
          id="periodTo"
          label=""
          backgroundColor="blue"
          minDate={filters.period.from}
          selected={filters.period.to}
          placeholderText={formatMessage(m.filterTo)}
          handleChange={(to) => onDateChange({ to })}
          size="xs"
          locale="is"
        />
      </Box>
    </Box>
  )
}
