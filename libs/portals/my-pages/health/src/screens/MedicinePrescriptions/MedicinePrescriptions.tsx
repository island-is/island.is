import {
  HealthDirectoratePrescribedItemCategory,
  HealthDirectoratePrescription,
} from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  Filter,
  Icon,
  Input,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  m,
  SortableTable,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { debounceTime } from '@island.is/shared/constants'
import debounce from 'lodash/debounce'
import React, { useEffect, useMemo, useState } from 'react'
import DispensingContainer from '../../components/DispensingContainer/DispensingContainer'
import NestedInfoLines from '../../components/NestedInfoLines/NestedInfoLines'
import { messages } from '../../lib/messages'
import RenewPrescriptionModal from './components/RenewPrescriptionModal/RenewPrescriptionModal'
import { useGetMedicinePrescriptionsQuery } from './Prescriptions.generated'

const ITEMS_ON_PAGE = 10
const STRING_MAX_LENGTH = 22

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
  const [activePrescription, setActivePrescription] = React.useState<any>(null)
  const [openModal, setOpenModal] = useState(false)
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
                    name: 'regimenMedicine',
                    label: formatMessage(messages.regimenMedicine),
                    category: HealthDirectoratePrescribedItemCategory.Regimen,
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
            <SortableTable
              title=""
              labels={{
                medicine: formatMessage(messages.medicineTitle),
                usedFor: formatMessage(messages.usedFor),
                process: formatMessage(messages.process),
                validTo: formatMessage(messages.medicineValidTo),
                status: formatMessage(messages.renewal),
              }}
              expandable
              align="left"
              defaultSortByKey="medicine"
              mobileTitleKey="medicine"
              ellipsisLength={STRING_MAX_LENGTH}
              emptyTableMessage={formatMessage(messages.noSearchResults)}
              tableLoading={loading}
              items={
                paginatedData?.map((item, i) => ({
                  id: `${item.id}-${i}`,
                  medicine: item?.name ?? '',
                  usedFor: item?.indication ?? '',
                  process: item?.amountRemaining ?? '',
                  validTo: formatDate(item?.expiryDate) ?? '',
                  status: undefined,
                  lastNode: item?.isRenewable
                    ? {
                        type: 'action',
                        label: formatMessage(messages.renew),
                        action: () => {
                          setActivePrescription(item)
                          setOpenModal(true)
                        },
                        icon: { icon: 'reload', type: 'outline' },
                      }
                    : {
                        type: 'info',
                        label: item.renewalBlockedReason?.toString() ?? '',
                        text: formatMessage(messages.notValidForRenewal),
                      },

                  children: (
                    <Box background="blue100" paddingBottom={1}>
                      <Stack space={2}>
                        <NestedInfoLines
                          backgroundColor="blue"
                          label={formatMessage(messages.moreDetailedInfo)}
                          data={[
                            {
                              title: formatMessage(messages.medicineTitle),
                              value: item?.name ?? '',
                            },
                            {
                              title: formatMessage(messages.type),
                              value: item?.type ?? '',
                            },
                            {
                              title: formatMessage(messages.medicineForm),
                              value: item?.form ?? '',
                            },
                            {
                              title: formatMessage(messages.usedFor),
                              value: item?.indication ?? '',
                            },

                            {
                              title: formatMessage(messages.prescribedAmount),
                              value: item?.totalPrescribedAmount ?? '',
                            },
                            {
                              title: formatMessage(messages.usage),
                              value: item?.dosageInstructions ?? '',
                            },
                          ]}
                        />
                        <NestedInfoLines
                          backgroundColor="blue"
                          label={formatMessage(messages.version)}
                          data={[
                            {
                              title: formatMessage(messages.publicationDate),
                              value: formatDate(item?.issueDate) ?? '',
                            },
                            {
                              title: formatMessage(messages.doctor),
                              value: item?.prescriberName ?? '',
                            },
                            {
                              title: formatMessage(messages.medicineValidTo),
                              value: formatDate(item?.expiryDate) ?? '',
                            },
                          ]}
                        />
                        {item.dispensations.length > 0 && (
                          <DispensingContainer
                            backgroundColor="blue"
                            label={formatMessage(messages.dispenseHistory)}
                            data={item.dispensations.map(
                              (dispensation, di) => ({
                                date: formatDate(dispensation?.date),
                                icon: (
                                  <Icon
                                    icon={
                                      dispensation?.date
                                        ? 'checkmark'
                                        : 'remove'
                                    }
                                    size="medium"
                                    color={
                                      dispensation?.date ? 'mint600' : 'dark300'
                                    }
                                    type="outline"
                                  />
                                ),
                                number: (di + 1).toString() ?? '',
                                pharmacy: dispensation?.agentName ?? '',
                                quantity: dispensation?.count.toString() ?? '',
                              }),
                            )}
                          />
                        )}
                      </Stack>
                    </Box>
                  ),
                  subTitleFirstCol: item?.dosageInstructions ?? '',
                })) ?? []
              }
            />
          </Box>
        </>
      )}

      {activePrescription && (
        <RenewPrescriptionModal
          id={`renewPrescriptionModal-${activePrescription.id}`}
          activePrescription={activePrescription}
          toggleClose={openModal}
          isVisible={openModal}
        />
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
