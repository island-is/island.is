import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Inline,
  LoadingDots,
  Select,
  Text,
} from '@island.is/island-ui/core'
import type {
  GetAflamarkInformationForShipInput,
  ExtendedShipStatusInformation,
  GetUpdatedAflamarkInformationForShipInput,
} from '@island.is/web/graphql/schema'
import {
  GET_AFLAMARK_INFORMATION_FOR_SHIP,
  GET_UPDATED_AFLAMARK_INFORMATION_FOR_SHIP,
} from './queries'
import { generateTimePeriodOptions, TimePeriodOption } from '../../utils'
import { FishSelect } from '../FishSelect'

import * as styles from './AflamarkCalculator.css'

type GetAflamarkInformationForShipQuery = {
  getAflamarkInformationForShip: ExtendedShipStatusInformation
}

type GetAflamarkInformationForShipQueryArgs = {
  input: GetAflamarkInformationForShipInput
}

type GetUpdatedAflamarkInformationForShipQuery = {
  getUpdatedAflamarkInformationForShip: ExtendedShipStatusInformation
}

type GetUpdatedAflamarkInformationForShipQueryArgs = {
  input: GetUpdatedAflamarkInformationForShipInput
}

type Changes = Record<
  number,
  {
    id: number
    catchChange: number | undefined
    allowedCatchChange: number | undefined
  }
>

