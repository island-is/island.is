import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Filter,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  FootNote,
  SAMGONGUSTOFA_SLUG,
  IntroHeader,
  formatDate,
} from '@island.is/service-portal/core'

import { vehicleMessage as messages } from '../../lib/messages'
import * as styles from './VehicleBulkMileage.css'
import VehicleBulkMileageTable from '../../components/VehicleBulkMileageTable/VehicleBulkMileageTable'
import {
  useGetVehicleBulkMileageQuery,
  usePostVehicleBulkMileageMutation,
} from './VehicleBulkMileage.generated'

const VehicleMileage = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const { data, error, loading } = useGetVehicleBulkMileageQuery({
    variables: {
      input: {
        page: 1,
        pageSize: 10,
      },
    },
  })

  const [postMileage, { loading: mileageLoading, error: mileageError }] =
    usePostVehicleBulkMileageMutation()

  const onRowSaveClick = (mileage: number, permNo: string) => {
    console.log(`save ${mileage} mileage for car ${permNo}`)
    postMileage({
      variables: {
        input: {
          mileage,
          permNo,
        },
      },
    })
  }

  if (!data?.vehicleMileageBulkCollection.vehicles) {
    return null
  }

  return (
    <>
      <Box marginBottom={[2, 2, 6]}>
        <IntroHeader
          title={m.vehiclesBulkMileage}
          introComponent={formatMessage(messages.vehicleMileageIntro, {
            href: (str: React.ReactNode) => (
              <span>
                <a
                  href={formatMessage(messages.mileageExtLink)}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  {str}
                </a>
              </span>
            ),
          })}
          serviceProviderSlug={SAMGONGUSTOFA_SLUG}
          serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
        />
        <GridRow marginTop={0}>
          <GridColumn span="9/9">
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="flexStart"
              marginBottom={3}
              printHidden
            >
              <Box paddingRight={2} marginBottom={[1, 1, 1, 0]}>
                <Button
                  colorScheme="default"
                  icon="document"
                  iconType="outline"
                  size="default"
                  variant="utility"
                  onClick={() => alert('Send docs')}
                >
                  {formatMessage(messages.bulkMileageButton)}
                </Button>
              </Box>
              <Box paddingRight={2} marginBottom={[1, 1, 1, 0]}>
                <Filter
                  labelClear={formatMessage(m.clearFilter)}
                  labelClearAll={formatMessage(m.clearAllFilters)}
                  labelOpen={formatMessage(m.openFilter)}
                  labelClose={formatMessage(m.closeFilter)}
                  variant="popover"
                  onFilterClear={() => {
                    console.log(`
                  setFilterValue(defaultFilterValues)
                  setPage(1)
                  `)
                  }}
                  align="left"
                  reverse
                >
                  <Box padding={4}>
                    <Text variant="eyebrow" as="p" paddingBottom={2}>
                      {formatMessage(m.filterBy)}
                    </Text>
                    <Checkbox
                      name="onlyMileageRequiredVehicles"
                      label={'Label'}
                      value="onlyMileageRequiredVehicles"
                      checked={false}
                      onChange={(e) => {
                        console.log(`
                      setPage(1)
                      setSearchLoading(true)
                      setFilterValue({
                        ...filterValue,
                        onlyMileageRequiredVehicles: e.target.checked,
                      })
                      `)
                      }}
                    />
                  </Box>
                </Filter>
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
        <VehicleBulkMileageTable
          onRowSaveClick={onRowSaveClick}
          row={data.vehicleMileageBulkCollection.vehicles.map((vehicle) => ({
            id: vehicle.permNo,
            line: [
              vehicle.title,
              vehicle.permNo,
              vehicle?.latestRegistration?.date
                ? formatDate(vehicle.latestRegistration.date)
                : '-',
            ],
            detail:
              vehicle?.mileageRegistrationHistory?.map((reg) => {
                return [
                  formatDate(reg.date),
                  reg.origin,
                  '-',
                  reg.mileage.toString(),
                ]
              }) ?? [],
          }))}
        />
      </Box>

      <FootNote
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        notes={[{ text: formatMessage(messages.infoNote) }]}
      />
    </>
  )
}

export default VehicleMileage
