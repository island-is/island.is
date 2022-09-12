import { useQuery } from '@apollo/client'
import {
  Inline,
  LoadingDots,
  Box,
  Button,
  Select,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  QueryGetShipStatusForCalendarYearArgs,
  ShipStatusInformation,
} from '@island.is/web/graphql/schema'
import { useMemo, useState } from 'react'
import { GET_SHIP_STATUS_FOR_TIME_PERIOD } from './queries'

import { getYearOptions, YearOption } from '../../utils'
import { QuotaTypeSelect } from '../QuotaTypeSelect'

import * as styles from './DeilistofnaCalculator.css'

type Changes = Record<
  number,
  {
    id: number
    catchChange: string | undefined
    allowedCatchChange: string | undefined
  }
>

export const DeilistofnaCalculator = () => {
  const shipNumber = 1281

  const yearOptions = useMemo(() => getYearOptions(), [])

  const [selectedYear, setSelectedYear] = useState<YearOption>(yearOptions[0])

  const { data, loading, error } = useQuery<
    { getShipStatusForCalendarYear: ShipStatusInformation },
    QueryGetShipStatusForCalendarYearArgs
  >(GET_SHIP_STATUS_FOR_TIME_PERIOD, {
    variables: {
      input: { shipNumber: shipNumber, year: selectedYear.value },
    },
  })

  const [changes, setChanges] = useState<Changes>({})

  const shipInformation = data?.getShipStatusForCalendarYear

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
          <QuotaTypeSelect type="deilistofn" year={selectedYear.value} />
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

      {!loading && !shipInformation && !error && (
        <Box width="full" textAlign="center">
          <Text>Engar niðurstöður fundust</Text>
        </Box>
      )}

      {error && (
        <Box width="full" textAlign="center">
          <Text>Villa kom upp við að sækja deilistofna</Text>
        </Box>
      )}

      {shipInformation?.allowedCatchCategories && (
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
                  <input
                    value={changes?.[category.id]?.allowedCatchChange ?? ''}
                    onChange={(ev) => {
                      setChanges((prevChanges) => {
                        return {
                          ...prevChanges,
                          [category.id]: {
                            id: category.id,
                            allowedCatchChange: ev.target.value,
                            catchChange: prevChanges[category.id]?.catchChange,
                          },
                        }
                      })
                    }}
                    type="text"
                  />
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
                  <input
                    value={changes?.[category.id]?.allowedCatchChange ?? ''}
                    onChange={(ev) => {
                      setChanges((prevChanges) => {
                        return {
                          ...prevChanges,
                          [category.id]: {
                            id: category.id,
                            allowedCatchChange:
                              prevChanges[category.id]?.allowedCatchChange,
                            catchChange: ev.target.value,
                          },
                        }
                      })
                    }}
                    type="text"
                  />
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
      )}
    </Box>
  )
}
