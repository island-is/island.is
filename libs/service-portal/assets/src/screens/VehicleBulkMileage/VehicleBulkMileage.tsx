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
} from '@island.is/service-portal/core'

import { vehicleMessage as messages } from '../../lib/messages'
import * as styles from './VehicleBulkMileage.css'
import VehicleBulkMileageTable from '../../components/VehicleBulkMileageTable/VehicleBulkMileageTable'

const ORIGIN_CODE = 'ISLAND.IS'

const VehicleMileage = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

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
          row={[
            {
              id: 'aaa',
              line: ['Tesla Model S', 'XYZ789', '6.333 km'],
              detail: [
                ['01.04.2024', 'Aðalskoðum', '6.333 km', '24.639 km'],
                ['01.02.2022', 'Nýskráning', '221 km', '333 km'],
              ],
            },
            {
              id: 'bbb',
              line: ['Mitsubishi Outlander', 'ABC123', '2.221 km'],
              detail: [
                ['01.07.2024', 'Aðalskoðum', '2.221 km', '11.639 km'],
                ['01.02.2024', 'Nýskráning', '221 km', '1.639 km'],
              ],
            },
          ]}
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
