import {
  Box,
  Text,
  FilterMultiChoice,
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
import { useEffect, useState } from 'react'
import { useDebounce, useWindowSize } from 'react-use'
import { m } from '../../lib/messages'
import { statusMapper } from '../../shared/utils'
import { ApplicationFilters, MultiChoiceFilter } from '../../types/filters'
import { format as formatNationalId } from 'kennitala'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useGetInstitutionApplicationTypesQuery } from '../../queries/overview.generated'

interface Props {
  onSearchChange: (query: string) => void
  onDateChange: (period: ApplicationFilters['period']) => void
  onFilterChange: FilterMultiChoiceProps['onChange']
  onFilterClear: (categoryId?: string) => void
  multiChoiceFilters: Record<MultiChoiceFilter, string[] | undefined>
  filters: ApplicationFilters
  numberOfDocuments?: number
}

export const InstitutionFilters = ({
  onSearchChange,
  onFilterChange,
  onFilterClear,
  onDateChange,
  multiChoiceFilters,
  filters,
  numberOfDocuments,
}: Props) => {
  const [nationalId, setNationalId] = useState('')
  const { formatMessage } = useLocale()
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()
  const userInfo = useUserInfo()

  const { data: typeData, loading: typesLoading } =
    useGetInstitutionApplicationTypesQuery({
      variables: {
        input: {
          nationalId: userInfo.profile.nationalId,
        },
      },
    })

  useDebounce(
    () => {
      onSearchChange(nationalId)
    },
    debounceTime.search,
    [nationalId],
  )

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const institutionTypeIds =
    typeData?.applicationTypesInstitutionAdmin?.map((type) => ({
      value: type.id,
      label: type.name ?? '',
    })) ?? []

  return (
    <>
      <Box marginBottom={3} width="full">
        <Select
          placeholder="Tegund umsóknar"
          backgroundColor="blue"
          options={institutionTypeIds}
          onChange={(v) => {
            if (v?.value) {
              onFilterChange({
                categoryId: MultiChoiceFilter.TYPE_ID,
                selected: [v.value],
              })
            }
          }}
          isLoading={typesLoading}
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        flexDirection={['column', 'column', 'column', 'row']}
        marginBottom={4}
      >
        <Filter
          variant={isMobile ? 'dialog' : 'popover'}
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
            <Box display="flex" flexDirection={['column', 'column', 'row']}>
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
          }
        >
          <FilterMultiChoice
            labelClear={formatMessage(m.clearSelected)}
            singleExpand={true}
            onChange={onFilterChange}
            onClear={onFilterClear}
            categories={[
              {
                id: MultiChoiceFilter.STATUS,
                label: formatMessage(m.status),
                selected: multiChoiceFilters[MultiChoiceFilter.STATUS] ?? [],
                inline: false,
                singleOption: false,
                filters: Object.entries(statusMapper).map(([value, tag]) => ({
                  value,
                  label: formatMessage(tag.label),
                })),
              },
            ]}
          />
        </Filter>
      </Box>
      {numberOfDocuments !== undefined && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flexEnd"
          alignItems="center"
          width="full"
        >
          <Hidden below="md">
            <Text variant="small" fontWeight="semiBold" whiteSpace="nowrap">
              {formatMessage(m.resultCount, { count: numberOfDocuments })}
            </Text>
          </Hidden>
        </Box>
      )}
    </>
  )
}
