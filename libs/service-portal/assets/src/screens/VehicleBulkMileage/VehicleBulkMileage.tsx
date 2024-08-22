import {
  Box,
  Button,
  Checkbox,
  Filter,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  FootNote,
  SAMGONGUSTOFA_SLUG,
  IntroHeader,
} from '@island.is/service-portal/core'
import { vehicleMessage as messages } from '../../lib/messages'
import * as styles from './VehicleBulkMileage.css'
import {
  useGetVehicleBulkMileageQuery,
} from './VehicleBulkMileage.generated'
import { Problem } from '@island.is/react-spa/shared'
import { useMemo } from 'react'
import VehicleBulkMileageState from './VehicleBulkMileageState'
import { VehicleBulkMileageProvider } from './VehicleBulkMileageContext'

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

  const mileageTable = useMemo(() => {
    if (data?.vehicleMileageBulkCollection.vehicles) {
      return (
        <VehicleBulkMileageState
          vehicles={data.vehicleMileageBulkCollection.vehicles.map(
            (vehicle) => ({
              permNo: vehicle.permNo,
              title: vehicle.title,
              lastRegistrationDate: vehicle.latestRegistration?.date
                ? new Date(vehicle.latestRegistration.date)
                : undefined,
              registrationHistory:
                vehicle?.mileageRegistrationHistory?.map((m) => ({
                  date: m.date,
                  origin: m.origin,
                  mileage: m.mileage.toString(),
                })) ?? [],
            }),
          )}
      )
    }
  }, [data?.vehicleMileageBulkCollection.vehicles])

  return (
    <>
      <VehicleBulkMileageProvider>
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
          {error && !loading && <Problem error={error} noBorder={false} />}
          {!error && loading && <SkeletonLoader />}
          {!loading && !error && !data?.vehicleMileageBulkCollection && (
            <Box marginTop={8}>
              <Problem
                type="no_data"
                noBorder={false}
                title={formatMessage(m.noData)}
                message={formatMessage(m.noDataFoundDetail)}
                imgSrc="./assets/images/sofa.svg"
              />
            </Box>
          )}
          {!loading && !error && data?.vehicleMileageBulkCollection && (
            <>
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
              {mileageTable}
            </>
          )}
        </Box>
      </VehicleBulkMileageProvider>
      <FootNote
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        notes={[{ text: formatMessage(messages.infoNote) }]}
      />
    </>
  )
}

export default VehicleMileage
