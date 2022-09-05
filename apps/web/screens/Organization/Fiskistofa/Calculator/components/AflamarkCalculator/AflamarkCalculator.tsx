import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Inline,
  Input,
  LoadingDots,
  Select,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import type {
  GetAflamarkInformationForShipInput,
  ExtendedShipStatusInformation,
} from '@island.is/web/graphql/schema'
import { GET_AFLAMARK_INFORMATION_FOR_SHIP } from './queries'
import { generateTimePeriodOptions, TimePeriodOption } from '../../utils'
import { FishSelect } from '../FishSelect'

import * as styles from './AflamarkCalculator.css'

type GetAflamarkInformationForShipQuery = {
  getAflamarkInformationForShip: ExtendedShipStatusInformation
}

type GetAflamarkInformationForShipQueryArgs = {
  input: GetAflamarkInformationForShipInput
}

export const AflamarkCalculator = () => {
  const shipNumber = 1281

  const timePeriodOptions = useMemo(() => generateTimePeriodOptions(), [])

  const [
    selectedTimePeriod,
    setSelectedTimePeriod,
  ] = useState<TimePeriodOption>(timePeriodOptions[0])

  const {
    data: shipInformationResponse,
    loading: loadingShipInformation,
  } = useQuery<
    GetAflamarkInformationForShipQuery,
    GetAflamarkInformationForShipQueryArgs
  >(GET_AFLAMARK_INFORMATION_FOR_SHIP, {
    variables: {
      input: {
        shipNumber,
        timePeriod: selectedTimePeriod.value,
      },
    },
  })

  const shipInformation = shipInformationResponse?.getAflamarkInformationForShip

  return (
    <Box margin={6}>
      <Box display={['block', 'block', 'flex']} justifyContent="spaceBetween">
        <Inline space={3} flexWrap="wrap">
          <Box className={styles.selectBox}>
            <Select
              size="sm"
              label="Tímabil"
              name="timabil-select"
              options={timePeriodOptions}
              value={selectedTimePeriod}
              onChange={(timePeriod) => {
                setSelectedTimePeriod(timePeriod as TimePeriodOption)
              }}
            />
          </Box>
          <FishSelect />
        </Inline>
        <Box marginTop={[3, 3, 0]}>
          <Inline alignY="center" space={3}>
            <Button variant="ghost" size="small">
              Frumstilla
            </Button>
            <Button size="small">Reikna</Button>
          </Inline>
        </Box>
      </Box>

      <Box
        width="full"
        textAlign="center"
        style={{ visibility: loadingShipInformation ? 'visible' : 'hidden' }}
      >
        <LoadingDots />
      </Box>
      <Box
        width="full"
        textAlign="center"
        style={{
          visibility:
            !loadingShipInformation && !shipInformation ? 'visible' : 'hidden',
        }}
      >
        <Text>Engar niðurstöður fundust</Text>
      </Box>

      <table>
        <thead>
          <tr>
            <th>Kvótategund</th>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <th key={category.name}>{category.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Úthlutun</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.allocation}</td>
            ))}
          </tr>
          <tr>
            <td>Sérst. úthl.</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.specialAlloction}</td>
            ))}
          </tr>
          <tr>
            <td>Milli ára</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.betweenYears}</td>
            ))}
          </tr>
          <tr>
            <td>Milli skipa</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.betweenShips}</td>
            ))}
          </tr>
          <tr>
            <td>Aflamarksbr.</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>
                <input type="text" />
              </td>
            ))}
          </tr>
          <tr>
            <td>Aflamark</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.allowedCatch}</td>
            ))}
          </tr>
          <tr>
            <td>Afli</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.catch}</td>
            ))}
          </tr>
          <tr>
            <td>Aflabreyting</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>
                <input type="text" />
              </td>
            ))}
          </tr>
          <tr>
            <td>Staða</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.status}</td>
            ))}
          </tr>
          <tr>
            <td>Tilfærsla</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.displacement}</td>
            ))}
          </tr>
          <tr>
            <td>Ný staða</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.newStatus}</td>
            ))}
          </tr>
          <tr>
            <td>Á næsta ár</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.nextYear}</td>
            ))}
          </tr>
          <tr>
            <td>Umframafli</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.excessCatch}</td>
            ))}
          </tr>
          <tr>
            <td>Ónotað</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.unused}</td>
            ))}
          </tr>
          <tr>
            <td>Heildaraflamark</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>
                <Text>{category.totalAllowedCatch}</Text>
              </td>
            ))}
          </tr>

          <tr>
            <td>Hlutdeild</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.rateOfShare}</td>
            ))}
          </tr>
          <tr>
            <td>Á næsta ár kvóti</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.nextYearQuota}</td>
            ))}
          </tr>
          <tr>
            <td>Af næsta ár kvóti</td>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>
                <Input size="xs" name="a" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Box>
  )
}
