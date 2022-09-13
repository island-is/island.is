import { useLazyQuery, useMutation } from '@apollo/client'
import cn from 'classnames'
import {
  Inline,
  LoadingDots,
  Box,
  Button,
  Select,
  Text,
} from '@island.is/island-ui/core'
import {
  AllowedCatchCategory,
  MutationGetUpdatedShipStatusForCalendarYearArgs,
  QueryGetShipStatusForCalendarYearArgs,
  ShipStatusInformation,
} from '@island.is/web/graphql/schema'
import { useMemo, useState } from 'react'
import {
  GET_SHIP_STATUS_FOR_TIME_PERIOD,
  GET_UPDATED_SHIP_STATUS_FOR_CALENDAR_YEAR,
} from './queries'
import { getYearOptions, YearOption } from '../../utils'
import { QuotaTypeSelect } from '../QuotaTypeSelect'
import { useRouter } from 'next/router'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './DeilistofnaCalculator.css'

type Changes = Record<
  number,
  {
    id: number
    catchChange: string | undefined
    allowedCatchChange: string | undefined
  }
>

type ChangeErrors = Record<
  number,
  {
    id: number
    catchChange: boolean
    allowedCatchChange: boolean
  }
>

interface DeilistofnaCalculatorProps {
  namespace: Record<string, string>
}

