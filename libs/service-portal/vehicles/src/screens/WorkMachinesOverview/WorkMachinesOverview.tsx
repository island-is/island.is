import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useGetWorkMachinesQuery } from './WorkMachinesOverview.generated'
import {
  m,
  ErrorScreen,
  EmptyState,
  CardLoader,
  ServicePortalPath,
  ActionCard,
} from '@island.is/service-portal/core'
import { IntroHeader } from '@island.is/portals/core'
import {
  Box,
  Checkbox,
  DropdownMenu,
  Filter,
  GridColumn,
  GridRow,
  Inline,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'

const WorkMachinesOverview = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const filterTypes: Array<{ label: string; value: string }> = [
    { label: 'Changing Owners', value: 'CHANGING_OWNERS' },
    { label: 'Show deregistered machines', value: 'SHOW_DEREGISTERED' },
    { label: 'Machines wiht upservioser', value: 'MACHINES_WITH_SUPERVISOR' },
  ]

  const [activeFilters, setActiveFilters] = useState<Array<string>>([])
  const [searchTerm, setSearchTerm] = useState('')

  const { loading, error, data } = useGetWorkMachinesQuery()

  const onGetCsv = () => {
    console.log('get csv')
  }

  const onGetExcel = () => {
    console.log('get Excel')
  }

  const onFilterChange = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
      return
    }
    const filterArray = activeFilters
    filterArray.splice(filterArray.indexOf(filter), 1)
    setActiveFilters([...filterArray])
  }

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.workMachines).toLowerCase(),
        })}
      />
    )
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.workMachinesTitle)}
        intro={formatMessage(messages.workMachinesDescription)}
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
                <Filter
                  labelOpen={formatMessage(m.openFilter)}
                  labelClose={formatMessage(m.closeFilter)}
                  labelClear={formatMessage(m.clearFilter)}
                  labelClearAll={formatMessage(m.clearAllFilters)}
                  labelTitle={formatMessage(m.filterBy)}
                  onFilterClear={() => setActiveFilters([])}
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
                      placeholder={formatMessage(messages.searchPlaceholder)}
                    />
                  }
                >
                  {
                    <Box paddingX={3} marginTop={2}>
                      <Text variant="h4">{formatMessage(m.filterBy)}</Text>
                      <Box paddingY={3}>
                        {filterTypes.map((filter, index) => (
                          <Checkbox
                            id={`work-machine-filter-${index}`}
                            label={filter.label}
                            value={filter.value}
                            checked={activeFilters.includes(filter.value)}
                            onChange={(e) => onFilterChange(e.target.value)}
                          />
                        ))}
                      </Box>
                      <Box
                        borderBottomWidth="standard"
                        borderColor="blue200"
                        width="full"
                      />
                    </Box>
                  }
                </Filter>
                <DropdownMenu
                  title={formatMessage(m.get)}
                  icon="download"
                  items={[
                    {
                      onClick: () => onGetCsv(),
                      title: formatMessage(m.getAsCsv),
                    },
                    {
                      onClick: () => onGetExcel(),
                      title: formatMessage(m.getAsExcel),
                    },
                  ]}
                />
              </Inline>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>

      {loading && (
        <Box marginBottom={2}>
          <CardLoader />
        </Box>
      )}

      {!loading && !data?.workMachinesWorkMachineEntity?.value && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {!loading &&
        !error &&
        data?.workMachinesWorkMachineEntity?.value &&
        data.workMachinesWorkMachineEntity.value.map((wm, index) => {
          return (
            <Box marginBottom={3} key={index}>
              <ActionCard
                text={wm.registrationNumber ?? ''}
                heading={wm.type ?? ''}
                cta={{
                  label: formatMessage(m.seeDetails),
                  variant: 'text',
                  url: wm.id
                    ? ServicePortalPath.AssetsWorkMachinesDetail.replace(
                        ':id',
                        wm.id,
                      )
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
    </Box>
  )
}

export default WorkMachinesOverview
