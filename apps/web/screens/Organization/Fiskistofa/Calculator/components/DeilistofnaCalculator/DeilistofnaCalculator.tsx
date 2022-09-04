import { useQuery } from '@apollo/client'
import {
  Inline,
  LoadingDots,
  Box,
  Button,
  Input,
  Select,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  GetDeilistofnaInformationForShipInput,
  ShipStatusInformation,
} from '@island.is/web/graphql/schema'
import { useMemo, useState } from 'react'
import { GET_DEILISTOFNA_INFORMATION_FOR_SHIP } from './queries'

import { getYearOptions, YearOption } from '../../utils'

import * as styles from './DeilistofnaCalculator.css'
import { FishSelect } from '../FishSelect'

type GetDeilistofnaInformationForShipQuery = {
  getDeilistofnaInformationForShip: ShipStatusInformation
}

type GetDeilistofnaInformationForShipQueryArgs = {
  input: GetDeilistofnaInformationForShipInput
}

export const DeilistofnaCalculator = () => {
  const shipNumber = 1281

  const yearOptions = useMemo(() => getYearOptions(), [])

  const [selectedYear, setSelectedYear] = useState<YearOption>(yearOptions[0])

  const { data, loading } = useQuery<
    GetDeilistofnaInformationForShipQuery,
    GetDeilistofnaInformationForShipQueryArgs
  >(GET_DEILISTOFNA_INFORMATION_FOR_SHIP, {
    variables: {
      input: { shipNumber: shipNumber, year: selectedYear.value },
    },
  })

  const shipInformation = data?.getDeilistofnaInformationForShip

  return (
    <Box margin={6}>
      <Box display={['block', 'block', 'flex']} justifyContent="spaceBetween">
        <Inline space={3}>
          <Box className={styles.selectBox}>
            <Select
              size="sm"
              label="Ár"
              name="timabil-select"
              options={yearOptions}
              value={selectedYear}
              onChange={(newYear) => {
                setSelectedYear(newYear as YearOption)
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
        style={{ visibility: loading ? 'visible' : 'hidden' }}
      >
        <LoadingDots />
      </Box>
      <Box
        width="full"
        textAlign="center"
        style={{
          visibility: !loading && !shipInformation ? 'visible' : 'hidden',
        }}
      >
        <Text>Engar niðurstöður fundust</Text>
      </Box>

      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Kvótategund</T.HeadData>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.HeadData key={category.name}>{category.name}</T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          <T.Row>
            <T.Data>Úthlutun</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.allocation}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Sérst. úthl.</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.specialAlloction}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Milli ára</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.betweenYears}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Milli skipa</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.betweenShips}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Aflamarksbr.</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>
                <input type="text" />
              </T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Aflamark</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.allowedCatch}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Afli</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.catch}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Aflabreyting</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>
                <input type="text" />
              </T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Staða</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.status}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Tilfærsla</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.displacement}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Ný staða</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.newStatus}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Á næsta ár</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.nextYear}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Umframafli</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.excessCatch}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Ónotað</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.unused}</T.Data>
            ))}
          </T.Row>
        </T.Body>
      </T.Table>
    </Box>
  )
}
