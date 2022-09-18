import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import cn from 'classnames'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Inline,
  LoadingDots,
  Select,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import type {
  ExtendedShipStatusInformation,
  ExtendedCatchQuotaCategory,
  MutationUpdateShipStatusForTimePeriodArgs,
  QueryGetShipStatusForTimePeriodArgs,
  QuotaType,
  QueryGetQuotaTypesForTimePeriodArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_AFLAMARK_INFORMATION_FOR_SHIP,
  GET_UPDATED_SHIP_STATUS_FOR_TIME_PERIOD,
} from './queries'
import { generateTimePeriodOptions, TimePeriodOption } from '../../utils'
import { useNamespace } from '@island.is/web/hooks'
import { GET_QUOTA_TYPES_FOR_TIME_PERIOD } from '../QuotaTypeSelect/queries'

import * as styles from './AflamarkCalculator.css'

const emptyValue = { value: -1, label: '' }

const isNumber = (val: string | string[]) => {
  return !isNaN(Number(val)) && val?.length > 0
}

type Changes = Record<
  number,
  {
    id: number
    catchChange: string | undefined
    catchQuotaChange: string | undefined
  }
>

type ChangeErrors = Record<
  number,
  {
    id: number
    catchChange: boolean
    catchQuotaChange: boolean
  }
>

interface AflamarkCalculatorProps {
  namespace: Record<string, string>
}

