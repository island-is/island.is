import {
  Box,
  Text,
  Filter,
  FilterInput,
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
import {
  useGetInstitutionApplicationTypesQuery,
  useGetSuperApplicationTypesQuery,
} from '../../queries/overview.generated'

interface Props {
  onTypeIdChange: (period: ApplicationFilters['typeIdValue']) => void
  onSearchChange: (query: string) => void
  onSearchStrChange: (query: string) => void
  onDateChange: (period: ApplicationFilters['period']) => void
  onFilterChange: FilterMultiChoiceProps['onChange']
  onFilterClear: (categoryId?: string) => void
  multiChoiceFilters: Record<MultiChoiceFilter, string[] | undefined>
  filters: ApplicationFilters
  applications: string[]
  organizations: Organization[]
  numberOfDocuments?: number
  isSuperAdmin?: boolean
  useAdvancedSearch?: boolean
}

export const Filters = ({
  onTypeIdChange,
  onSearchChange,
  onSearchStrChange,
  onFilterClear,
  onFilterChange,
  onDateChange,
  filters,
  numberOfDocuments,
  multiChoiceFilters,
  organizations,
  isSuperAdmin = false,
  useAdvancedSearch = false,
}: Props) => {
  const [typeId, setTypeId] = useState<string | undefined>(undefined)
  const [nationalId, setNationalId] = useState('')
  const [searchStr, setSearchStr] = useState('')
  const { formatMessage, locale: lang } = useLocale()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const { width } = useWindowSize()
  const [chosenInstituteNationalId, setChosenInstituteNationalId] = useState<
    string | undefined
  >(undefined)
  const [chosenInstituteSlug, setChosenInstituteSlug] = useState<
    string | undefined
  >(undefined)

  const sortedOrganizations = organizations.sort((a, b) =>
    a.title.localeCompare(b.title),
  )

  //TODOxy rename all to institutionType
  const {
    data: institutionData,
    loading: loadingInstitution,
    refetch: refetchInstitution,
  } = useGetInstitutionApplicationTypesQuery({
    ssr: false,
    skip: isSuperAdmin, //do NOT run if user IS superAdmin
  })

  const {
    data: superData,
    loading: loadingSuper,
    refetch: refetchSuper,
  } = useGetSuperApplicationTypesQuery({
    ssr: false,
    variables: {
      input: {
        nationalId: chosenInstituteNationalId,
      },
    },
    skip: !isSuperAdmin, //do NOT run if user is NOT superAdmin
  })

  useEffect(() => {
    const refetch = isSuperAdmin ? refetchSuper : refetchInstitution
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiChoiceFilters])

  useDebounce(
    () => {
      onSearchChange(nationalId)
    },
    debounceTime.search,
    [nationalId],
  )

  useDebounce(
    () => {
      onSearchStrChange(searchStr)
    },
    debounceTime.search,
    [searchStr],
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
    if (!filters.institution) {
      setChosenInstituteNationalId(undefined)
      setChosenInstituteSlug(undefined)
    }

    if (!filters.nationalId) setNationalId('')
    if (!filters.searchStr) setSearchStr('')
  }, [filters])

  const institutionTypeIds = useMemo(() => {
    return (
      (isSuperAdmin
        ? superData?.applicationTypesSuperAdmin
        : institutionData?.applicationTypesInstitutionAdmin
      )
        ?.map((type) => ({
          value: type.id,
          label: type.name ?? '',
        }))
        .sort((a, b) => a.label.localeCompare(b.label, lang)) ?? []
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin, superData, institutionData])

  const isLoading = loadingSuper || loadingInstitution

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
        onFilterClear={() => {
          onFilterClear()
          setChosenInstituteNationalId(undefined)
          setChosenInstituteSlug(undefined)
          setTypeId(undefined)
          setSearchStr('')
        }}
        filterInput={
          <Box display="flex" flexDirection={['column', 'column', 'column']}>
            <Box
              display="flex"
              flexDirection={['column', 'column', 'row']}
              width="full"
              marginBottom={3}
            >
              {isSuperAdmin && (
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
                    isClearable={true}
                    value={
                      chosenInstituteSlug
                        ? {
                            value: chosenInstituteSlug,
                            label:
                              organizations.find(
                                (x) => x.slug === chosenInstituteSlug,
                              )?.title || '',
                          }
                        : null
                    }
                    onChange={(v) => {
                      const institution = organizations.find(
                        (x) => x.slug === v?.value,
                      )
                      setChosenInstituteNationalId(
                        institution?.nationalId || '',
                      )
                      setChosenInstituteSlug(institution?.slug || '')
                      onFilterChange({
                        categoryId: MultiChoiceFilter.INSTITUTION,
                        selected: v ? [v.value] : [],
                      })
                    }}
                    options={sortedOrganizations.map((x) => ({
                      value: x.slug,
                      label: x.title,
                    }))}
                  />
                </Box>
              )}
              <Box
                width={isMobile || !isSuperAdmin ? 'full' : 'half'}
                paddingLeft={isMobile || !isSuperAdmin ? 0 : 3}
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
                  isLoading={isLoading}
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
                {useAdvancedSearch ? (
                  <FilterInput
                    placeholder={formatMessage(m.searchStrPlaceholder)}
                    name="admin-applications-search-str"
                    value={searchStr}
                    onChange={setSearchStr}
                    backgroundColor="blue"
                  />
                ) : (
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
                )}
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
                    isClearable={true}
                    handleClear={() => onDateChange({ from: undefined })}
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
                    isClearable={true}
                    handleClear={() => onDateChange({ to: undefined })}
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
