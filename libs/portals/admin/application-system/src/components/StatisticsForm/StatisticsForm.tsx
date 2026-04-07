import { Box, DatePicker, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { ApplicationFilters } from '../../types/filters'
import { m } from '../../lib/messages'
import { Organization } from '@island.is/shared/types'

type Props = {
  onDateChange: (period: ApplicationFilters['period']) => void
  dateInterval?: ApplicationFilters['period']
  organizations?: Organization[]
  selectedInstitutionNationalId?: string
  onInstitutionChange?: (nationalId: string) => void
}

export const StatisticsForm = ({
  onDateChange,
  dateInterval,
  organizations,
  selectedInstitutionNationalId,
  onInstitutionChange,
}: Props) => {
  const { formatMessage } = useLocale()

  const sortedOrganizations = organizations
    ? [...organizations].sort((a, b) => a.title.localeCompare(b.title))
    : []

  const selectedOption = selectedInstitutionNationalId
    ? sortedOrganizations.find(
        (o) => o.nationalId === selectedInstitutionNationalId,
      ) ?? null
    : null

  return (
    <Box
      display="flex"
      flexDirection={['column', 'column', 'row']}
      alignItems={['stretch', 'stretch', 'flexEnd']}
    >
      {organizations !== undefined && (
        <Box flexGrow={1} marginRight={[0, 0, 2]} marginBottom={[2, 2, 0]}>
          <Select
            id="statisticsInstitution"
            label={formatMessage(m.institution)}
            backgroundColor="blue"
            size="sm"
            placeholder={formatMessage(m.institutionDropdownPlaceholder)}
            isDisabled={sortedOrganizations.length === 0}
            value={
              selectedOption
                ? {
                    value: selectedOption.nationalId ?? '',
                    label: selectedOption.title,
                  }
                : null
            }
            onChange={(v) => onInstitutionChange?.(v?.value ?? '')}
            options={sortedOrganizations.map((o) => ({
              value: o.nationalId ?? '',
              label: o.title,
            }))}
            isClearable
          />
        </Box>
      )}
      <Box
        display="flex"
        flexWrap="wrap"
        flexGrow={1}
        alignItems="flexEnd"
        style={{ gap: '8px' }}
      >
        <Box style={{ flex: '1 1 160px' }}>
          <DatePicker
            id="periodFrom"
            label={formatMessage(m.filterFrom)}
            backgroundColor="blue"
            selected={dateInterval?.from}
            placeholderText={formatMessage(m.filterFrom)}
            handleChange={(from) => onDateChange({ from })}
            size="sm"
            locale="is"
          />
        </Box>
        <Box style={{ flex: '1 1 160px' }}>
          <DatePicker
            id="periodTo"
            label={formatMessage(m.filterTo)}
            backgroundColor="blue"
            selected={dateInterval?.to}
            placeholderText={formatMessage(m.filterTo)}
            handleChange={(to) => onDateChange({ to })}
            size="sm"
            locale="is"
          />
        </Box>
      </Box>
    </Box>
  )
}
