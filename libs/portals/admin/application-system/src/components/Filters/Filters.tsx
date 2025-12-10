import { InstitutionTypes } from '@island.is/application/types'
import {
  Box,
  Text,
  Filter,
  FilterInput,
  Hidden,
  DatePicker,
  FilterMultiChoiceProps,
  Select,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { debounceTime } from '@island.is/shared/constants'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce, useWindowSize } from 'react-use'
import { m } from '../../lib/messages'
import { ApplicationFilters, MultiChoiceFilter } from '../../types/filters'
import { Organization } from '@island.is/shared/types'
import { format as formatNationalId } from 'kennitala'
import { useGetSuperApplicationTypesQuery } from '../../queries/overview.generated'

interface Props {
  onTypeIdChange: (period: ApplicationFilters['typeIdValue']) => void
  onSearchChange: (query: string) => void
  onDateChange: (period: ApplicationFilters['period']) => void
  onFilterChange: FilterMultiChoiceProps['onChange']
  onFilterClear: (categoryId?: string) => void
  multiChoiceFilters: Record<MultiChoiceFilter, string[] | undefined>
  filters: ApplicationFilters
  applications: string[]
  organizations: Organization[]
  numberOfDocuments?: number
  showInstitutionFilter?: boolean
}

export const Filters = ({
  onTypeIdChange,
  onSearchChange,
  onFilterClear,
  onFilterChange,
  onDateChange,
  filters,
  numberOfDocuments,
  multiChoiceFilters,
  organizations,
  showInstitutionFilter,
}: Props) => {
  const [typeId, setTypeId] = useState<string | undefined>(undefined)
  const [nationalId, setNationalId] = useState('')
  const { formatMessage } = useLocale()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const { width } = useWindowSize()

  const asInstitutions = Object.values(InstitutionTypes)
  const availableOrganizations = organizations
    .filter((x) => asInstitutions.findIndex((y) => y === x.slug) !== -1)
    .sort((a, b) => a.title.localeCompare(b.title))

  const { data: typeData, loading: typesLoading } =
    useGetSuperApplicationTypesQuery({})

  useDebounce(
    () => {
      onSearchChange(nationalId)
    },
    debounceTime.search,
    [nationalId],
  )

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }

    if (width < theme.breakpoints.lg) {
      setIsTablet(true)
    } else {
      setIsTablet(false)
    }
  }, [width])

  useEffect(() => {
    if (!filters.typeIdValue) setTypeId(undefined)
  }, [filters.typeIdValue, filters.nationalId, filters.searchStr])

  const institutionTypeIds = useMemo(() => {
    return (
      typeData?.applicationTypesSuperAdmin
        ?.map((type) => ({
          value: type.id,
          label: type.name ?? '',
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'is')) ?? []
    )
  }, [typeData])

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      flexDirection="column"
      marginBottom={4}
    >
      <Filter
        variant="default"
        mobileWrap={false}
        align="left"
        reverse
        resultCount={numberOfDocuments}
        labelClear={formatMessage(m.clearFilter)}
        labelClearAll={formatMessage(m.clearAllFilters)}
        labelOpen={formatMessage(m.openFilter)}
        labelClose={formatMessage(m.closeFilter)}
        labelResult={formatMessage(m.filterResults)}
        labelTitle={formatMessage(m.filter)}
        onFilterClear={() => onFilterClear()}
        filterInput={
          <Box display="flex" flexDirection={['column', 'column', 'column']}>
            <Box
              display="flex"
              flexDirection={['column', 'column', 'row']}
              width="full"
              marginBottom={3}
            >
              {showInstitutionFilter && (
                <Box
                  width={isMobile ? 'full' : 'half'}
                  paddingBottom={isMobile ? 3 : 0}
                >
                  <Select
                    id={MultiChoiceFilter.INSTITUTION}
                    label={formatMessage(m.institution)}
                    placeholder={formatMessage(
                      m.institutionDropdownPlaceholder,
                    )}
                    name="admin-applications-search"
                    backgroundColor="blue"
                    size="sm"
                    onChange={() =>
                      onFilterChange({
                        categoryId: MultiChoiceFilter.INSTITUTION,
                        selected:
                          multiChoiceFilters[MultiChoiceFilter.INSTITUTION] ??
                          [],
                      })
                    }
                    options={availableOrganizations.map((x) => ({
                      value: x.slug,
                      label: x.title,
                    }))}
                  />
                </Box>
              )}
              <Box
                width={isMobile || !showInstitutionFilter ? 'full' : 'half'}
                paddingLeft={isMobile || !showInstitutionFilter ? 0 : 3}
              >
                <Select
                  id={MultiChoiceFilter.TYPE_ID}
                  label={formatMessage(m.applicationType)}
                  placeholder={formatMessage(
                    m.applicationTypeDropdownPlaceholder,
                  )}
                  value={
                    institutionTypeIds.find((opt) => opt.value === typeId) ||
                    null
                  }
                  backgroundColor="blue"
                  onChange={(v) => {
                    setTypeId(v?.value)
                    onTypeIdChange(v?.value)
                  }}
                  size="sm"
                  options={institutionTypeIds}
                  isLoading={typesLoading}
                  isClearable={true}
                />
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection={['column', 'column', 'column', 'row']}
            >
              <Box
                width={isTablet ? 'full' : 'half'}
                paddingBottom={isTablet ? 3 : 0}
              >
                <FilterInput
                  placeholder={formatMessage(m.searchPlaceholder)}
                  name="admin-applications-nationalId"
                  value={
                    nationalId.length > 6
                      ? formatNationalId(nationalId)
                      : nationalId
                  }
                  onChange={setNationalId}
                  backgroundColor="blue"
                />
              </Box>
              <Box
                display="flex"
                width={isTablet ? 'full' : 'half'}
                paddingLeft={isTablet ? 0 : 3}
              >
                <Box width="half">
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
                <Box paddingLeft={3} width="half">
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
            </Box>
          </Box>
        }
      ></Filter>

      {numberOfDocuments !== undefined && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flexEnd"
          width="full"
          marginTop={1}
        >
          <Text variant="small" fontWeight="semiBold" whiteSpace="nowrap">
            {formatMessage(m.resultCount, { count: numberOfDocuments })}
          </Text>
        </Box>
      )}
    </Box>
  )
}
