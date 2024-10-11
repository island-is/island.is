import { Box, DatePicker } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { ApplicationFilters } from '../../types/filters'
import { m } from '../../lib/messages'

type Props = {
  onDateChange: (period: ApplicationFilters['period']) => void
  dateInterval?: ApplicationFilters['period']
}

export const StatisticsForm = ({ onDateChange, dateInterval }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <Box display="flex" flexDirection={['column', 'column', 'row']}>
        <DatePicker
          id="periodFrom"
          label=""
          backgroundColor="blue"
          selected={dateInterval?.from}
          placeholderText={formatMessage(m.filterFrom)}
          handleChange={(from) => onDateChange({ from })}
          size="xs"
          locale="is"
        />
        <Box marginX={[0, 0, 2]} marginY={[2, 2, 0]}>
          <DatePicker
            id="periodTo"
            label=""
            backgroundColor="blue"
            selected={dateInterval?.to}
            placeholderText={formatMessage(m.filterTo)}
            handleChange={(to) => onDateChange({ to })}
            size="xs"
            locale="is"
          />
        </Box>
      </Box>
    </Box>
  )
}
