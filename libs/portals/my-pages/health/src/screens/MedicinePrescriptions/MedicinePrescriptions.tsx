import {
  HealthDirectoratePrescribedItemCategory,
  HealthDirectoratePrescription,
} from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  Filter,
  Input,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { debounceTime } from '@island.is/shared/constants'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'
import { messages } from '../../lib/messages'
import PrescriptionsTable from './components/PrescriptionsTable'
import { useGetMedicinePrescriptionsQuery } from './Prescriptions.generated'

const ITEMS_ON_PAGE = 10

const defaultFilterValues = {
  searchQuery: '',
  categories: [],
}

type FilterValues = {
  searchQuery: string
  categories: HealthDirectoratePrescribedItemCategory[]
}

const MedicinePrescriptions = () => {
  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)
  const [filterValues, setFilterValues] =
    useState<FilterValues>(defaultFilterValues)

  const { data, error, loading } = useGetMedicinePrescriptionsQuery({
    variables: { locale: lang },
  })

  const filteredPrescriptions =
    data?.healthDirectoratePrescriptions.prescriptions

  useEffect(() => {
    setPage(1)
  }, [filterValues])

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setFilterValues((prev) => ({
          ...prev,
          searchQuery: value,
        }))
      }, debounceTime.search),
    [],
  )

  const handleSearchChange = (value: string) => {
    debouncedSetSearchQuery(value)
  }

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel()
    }
  }, [debouncedSetSearchQuery])

  const toggleCategory = (
    category: HealthDirectoratePrescribedItemCategory,
  ) => {
    setFilterValues((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const filteredMedicines = useMemo<
    HealthDirectoratePrescription[] | undefined
  >(() => {
    if (!data?.healthDirectoratePrescriptions.prescriptions) {
      return []
    }

    return filteredPrescriptions?.filter((medicine) => {
      const matchesSearch = medicine.name
        ?.toLowerCase()
        .includes(filterValues.searchQuery.toLowerCase())

      const matchesCategories =
        filterValues.categories.length === 0 ||
        (medicine.category &&
          filterValues.categories.includes(medicine.category))

      // If no categories selected, ignore category filtering
      const shouldInclude =
        (filterValues.categories.length === 0 || matchesCategories) &&
        matchesSearch

      return shouldInclude
    })
  }, [
    filterValues,
    filteredPrescriptions,
    data?.healthDirectoratePrescriptions.prescriptions,
  ])

  const totalPages =
    filteredMedicines && filteredMedicines.length > ITEMS_ON_PAGE
      ? Math.ceil(filteredMedicines.length / ITEMS_ON_PAGE)
      : 0

  const paginatedData = filteredMedicines?.slice(
    ITEMS_ON_PAGE * (page - 1),
    ITEMS_ON_PAGE * page,
  )

  return (
    <IntroWrapper
      title={formatMessage(messages.medicinePrescriptions)}
      intro={formatMessage(messages.medicinePrescriptionIntroText)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirMedicinePrescriptionsTooltip,
      )}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}

      {!error && (
        <>
          <Filter
            variant="popover"
            align="left"
            reverse
            labelClearAll={formatMessage(m.clearAllFilters)}
            labelClear={formatMessage(m.clearFilter)}
            labelOpen={formatMessage(m.openFilter)}
            onFilterClear={() => {
              setFilterValues(defaultFilterValues)
            }}
            filterInput={
              <Input
                placeholder={formatMessage(m.searchPlaceholder)}
                name="rafraen-skjol-input"
                size="xs"
                label={formatMessage(m.searchLabel)}
                onChange={(e) => handleSearchChange(e.target.value)}
                backgroundColor="blue"
                icon={{ name: 'search' }}
              />
            }
          >
            <Box padding={4}>
              <Text
                variant="default"
                as="p"
                fontWeight="semiBold"
                paddingBottom={2}
              >
                {formatMessage(m.filterBy)}
              </Text>

              <Stack space={2}>
                {[
                  {
                    name: 'regularMedicine',
                    label: formatMessage(messages.regularMedicine),
                    category: HealthDirectoratePrescribedItemCategory.Regular,
                  },
                  {
                    name: 'temporaryMedicine',
                    label: formatMessage(messages.temporaryMedicine),
                    category: HealthDirectoratePrescribedItemCategory.Pn,
                  },
                  {
                    name: 'regimentMedicine',
                    label: formatMessage(messages.regimentMedicine),
                    category: HealthDirectoratePrescribedItemCategory.Regiment,
                  },
                ].map(({ name, label, category }) => (
                  <Checkbox
                    key={name}
                    name={name}
                    label={label}
                    value={name}
                    checked={filterValues.categories.includes(category)}
                    onChange={() => {
                      toggleCategory(category)
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Filter>
          <Box marginTop={4}>
            <PrescriptionsTable data={paginatedData} loading={loading} />
          </Box>
        </>
      )}

      {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(page)}
                component="button"
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null}
    </IntroWrapper>
  )
}

export default MedicinePrescriptions
