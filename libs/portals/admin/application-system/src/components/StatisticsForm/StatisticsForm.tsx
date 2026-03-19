import { Box, DatePicker, Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { ApplicationFilters } from '../../types/filters'
import { m } from '../../lib/messages'
import { Organization } from '@island.is/shared/types'

type Props = {
  onDateChange: (period: ApplicationFilters['period']) => void
  dateInterval?: ApplicationFilters['period']
  organizations?: Organization[]
  selectedInstitutionSlug?: string
  onInstitutionChange?: (slug: string) => void
}

export const StatisticsForm = ({
  onDateChange,
  dateInterval,
  organizations,
  selectedInstitutionSlug,
  onInstitutionChange,
}: Props) => {
  const { formatMessage } = useLocale()

  const sortedOrganizations = organizations
    ? [...organizations].sort((a, b) => a.title.localeCompare(b.title))
    : []

  const selectedOption = selectedInstitutionSlug
    ? sortedOrganizations.find((o) => o.slug === selectedInstitutionSlug) ??
      null
    : null

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <Box
        display="flex"
        flexDirection={['column', 'column', 'row']}
        alignItems="flexEnd"
        width="full"
      >
        {organizations !== undefined && (
          <Box flexGrow={1} marginRight={[0, 0, 2]} marginBottom={[2, 2, 0]}>
            <Select
              id="statisticsInstitution"
              label={formatMessage(m.institution)}
              backgroundColor="blue"
              size="xs"
              placeholder={formatMessage(m.institutionDropdownPlaceholder)}
              isDisabled={sortedOrganizations.length === 0}
              value={
                selectedOption
                  ? { value: selectedOption.slug, label: selectedOption.title }
                  : null
              }
              onChange={(v) => onInstitutionChange?.(v?.value ?? '')}
              options={sortedOrganizations.map((o) => ({
                value: o.slug,
                label: o.title,
              }))}
              isClearable
            />
          </Box>
        )}
        <Box marginBottom={[2, 2, 0]}>
          <DatePicker
            id="periodFrom"
            label={formatMessage(m.filterFrom)}
            backgroundColor="blue"
            selected={dateInterval?.from}
            placeholderText={formatMessage(m.filterFrom)}
            handleChange={(from) => onDateChange({ from })}
            size="xs"
            locale="is"
          />
        </Box>
        <Box marginX={[0, 0, 2]} marginY={[2, 2, 0]}>
          <DatePicker
            id="periodTo"
            label={formatMessage(m.filterTo)}
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
