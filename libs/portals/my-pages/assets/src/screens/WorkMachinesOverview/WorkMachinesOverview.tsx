import { WorkMachinesFileType } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  DropdownMenu,
  Filter,
  GridColumn,
  GridRow,
  Hidden,
  Inline,
  Input,
  Pagination,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  FootNote,
  formatDate,
  formSubmit,
  IntroHeader,
  m,
  VINNUEFTIRLITID_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { messages, vehicleMessage } from '../../lib/messages'
import { AssetsPaths } from '../../lib/paths'
import {
  useGetWorkMachineDocumentLazyQuery,
  useGetWorkMachinesQuery,
} from './WorkMachinesOverview.generated'

type FilterValue = {
  label: string
  value: boolean
}

type FilterValues = {
  deregistered: FilterValue
  ownerChange: FilterValue
  registeredSupervisor: FilterValue
}

const DEFAULT_PAGE_SIZE = 8
const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_ORDER_BY = 'RegistrationNumber'

const WorkMachinesOverview = () => {
  useNamespaces('sp.work-machines')
  const { formatMessage, locale } = useLocale()

  const defaultFilterValues: FilterValues = {
    deregistered: {
      label: 'showDeregisteredWorkMachines',
      value: false,
    },
    ownerChange: {
      label: 'showOwnerChangingWorkMachines',
      value: false,
    },
    registeredSupervisor: {
      label: 'showOwnerSupervisorRegisteredWorkMachines',
      value: false,
    },
  }

  const [activeFilters, setActiveFilters] =
    useState<FilterValues>(defaultFilterValues)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeSearch, setActiveSearch] = useState<string>('')

  const [page, setPage] = useState(DEFAULT_PAGE_NUMBER)

  const [getDocumentExport, { data: fileData }] =
    useGetWorkMachineDocumentLazyQuery()

  const { loading, error, data } = useGetWorkMachinesQuery({
    variables: {
      input: {
        locale,
        pageNumber: page,
        pageSize: DEFAULT_PAGE_SIZE,
        searchQuery: activeSearch,
        orderBy: DEFAULT_ORDER_BY,
        showDeregisteredMachines: activeFilters.deregistered.value,
        supervisorRegistered: activeFilters.registeredSupervisor.value,
        onlyInOwnerChangeProcess: activeFilters.ownerChange.value,
      },
    },
  })
  useDebounce(
    () => {
      setActiveSearch(searchTerm)
    },
    500,
    [searchTerm],
  )

  useEffect(() => {
    if (fileData?.workMachinesCollectionDocument?.downloadUrl) {
      formSubmit(fileData.workMachinesCollectionDocument?.downloadUrl)
    }
  }, [fileData])

  const getFileExport = (fileType: WorkMachinesFileType) => {
    getDocumentExport({
      variables: {
        input: {
          fileType: fileType,
        },
      },
    })
  }

  const onFilterChange = (key: keyof FilterValues, value: FilterValue) => {
    setActiveFilters({
      ...activeFilters,
      [key]: {
        ...value,
        value: !value.value,
      },
    })
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.workMachinesTitle)}
        intro={formatMessage(messages.workMachinesDescription)}
        serviceProviderSlug={VINNUEFTIRLITID_SLUG}
        serviceProviderTooltip={formatMessage(m.workmachineTooltip)}
      />
      <GridRow marginTop={[2, 2, 6]}>
        <GridColumn span="12/12">
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="flexStart"
            printHidden
          >
            <Box marginBottom={3} paddingRight={2}>
              <Inline space={2}>
                <Hidden print={true}>
                  <Filter
                    labelOpen={formatMessage(m.openFilter)}
                    labelClose={formatMessage(m.closeFilter)}
                    labelClear={formatMessage(m.clearFilter)}
                    labelClearAll={formatMessage(m.clearAllFilters)}
                    labelTitle={formatMessage(m.filterBy)}
                    onFilterClear={() => setActiveFilters(defaultFilterValues)}
                    variant="popover"
                    reverse
                    filterInput={
                      <Input
                        icon={{ name: 'search' }}
                        backgroundColor="blue"
                        size="xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        name="work-machines-input-search"
                        placeholder={formatMessage(
                          messages.workMachinesSearchPlaceholder,
                        )}
                      />
                    }
                  >
                    {
                      <Box paddingX={3} marginTop={2}>
                        <Text variant="h4">{formatMessage(m.filterBy)}</Text>
                        <Box paddingY={3}>
                          {Object.keys(activeFilters).map(
                            (filterKey, index) => {
                              const key = filterKey as keyof FilterValues
                              const filter = activeFilters[key]
                              const labelKey =
                                filter.label as keyof typeof messages
                              return (
                                <Box
                                  paddingTop={index === 0 ? 0 : 1}
                                  key={index}
                                >
                                  <Checkbox
                                    id={`work-machine-filter-${index}`}
                                    label={formatMessage(messages[labelKey])}
                                    checked={filter.value}
                                    onChange={() => onFilterChange(key, filter)}
                                  />
                                </Box>
                              )
                            },
                          )}
                        </Box>
                        <Box
                          borderBottomWidth="standard"
                          borderColor="blue200"
                          width="full"
                        />
                      </Box>
                    }
                  </Filter>
                </Hidden>
                <DropdownMenu
                  title={formatMessage(m.get)}
                  icon="download"
                  items={[
                    {
                      onClick: () => getFileExport(WorkMachinesFileType.CSV),
                      title: formatMessage(m.getAsCsv),
                    },
                    {
                      onClick: () => getFileExport(WorkMachinesFileType.EXCEL),
                      title: formatMessage(m.getAsExcel),
                    },
                  ]}
                />
              </Inline>
            </Box>
          </Box>
        </GridColumn>
        <GridColumn span={'4/12'}>{}</GridColumn>
      </GridRow>
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && loading && <CardLoader />}
      {!error &&
        !loading &&
        !data?.workMachinesPaginatedCollection?.data?.length && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noDataFoundVariableFeminine, {
              arg: formatMessage(m.workMachines).toLowerCase(),
            })}
            message={formatMessage(
              m.noDataFoundVariableDetailVariationFeminine,
              {
                arg: formatMessage(m.workMachines).toLowerCase(),
              },
            )}
            imgSrc="./assets/images/sofa.svg"
          />
        )}
      {!loading &&
        !error &&
        !!data?.workMachinesPaginatedCollection?.data &&
        data.workMachinesPaginatedCollection.data.map((wm, index) => {
          return (
            <Box marginBottom={3} key={index}>
              <ActionCard
                text={`${formatMessage(vehicleMessage.lastInspection)}: ${
                  wm.dateLastInspection
                    ? formatDate(wm.dateLastInspection)
                    : formatMessage(messages.noInspection)
                }`}
                heading={wm.type ?? ''}
                cta={{
                  label: formatMessage(m.seeDetails),
                  variant: 'text',
                  url:
                    wm.id && wm.registrationNumber
                      ? AssetsPaths.AssetsWorkMachinesDetail.replace(
                          ':regNumber',
                          wm.registrationNumber,
                        ).replace(':id', wm.id)
                      : undefined,
                }}
                tag={{
                  variant: 'blue',
                  outlined: false,
                  label: wm.status ?? '',
                }}
              />
            </Box>
          )
        })}
      {!loading &&
        !error &&
        !!data?.workMachinesPaginatedCollection?.totalCount && (
          <Box>
            <Pagination
              page={page}
              totalPages={Math.ceil(
                data.workMachinesPaginatedCollection.totalCount /
                  DEFAULT_PAGE_SIZE,
              )}
              renderLink={(page, className, children) => (
                <button className={className} onClick={() => setPage(page)}>
                  {children}
                </button>
              )}
            />
          </Box>
        )}
      <Box marginTop={2}>
        <FootNote serviceProviderSlug={VINNUEFTIRLITID_SLUG} />
      </Box>
    </Box>
  )
}

export default WorkMachinesOverview