export const DeilistofnaCalculator = ({
  namespace,
}: DeilistofnaCalculatorProps) => {
  const router = useRouter()
  const yearOptions = useMemo(() => getYearOptions(), [])

  const shipNumber = useMemo<number | null>(() => {
    if (
      router?.query?.nr &&
      !isNaN(Number(router.query.nr)) &&
      router.query.nr.length > 0
    ) {
      return Number(router.query.nr)
    }
    return null
  }, [router?.query?.nr])

  const n = useNamespace(namespace)

  const [data, setData] = useState<ShipStatusInformation | null>(null)

  const [selectedYear, setSelectedYear] = useState<YearOption>(yearOptions[0])

  const [fetchShipStatus, initialResponse] = useLazyQuery<
    { getShipStatusForCalendarYear: ShipStatusInformation },
    QueryGetShipStatusForCalendarYearArgs
  >(GET_SHIP_STATUS_FOR_TIME_PERIOD, {
    fetchPolicy: 'no-cache',
    onCompleted(response) {
      const initialData = response?.getShipStatusForCalendarYear
      if (initialData) {
        const initialCategories = initialData?.allowedCatchCategories ?? []
        const codValue = initialCategories.find((c) => c.id === 0)
        const categories = [
          codValue,
          ...initialCategories.filter((c) => c.id !== 0),
        ]
        setData({
          ...initialData,
          allowedCatchCategories: categories,
        })
      }
    },
  })

  const [fetchUpdatedShipStatus, updatedResponse] = useMutation<
    { getUpdatedShipStatusForCalendarYear: ShipStatusInformation },
    MutationGetUpdatedShipStatusForCalendarYearArgs
  >(GET_UPDATED_SHIP_STATUS_FOR_CALENDAR_YEAR, {
    fetchPolicy: 'no-cache',
    onCompleted(response) {
      const mutationData = response?.getUpdatedShipStatusForCalendarYear
      if (mutationData) {
        const initialCategories = mutationData?.allowedCatchCategories ?? []
        const codValue = initialCategories.find((c) => c.id === 0)
        const categories = [
          codValue,
          ...initialCategories.filter((c) => c.id !== 0),
        ]
        setData({
          ...mutationData,
          allowedCatchCategories: categories,
        })
      }
    },
  })

  const getFieldDifference = (
    category: AllowedCatchCategory,
    fieldName: string,
  ) => {
    const a = updatedResponse?.data?.getUpdatedShipStatusForCalendarYear?.allowedCatchCategories?.find(
      (c) => c.id === category.id,
    )?.[fieldName]
    const b = initialResponse?.data?.getShipStatusForCalendarYear?.allowedCatchCategories?.find(
      (c) => c.id === category.id,
    )?.[fieldName]

    if (!a || !b) return undefined

    return a - b
  }

  const [changes, setChanges] = useState<Changes>({})
  const [changeErrors, setChangeErrors] = useState<ChangeErrors>({})

  const validateChanges = () => {
    let valid = true
    const errors = {}
    for (const change of Object.values(changes)) {
      if (isNaN(Number(change?.catchChange)) && change?.catchChange) {
        valid = false
        errors[change?.id] = { ...errors[change?.id], catchChange: true }
      }
      if (
        isNaN(Number(change?.allowedCatchChange)) &&
        change?.allowedCatchChange
      ) {
        valid = false
        errors[change?.id] = {
          ...errors[change?.id],
          allowedCatchChange: true,
        }
      }
    }
    setChangeErrors(errors)
    return valid
  }

  const calculate = () => {
    const changeValues = Object.values(changes)
    if (!validateChanges()) {
      return
    }
    fetchUpdatedShipStatus({
      variables: {
        input: {
          shipNumber,
          year: selectedYear.value,
          changes: changeValues.map((change) => ({
            ...change,
            catchChange: Number(change.catchChange ?? 0),
            allowedCatchChange: Number(change.allowedCatchChange ?? 0),
          })),
        },
      },
    })
  }

  const loading = initialResponse.loading || updatedResponse.loading
  const error = initialResponse.error || updatedResponse.error

  return (
    <Box margin={6}>
      <Box display={['block', 'block', 'flex']} justifyContent="spaceBetween">
        <Inline space={3}>
          <Box className={styles.selectBox}>
            <Select
              size="sm"
              label="Ár"
              name="year-select"
              options={yearOptions}
              value={selectedYear}
              onChange={(newYear) => {
                fetchShipStatus({
                  variables: {
                    input: {
                      shipNumber: shipNumber,
                      year: (newYear as YearOption).value,
                    },
                  },
                })
                setSelectedYear(newYear as YearOption)
              }}
            />
          </Box>
          <QuotaTypeSelect type="deilistofn" year={selectedYear.value} />
        </Inline>

        <Box marginTop={[3, 3, 0]}>
          <Inline alignY="center" space={3}>
            <Button variant="ghost" size="small">
              {n('reset', 'Frumstilla')}
            </Button>
            <Button onClick={calculate} size="small">
              {n('calculate', 'Reikna')}
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

      {!loading && !data && !error && (
        <Box width="full" textAlign="center">
          <Text>{n('noResultsFound', 'Engar niðurstöður fundust')}</Text>
        </Box>
      )}

      {error && (
        <Box width="full" textAlign="center">
          <Text>
            {n('deilistofnaError', 'Villa kom upp við að sækja deilistofna')}
          </Text>
        </Box>
      )}

      {data?.allowedCatchCategories && (
        <Box className={styles.tableBox}>
          <table className={styles.tableContainer}>
            <thead className={styles.tableHead}>
              <tr>
                <th>{n('kvotategund', 'Kvótategund')}</th>
                {data?.allowedCatchCategories?.map((category) => {
                  return <th key={category.name}>{category.name}</th>
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{n('uthlutun', 'Úthlutun')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.allocation}</td>
                ))}
              </tr>
              <tr>
                <td>{n('serstokUthlutun', 'Sérst. úthl.')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.specialAlloction}</td>
                ))}
              </tr>
              <tr>
                <td>{n('milliAra', 'Milli ára')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.betweenYears}</td>
                ))}
              </tr>
              <tr>
                <td>{n('milliSkipa', 'Milli skipa')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.betweenShips}</td>
                ))}
              </tr>
              <tr>
                <td>{n('aflamarksbreyting', 'Aflamarksbr.')}</td>
                {/* TODO: keep track of difference from initial aflamark to what it is now */}
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      getFieldDifference(category, 'allowedCatch')
                    ) : (
                      <input
                        onKeyDown={(ev) => {
                          if (ev.key === 'Enter') calculate()
                        }}
                        className={cn({
                          [styles.error]:
                            changeErrors?.[category.id]?.allowedCatchChange,
                        })}
                        value={changes?.[category.id]?.allowedCatchChange ?? ''}
                        onChange={(ev) => {
                          setChanges((prevChanges) => {
                            return {
                              ...prevChanges,
                              [category.id]: {
                                id: category.id,
                                allowedCatchChange: ev.target.value,
                                catchChange:
                                  prevChanges[category.id]?.catchChange,
                              },
                            }
                          })
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('aflamark', 'Aflamark')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.allowedCatch}</td>
                ))}
              </tr>
              <tr>
                <td>{n('afli', 'Afli')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.catch}</td>
                ))}
              </tr>
              <tr>
                <td>{n('aflabreyting', 'Aflabreyting')}</td>

                {data?.allowedCatchCategories?.map((category) => {
                  return (
                    <td key={category.name}>
                      {/* TODO: keep track of difference from initial afli to what it is now */}
                      {category.id === 0 ? (
                        getFieldDifference(category, 'catch')
                      ) : (
                        <input
                          onKeyDown={(ev) => {
                            if (ev.key === 'Enter') calculate()
                          }}
                          className={cn({
                            [styles.error]:
                              changeErrors?.[category.id]?.catchChange,
                          })}
                          value={changes?.[category.id]?.catchChange ?? ''}
                          onChange={(ev) => {
                            setChanges((prevChanges) => {
                              return {
                                ...prevChanges,
                                [category.id]: {
                                  id: category.id,
                                  catchChange: ev.target.value,
                                  allowedCatchChange:
                                    prevChanges[category.id]
                                      ?.allowedCatchChange,
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
                <td>{n('stada', 'Staða')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.status}</td>
                ))}
              </tr>
              <tr>
                <td>{n('tilfaersla', 'Tilfærsla')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.displacement}</td>
                ))}
              </tr>
              <tr>
                <td>{n('nyStada', 'Ný staða')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.newStatus}</td>
                ))}
              </tr>
              <tr>
                <td>{n('aNaestaAr', 'Á næsta ár')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.nextYear}</td>
                ))}
              </tr>
              <tr>
                <td>{n('umframafli', 'Umframafli')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.excessCatch}</td>
                ))}
              </tr>
              <tr>
                <td>{n('onotad', 'Ónotað')}</td>
                {data?.allowedCatchCategories?.map((category) => (
                  <td key={category.name}>{category.unused}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  )
}