export const AflamarkCalculator = () => {
  const shipNumber = 1281

  const timePeriodOptions = useMemo(() => generateTimePeriodOptions(), [])

  const [data, setData] = useState<ExtendedShipStatusInformation | null>(null)

  const [
    selectedTimePeriod,
    setSelectedTimePeriod,
  ] = useState<TimePeriodOption>(timePeriodOptions[0])

  const initialResponse = useQuery<
    GetAflamarkInformationForShipQuery,
    GetAflamarkInformationForShipQueryArgs
  >(GET_AFLAMARK_INFORMATION_FOR_SHIP, {
    variables: {
      input: {
        shipNumber,
        timePeriod: selectedTimePeriod.value,
      },
    },
    onCompleted(response) {
      const initialData = response?.getAflamarkInformationForShip
      if (initialData) setData(initialData)
    },
  })

  const [mutate, mutationResponse] = useMutation<
    GetUpdatedAflamarkInformationForShipQuery,
    GetUpdatedAflamarkInformationForShipQueryArgs
  >(GET_UPDATED_AFLAMARK_INFORMATION_FOR_SHIP, {
    onCompleted(response) {
      const mutationData = response?.getUpdatedAflamarkInformationForShip
      if (mutationData) {
        const categories = []
        for (const category of data?.allowedCatchCategories ?? []) {
          const extendedCategory = {
            ...category,
            ...mutationData.allowedCatchCategories?.find(
              (c) => c.id === category.id,
            ),
          }
          // Make sure that category with id 0 stays at the front
          if (extendedCategory.id === 0) {
            categories.unshift(extendedCategory)
          } else {
            categories.push(extendedCategory)
          }
        }
        setData({
          shipInformation: mutationData.shipInformation,
          allowedCatchCategories: categories,
        })
      }
    },
  })

  const loading = initialResponse.loading || mutationResponse.loading

  const [changes, setChanges] = useState<Changes>({})

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
            <Button
              onClick={() =>
                setData(initialResponse.data.getAflamarkInformationForShip)
              }
              variant="ghost"
              size="small"
            >
              Frumstilla
            </Button>
            <Button
              onClick={() => {
                mutate({
                  variables: {
                    input: {
                      shipNumber,
                      timePeriod: selectedTimePeriod.value,
                      changes: Object.values(changes).map((change) => ({
                        ...change,
                        catchChange: change.catchChange ?? 0,
                        allowedCatchChange: change.allowedCatchChange ?? 0,
                      })),
                    },
                  },
                })
              }}
              size="small"
            >
              Reikna
            </Button>
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
          visibility: !loading && !data ? 'visible' : 'hidden',
        }}
      >
        <Text>Engar niðurstöður fundust</Text>
      </Box>

      <table className={styles.tableContainer}>
        <thead className={styles.tableHead}>
          <tr>
            <th>Kvótategund</th>
            {data?.allowedCatchCategories?.map((category) => {
              return <th key={category.name}>{category.name}</th>
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Úthlutun</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.allocation}</td>
            ))}
          </tr>
          <tr>
            <td>Sérst. úthl.</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.specialAlloction}</td>
            ))}
          </tr>
          <tr>
            <td>Milli ára</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.betweenYears}</td>
            ))}
          </tr>
          <tr>
            <td>Milli skipa</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.betweenShips}</td>
            ))}
          </tr>
          <tr>
            <td>Aflamarksbr.</td>
            {/* TODO: keep track of difference from initial aflamark to what it is now */}
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>
                {category.id === 0 ? (
                  initialResponse.data.getAflamarkInformationForShip.allowedCatchCategories.find(c => c.id === category.id).
                ) : (
                  <input
                    value={changes?.[category.id]?.allowedCatchChange ?? ''}
                    onChange={(ev) => {
                      setChanges((prevChanges) => {
                        return {
                          ...prevChanges,
                          [category.id]: {
                            id: category.id,
                            allowedCatchChange: Number(ev.target.value),
                            catchChange: prevChanges[category.id]?.catchChange,
                          },
                        }
                      })
                    }}
                    type="text"
                  />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td>Aflamark</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.allowedCatch}</td>
            ))}
          </tr>
          <tr>
            <td>Afli</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.catch}</td>
            ))}
          </tr>
          <tr>
            <td>Aflabreyting</td>

            {data?.allowedCatchCategories?.map((category) => {
              return (
                <td key={category.name}>
                  {/* TODO: keep track of difference from initial afli to what it is now */}
                  {category.id === 0 ? (
                    0
                  ) : (
                    <input
                      type="text"
                      value={changes?.[category.id]?.catchChange ?? ''}
                      onChange={(ev) => {
                        setChanges((prevChanges) => {
                          return {
                            ...prevChanges,
                            [category.id]: {
                              id: category.id,
                              catchChange: Number(ev.target.value),
                              allowedCatchChange:
                                prevChanges[category.id]?.allowedCatchChange,
                            },
                          }
                        })
                      }}
                    />
                  )}
                </td>
              )
            })}
          </tr>
          <tr>
            <td>Staða</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.status}</td>
            ))}
          </tr>
          <tr>
            <td>Tilfærsla</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.displacement}</td>
            ))}
          </tr>
          <tr>
            <td>Ný staða</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.newStatus}</td>
            ))}
          </tr>
          <tr>
            <td>Á næsta ár</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.nextYear}</td>
            ))}
          </tr>
          <tr>
            <td>Umframafli</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.excessCatch}</td>
            ))}
          </tr>
          <tr>
            <td>Ónotað</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.unused}</td>
            ))}
          </tr>
          {/* TODO: add separator */}
          <tr>
            <td>Heildaraflamark</td>
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>{category.totalAllowedCatch}</td>
            ))}
          </tr>

          <tr>
            <td>Hlutdeild</td>

            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>
                {category.id === 0 ? (
                  category.rateOfShare
                ) : (
                  <input
                    type="text"
                    value={category.rateOfShare}
                    onChange={(ev) => {
                      // TODO: store changes in state
                    }}
                  />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td>Á næsta ár kvóti</td>
            {/* TODO: add input box */}
            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>
                {category.id === 0 ? (
                  category.nextYearQuota
                ) : (
                  <input
                    type="text"
                    value={category.nextYearQuota}
                    onChange={(ev) => {
                      // TODO: store changes in state
                    }}
                  />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td>Af næsta ár kvóti</td>

            {data?.allowedCatchCategories?.map((category) => (
              <td key={category.name}>
                {category.id === 0 ? (
                  category.nextYearFromQuota
                ) : (
                  <input
                    type="text"
                    value={category.nextYearFromQuota}
                    onChange={(ev) => {
                      // TODO: store changes in state
                    }}
                  />
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Box>
  )
}
