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
} from '@island.is/service-portal/core'
import { dummy } from './mocks/propsDummy'
import { vehicleMessage as messages } from '../../lib/messages'
import * as styles from './VehicleBulkMileage.css'
import { useEffect } from 'react'
import VehicleBulkMileageTable from './VehicleBulkMileageTable'
import { useVehicleBulkMileageContext } from './VehicleBulkMileageContext'

const VehicleMileage = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const { setVehicles, vehicles } = useVehicleBulkMileageContext()

  useEffect(() => {
    setVehicles(dummy)
  }, [])

  const handleBulkSubmit = () => {
    console.log('bulk submitting')
    setVehicles(
      vehicles.map((v, index) => {
        if (index === 0) {
          return {
            ...v,
            submissionStatus: 'submit-all',
          }
        } else return v
      }),
    )
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

        <VehicleBulkMileageTable />
        <Button onClick={() => handleBulkSubmit()}>
          Vista allar sýnilegar færslur
        </Button>
      </Box>
      <FootNote
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        notes={[{ text: formatMessage(messages.infoNote) }]}
      />
    </>
  )
}

export default VehicleMileage
