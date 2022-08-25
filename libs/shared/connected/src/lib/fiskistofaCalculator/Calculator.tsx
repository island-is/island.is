import { useQuery } from '@apollo/client'
import { GET_SHIP_STATUS_INFORMATION } from './queries'
import {
  GetShipStatusInformationInput,
  ShipStatusInformation,
} from '@island.is/api/domains/fiskistofa'
import {
  Box,
  Button,
  Input,
  LoadingDots,
  Select,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useRef, useState } from 'react'

export const Calculator = ({}) => {
  const shipNumberRef = useRef<number>(1281)
  const timePeriodRef = useRef<{ label: string; value: string }>({
    label: '19/20',
    value: '1920',
  })

  const [searchInput, setSearchInput] = useState<GetShipStatusInformationInput>(
    {
      shipNumber: shipNumberRef.current,
      timePeriod: timePeriodRef.current.value,
    },
  )

  const { data, loading } = useQuery<
    { getShipStatusInformation: ShipStatusInformation },
    { input: GetShipStatusInformationInput }
  >(GET_SHIP_STATUS_INFORMATION, {
    variables: { input: searchInput },
  })

  return (
    <Box>
      <Input
        name="shipnumber-input"
        onChange={(ev) => (shipNumberRef.current = Number(ev.target.value))}
        type="number"
        label="Skipsnúmer"
      />
      <Select
        name="time-period-select"
        options={[
          { label: '18/19', value: '1819' },
          { label: '19/20', value: '1920' },
          { label: '20/21', value: '2021' },
        ]}
      />
      <Button
        onClick={() =>
          setSearchInput((prev) => ({
            ...prev,
            shipNumber: shipNumberRef.current,
            timePeriod: timePeriodRef.current?.value,
          }))
        }
        size="small"
      >
        Leita
      </Button>

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
        style={{ visibility: !loading && !data ? 'visible' : 'hidden' }}
      >
        <Text>Engar niðurstöður fundust</Text>
      </Box>

      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Kvótategund</T.HeadData>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.HeadData key={category.name}>{category.name}</T.HeadData>
              ),
            )}
          </T.Row>
        </T.Head>
        <T.Body>
          <T.Row>
            <T.Data>Úthlutun</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.allocation}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Sérst. úthl.</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.specialAlloction}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Milli ára</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.betweenYears}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Milli skipa</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.betweenShips}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Aflamarksbr.</T.Data>
          </T.Row>
          <T.Row>
            <T.Data>Aflamark</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.allowedCatch}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Afli</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.catch}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Aflabreyting</T.Data>
          </T.Row>
          <T.Row>
            <T.Data>Staða</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.status}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Tilfærsla</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.displacement}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Ný staða</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.newStatus}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Á næsta ár</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.nextYear}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Umframafli</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.excessCatch}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Ónotað</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.unused}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Heildaraflamark</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.totalAllowedCatch}</T.Data>
              ),
            )}
          </T.Row>

          <T.Row>
            <T.Data>Hlutdeild</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.rateOfShare}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Á næsta ár kvóti</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.nextYearQuota}</T.Data>
              ),
            )}
          </T.Row>
          <T.Row>
            <T.Data>Af næsta ár kvóti</T.Data>
            {data?.getShipStatusInformation?.allowedCatchCategories?.map(
              (category) => (
                <T.Data>{category.nextYearFromQuota}</T.Data>
              ),
            )}
          </T.Row>
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default Calculator