export const AflamarkCalculator = ({ namespace }: AflamarkCalculatorProps) => {
  const [shipNumber, setShipNumber] = useState<number>(-1)
  const router = useRouter()

  const n = useNamespace(namespace)

  const [optionsInDropdown, setOptionsInDropdown] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([])

  const timePeriodOptions = useMemo(() => generateTimePeriodOptions(), [])

  const [data, setData] = useState<ExtendedShipStatusInformation | null>(null)

  const [
    selectedTimePeriod,
    setSelectedTimePeriod,
  ] = useState<TimePeriodOption>(timePeriodOptions[0])

  useEffect(() => {
    if (router?.query?.nr && isNumber(router.query.nr)) {
      setShipNumber(Number(router.query.nr))
    }
  }, [router?.query?.nr])

  const [quotaState, setQuotaState] = useState({
    quotaShare: {},
    nextYearQuota: {},
    nextYearFromQuota: {},
    catchQuota: {},
  })

  const quotaTypeResponse = useQuery<
    { getQuotaTypesForTimePeriod: QuotaType[] },
    QueryGetQuotaTypesForTimePeriodArgs
  >(GET_QUOTA_TYPES_FOR_TIME_PERIOD, {
    variables: {
      input: {
        timePeriod: selectedTimePeriod.value,
      },
    },
    onCompleted(res) {
      const quotaData = res?.getQuotaTypesForTimePeriod
      if (!quotaData) return
      const quotaTypes = quotaData
        .filter((qt) => qt?.name)
        .map((qt) => ({
          value: qt.id,
          label: qt.name,
        }))
      if (selectedOptions.length === 0) {
        quotaTypes.sort((a, b) => a.label.localeCompare(b.label))
        setOptionsInDropdown(quotaTypes)
      }
    },
  })

  const initialResponse = useQuery<
    { getShipStatusForTimePeriod: ExtendedShipStatusInformation },
    QueryGetShipStatusForTimePeriodArgs
  >(GET_AFLAMARK_INFORMATION_FOR_SHIP, {
    variables: {
      input: {
        shipNumber,
        timePeriod: selectedTimePeriod.value,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted(response) {
      const initialData = response?.getShipStatusForTimePeriod
      if (initialData) {
        setData(initialData)
        setQuotaState({
          quotaShare: initialData?.catchQuotaCategories?.reduce(
            (acc, category) => ({
              ...acc,
              [category.id]: category.quotaShare,
            }),
            {},
          ),
          catchQuota: initialData?.catchQuotaCategories?.reduce(
            (acc, category) => ({
              ...acc,
              [category.id]: category.catchQuota,
            }),
            {},
          ),
          nextYearFromQuota: initialData?.catchQuotaCategories?.reduce(
            (acc, category) => ({
              ...acc,
              [category.id]: category.nextYearFromQuota,
            }),
            {},
          ),
          nextYearQuota: initialData?.catchQuotaCategories?.reduce(
            (acc, category) => ({
              ...acc,
              [category.id]: category.nextYearQuota,
            }),
            {},
          ),
        })
      }
    },
  })

  useEffect(() => {
    if (
      data?.catchQuotaCategories?.length > 0 &&
      quotaTypeResponse?.data?.getQuotaTypesForTimePeriod?.length > 0
    ) {
      const quotaTypes = quotaTypeResponse.data.getQuotaTypesForTimePeriod
      setOptionsInDropdown(
        quotaTypes
          .filter(
            (t) => !data?.catchQuotaCategories?.find((c) => c?.id === t?.id),
          )
          .map((t) => ({ label: t.name, value: t.id })),
      )
    }
  }, [data, quotaTypeResponse])

  const validateChanges = () => {
    let valid = true
    const errors = {}
    for (const change of Object.values(changes)) {
      if (isNaN(Number(change?.catchChange)) && change?.catchChange) {
        valid = false
        errors[change?.id] = { ...errors[change?.id], catchChange: true }
      }
      if (isNaN(Number(change?.catchQuotaChange)) && change?.catchQuotaChange) {
        valid = false
        errors[change?.id] = {
          ...errors[change?.id],
          catchQuotaChange: true,
        }
      }
    }
    setChangeErrors(errors)
    return valid
  }

  const [mutate, mutationResponse] = useMutation<
    { updateShipStatusForTimePeriod: ExtendedShipStatusInformation },
    MutationUpdateShipStatusForTimePeriodArgs
  >(GET_UPDATED_SHIP_STATUS_FOR_TIME_PERIOD, {
    fetchPolicy: 'no-cache',
    onCompleted(response) {
      const mutationData = response?.updateShipStatusForTimePeriod
      if (mutationData) {
        const categories = []
        for (const category of data?.catchQuotaCategories ?? []) {
          const extendedCategory = {
            ...category,
            ...mutationData.catchQuotaCategories?.find(
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
          catchQuotaCategories: categories,
        })
      }
    },
  })

  const loading = initialResponse.loading || mutationResponse.loading
  const error = initialResponse.error

  const [changes, setChanges] = useState<Changes>({})
  const [changeErrors, setChangeErrors] = useState<ChangeErrors>({})

  const getFieldDifference = (
    category: ExtendedCatchQuotaCategory,
    fieldName: string,
  ) => {
    const a = mutationResponse?.data?.updateShipStatusForTimePeriod?.catchQuotaCategories?.find(
      (c) => c.id === category.id,
    )?.[fieldName]
    const b = initialResponse?.data?.getShipStatusForTimePeriod?.catchQuotaCategories?.find(
      (c) => c.id === category.id,
    )?.[fieldName]

    if (!a || !b) return undefined

    return a - b
  }

  const calculate = () => {
    const changeValues = Object.values(changes)

    if (!validateChanges()) {
      return
    }

    mutate({
      variables: {
        input: {
          shipNumber,
          timePeriod: selectedTimePeriod.value,
          changes: changeValues.map((change) => ({
            ...change,
            catchChange: Math.round(Number(change.catchChange ?? 0)),
            catchQuotaChange: Math.round(Number(change.catchQuotaChange ?? 0)),
          })),
        },
      },
    })
  }

  const reset = () => {
    setChanges({})
    setChangeErrors({})
    setQuotaState({
      quotaShare: initialResponse?.data?.getShipStatusForTimePeriod?.catchQuotaCategories?.reduce(
        (acc, category) => ({
          ...acc,
          [category.id]: category.quotaShare,
        }),
        {},
      ),
      catchQuota: initialResponse?.data?.getShipStatusForTimePeriod?.catchQuotaCategories?.reduce(
        (acc, category) => ({
          ...acc,
          [category.id]: category.catchQuota,
        }),
        {},
      ),
      nextYearFromQuota: initialResponse?.data?.getShipStatusForTimePeriod?.catchQuotaCategories?.reduce(
        (acc, category) => ({
          ...acc,
          [category.id]: category.nextYearFromQuota,
        }),
        {},
      ),
      nextYearQuota: initialResponse?.data?.getShipStatusForTimePeriod?.catchQuotaCategories?.reduce(
        (acc, category) => ({
          ...acc,
          [category.id]: category.nextYearQuota,
        }),
        {},
      ),
    })
    const initialData = initialResponse?.data?.getShipStatusForTimePeriod
    if (initialData) {
      const initialCategories = initialData?.catchQuotaCategories ?? []
      const codValue = initialCategories.find((c) => c.id === 0)
      const categories = [
        codValue,
        ...initialCategories.filter((c) => c.id !== 0),
      ]
      setData({
        ...initialData,
        catchQuotaCategories: categories,
      })
    }
    setSelectedOptions((prevSelected) => {
      setOptionsInDropdown((prevDropdown) => {
        const updatedDropdown = prevDropdown.concat(prevSelected)
        updatedDropdown.sort((a, b) => a.label.localeCompare(b.label))
        return updatedDropdown
      })
      return []
    })
  }

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
          <Box className={styles.selectBox} marginBottom={3}>
            <Select
              size="sm"
              label="Bæta við tegund"
              name="tegund-fiskur-select"
              options={optionsInDropdown}
              onChange={(selectedOption: { value: number; label: string }) => {
                if (
                  !initialResponse?.data?.getShipStatusForTimePeriod
                    ?.catchQuotaCategories?.length
                ) {
                  return
                }
                setSelectedOptions((prev) => prev.concat(selectedOption))
                setOptionsInDropdown((prev) => {
                  return prev.filter((o) => o.value !== selectedOption.value)
                })
                setData((prev) => {
                  return {
                    ...prev,
                    catchQuotaCategories: prev.catchQuotaCategories
                      .filter((c) => c.id !== selectedOption.value)
                      .concat({
                        name: selectedOption.label,
                        id: selectedOption.value,
                        allocation: 0,
                        catchQuota: 0,
                        betweenShips: 0,
                        betweenYears: 0,
                        catch: 0,
                        displacement: 0,
                        excessCatch: 0,
                        newStatus: 0,
                        nextYear: 0,
                        specialAlloction: 0,
                        status: 0,
                        unused: 0,
                      }),
                  }
                })
              }}
              value={emptyValue}
            />
          </Box>
        </Inline>
        <Box marginTop={[3, 3, 0]}>
          <Inline alignY="center" space={3}>
            <Button onClick={reset} variant="ghost" size="small">
              {n('reset', 'Frumstilla')}
            </Button>
            <Button
              disabled={Object.keys(changes).length === 0}
              onClick={calculate}
              size="small"
            >
              {n('calculate', 'Reikna')}
            </Button>
          </Inline>
        </Box>
      </Box>

      <Box className={styles.tagContainer}>
        <Inline alignY="center" space={2}>
          {selectedOptions.map((o) => (
            <Tag
              onClick={() => {
                setSelectedOptions((prevSelected) =>
                  prevSelected.filter((prev) => prev.value !== o.value),
                )
                setOptionsInDropdown((prevDropdown) => {
                  const updatedDropdown = prevDropdown.concat(o)
                  updatedDropdown.sort((a, b) => a.label.localeCompare(b.label))
                  return updatedDropdown
                })
                setData((prev) => ({
                  ...prev,
                  catchQuotaCategories: prev?.catchQuotaCategories?.filter(
                    (c) => c?.id !== o.value,
                  ),
                }))
              }}
              key={o.value}
            >
              <Box flexDirection="row" alignItems="center">
                {o.label}
                <span className={styles.crossmark}>&#10005;</span>
              </Box>
            </Tag>
          ))}
          {selectedOptions.length > 0 && (
            <Button
              onClick={() => {
                setSelectedOptions((prevSelected) => {
                  setData((prev) => {
                    const selectedIds = prevSelected.map((s) => s.value)
                    return {
                      ...prev,
                      catchQuotaCategories: prev?.catchQuotaCategories?.filter(
                        (c) => !selectedIds.includes(c?.id),
                      ),
                    }
                  })
                  setOptionsInDropdown((prevDropdown) => {
                    const updatedDropdown = prevDropdown.concat(prevSelected)
                    updatedDropdown.sort((a, b) =>
                      a.label.localeCompare(b.label),
                    )
                    return updatedDropdown
                  })
                  return []
                })
              }}
              variant="text"
              size="small"
              colorScheme="default"
            >
              Hreinsa allt
            </Button>
          )}
        </Inline>
      </Box>

      <Box
        width="full"
        textAlign="center"
        style={{ visibility: loading ? 'visible' : 'hidden' }}
      >
        <LoadingDots />
      </Box>

      {!data?.catchQuotaCategories?.length && !loading && !error && (
        <Box width="full" textAlign="center">
          <Text>Engar niðurstöður fundust</Text>
        </Box>
      )}

      {error && (
        <Box width="full" textAlign="center">
          <Text>Villa kom upp við að sækja aflamarksupplýsingar</Text>
        </Box>
      )}

      {data?.catchQuotaCategories?.length > 0 && (
        <Box marginTop={3} className={styles.tableBox}>
          <table className={styles.tableContainer}>
            <thead className={styles.tableHead}>
              <tr>
                <th>{n('kvotategund', 'Kvótategund')}</th>
                {data?.catchQuotaCategories?.map((category) => {
                  return <th key={category.name}>{category.name}</th>
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{n('uthlutun', 'Úthlutun')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.allocation}</td>
                ))}
              </tr>
              <tr>
                <td>{n('serstokUthlutun', 'Sérst. úthl.')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.specialAlloction}</td>
                ))}
              </tr>
              <tr>
                <td>{n('milliAra', 'Milli ára')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.betweenYears}</td>
                ))}
              </tr>
              <tr>
                <td>{n('milliSkipa', 'Milli skipa')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.betweenShips}</td>
                ))}
              </tr>
              <tr>
                <td>{n('aflamarksbreyting', 'Aflamarksbr.')}</td>
                {/* TODO: keep track of difference from initial aflamark to what it is now */}
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      getFieldDifference(category, 'catchQuota')
                    ) : (
                      <input
                        onKeyDown={(ev) => {
                          if (ev.key === 'Enter') calculate()
                        }}
                        className={cn({
                          [styles.error]:
                            changeErrors?.[category.id]?.catchQuotaChange,
                        })}
                        value={changes?.[category.id]?.catchQuotaChange ?? ''}
                        onChange={(ev) => {
                          setChanges((prevChanges) => {
                            return {
                              ...prevChanges,
                              [category.id]: {
                                id: category.id,
                                catchQuotaChange: ev.target.value,
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
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.catchQuota}</td>
                ))}
              </tr>
              <tr>
                <td>{n('afli', 'Afli')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.catch}</td>
                ))}
              </tr>
              <tr>
                <td>{n('aflabreyting', 'Aflabreyting')}</td>

                {data?.catchQuotaCategories?.map((category) => {
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
                                  catchQuotaChange:
                                    prevChanges[category.id]?.catchQuotaChange,
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
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.status}</td>
                ))}
              </tr>
              <tr>
                <td>{n('tilfaersla', 'Tilfærsla')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.displacement}</td>
                ))}
              </tr>
              <tr>
                <td>{n('nyStada', 'Ný staða')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.newStatus}</td>
                ))}
              </tr>
              <tr>
                <td>{n('aNaestaAr', 'Á næsta ár')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.nextYear}</td>
                ))}
              </tr>
              <tr>
                <td>{n('umframafli', 'Umframafli')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.excessCatch}</td>
                ))}
              </tr>
              <tr>
                <td>{n('onotad', 'Ónotað')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>{category.unused}</td>
                ))}
              </tr>

              <tr>
                <td className={styles.visualSeparationLine}>
                  {n('heildaraflamark', 'Heildaraflamark')}
                </td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td
                    className={styles.visualSeparationLine}
                    key={category.name}
                  >
                    {category.totalCatchQuota}
                  </td>
                ))}
              </tr>

              <tr>
                <td>{n('hlutdeild', 'Hlutdeild')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      category.quotaShare
                    ) : (
                      <input
                        type="text"
                        value={
                          quotaState?.quotaShare?.[category.id] ??
                          category.quotaShare
                        }
                        onChange={(ev) => {
                          setChanges((prevChanges) => {
                            const totalCatchQuota = data?.catchQuotaCategories?.find(
                              (c) => c?.id === category.id,
                            )?.totalCatchQuota
                            if (
                              !isNumber(ev.target.value) ||
                              totalCatchQuota === undefined
                            ) {
                              return prevChanges
                            }

                            const newRateOfShare = Number(ev.target.value) / 100

                            const newCatchQuota =
                              newRateOfShare * totalCatchQuota

                            const prevCatchQuota = data?.catchQuotaCategories?.find(
                              (c) => c?.id === category.id,
                            )?.allocation

                            const newCatchQuotaChange =
                              newCatchQuota - prevCatchQuota

                            setQuotaState((prev) => {
                              const percentNextYearQuota =
                                (data?.catchQuotaCategories?.find(
                                  (c) => c?.id === category.id,
                                )?.percentNextYearQuota ?? 0) / 100

                              const percentNextYearFromQuota =
                                (data?.catchQuotaCategories?.find(
                                  (c) => c?.id === category.id,
                                )?.percentNextYearFromQuota ?? 0) / 100

                              return {
                                ...prev,
                                quotaShare: {
                                  ...prev?.quotaShare,
                                  [category.id]: ev.target.value,
                                },
                                nextYearQuota: {
                                  ...prev?.nextYearQuota,
                                  [category.id]: String(
                                    Math.round(
                                      percentNextYearQuota *
                                        newCatchQuota *
                                        100,
                                    ) / 100,
                                  ),
                                },
                                nextYearFromQuota: {
                                  ...prev?.nextYearFromQuota,
                                  [category.id]: String(
                                    Math.round(
                                      percentNextYearFromQuota *
                                        newCatchQuota *
                                        100,
                                    ) / 100,
                                  ),
                                },
                              }
                            })

                            return {
                              ...prevChanges,
                              [category.id]: {
                                ...prevChanges?.[category.id],
                                id: category.id,
                                catchQuotaChange: String(
                                  Math.round(newCatchQuotaChange * 100) / 100,
                                ),
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
                <td>{n('aNaestaArKvoti', 'Á næsta ár kvóti')}</td>

                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      category.nextYearQuota
                    ) : (
                      <input
                        value={
                          quotaState?.nextYearQuota?.[category.id] ??
                          category.nextYearQuota
                        }
                        onChange={(ev) => {
                          setQuotaState((prev) => ({
                            ...prev,
                            nextYearQuota: {
                              ...prev?.nextYearQuota,
                              [category.id]: ev.target.value,
                            },
                          }))
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('afNaestaArKvoti', 'Af næsta ár kvóti')}</td>
                {data?.catchQuotaCategories?.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      category.nextYearFromQuota
                    ) : (
                      <input
                        value={
                          quotaState?.nextYearFromQuota?.[category.id] ??
                          category.nextYearFromQuota
                        }
                        onChange={(ev) => {
                          setQuotaState((prev) => {
                            return {
                              ...prev,
                              nextYearFromQuota: {
                                ...prev?.nextYearFromQuota,
                                [category.id]: ev.target.value,
                              },
                            }
                          })
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  )
}
