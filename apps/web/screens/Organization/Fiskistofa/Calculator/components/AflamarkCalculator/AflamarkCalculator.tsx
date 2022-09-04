import { useRef, useState } from 'react'
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

type GetAflamarkInformationForShipQuery = {
  getAflamarkInformationForShip: ExtendedShipStatusInformation
}

type GetAflamarkInformationForShipQueryArgs = {
  input: GetAflamarkInformationForShipInput
}

import * as styles from './AflamarkCalculator.css'

export const AflamarkCalculator = () => {
  const shipNumberRef = useRef(1281)
  const timePeriodRef = useRef<{ label: string; value: string }>({
    label: '19/20',
    value: '1920',
  })

  const [
    searchInput,
    setSearchInput,
  ] = useState<GetAflamarkInformationForShipInput>({
    shipNumber: shipNumberRef.current,
    timePeriod: timePeriodRef.current.value,
  })

  const {
    data: shipInformationResponse,
    loading: loadingShipInformation,
  } = useQuery<
    GetAflamarkInformationForShipQuery,
    GetAflamarkInformationForShipQueryArgs
  >(GET_AFLAMARK_INFORMATION_FOR_SHIP, {
    variables: { input: searchInput },
  })

  const shipInformation = shipInformationResponse?.getAflamarkInformationForShip

  return (
    <Box margin={6}>
      <Inline alignY="center" space={3}>
        <Box width="full">
          <Input
            name="shipnumber-input"
            onChange={(ev) => (shipNumberRef.current = Number(ev.target.value))}
            type="number"
            label="Skipsnúmer"
          />
        </Box>
        <Box className={styles.selectBox}>
          <Select
            label="Tímabil"
            name="timabil-select"
            options={[
              { label: '18/19', value: '1819' },
              { label: '19/20', value: '1920' },
              { label: '20/21', value: '2021' },
            ]}
          />
        </Box>
        <Box className={styles.selectBox}>
          <Select
            label="Bæta við tegund"
            name="tegund-fiskur-select"
            options={[]}
          />
        </Box>
        <Button
          onClick={() =>
            setSearchInput((prev) => ({
              ...prev,
              shipNumber: shipNumberRef.current,
              timePeriod: timePeriodRef.current?.value,
            }))
          }
          size="default"
        >
          Go
        </Button>
      </Inline>
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

          <T.Row>
            <T.Data>Heildaraflamark</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.totalAllowedCatch}</T.Data>
            ))}
          </T.Row>

          <T.Row>
            <T.Data>Hlutdeild</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.rateOfShare}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Á næsta ár kvóti</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.nextYearQuota}</T.Data>
            ))}
          </T.Row>
          <T.Row>
            <T.Data>Af næsta ár kvóti</T.Data>
            {shipInformation?.allowedCatchCategories?.map((category) => (
              <T.Data key={category.name}>{category.nextYearFromQuota}</T.Data>
            ))}
          </T.Row>
        </T.Body>
      </T.Table>
    </Box>
  )
}
