import { useEffect, useMemo, useState } from 'react'
import { useMachine } from '@xstate/react'
import cn from 'classnames'
import {
  Box,
  Button,
  Inline,
  LoadingDots,
  Select,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import {
  CatchQuotaCategory,
  ExtendedCatchQuotaCategory,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { generateTimePeriodOptions, TimePeriodOption } from '../../utils'
import { machine } from './machine'

import * as styles from './AflamarkCalculator.css'

const emptyValue = { value: -1, label: '' }

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
  shipNumber: number
  namespace: Record<string, string>
}

export const AflamarkCalculator = ({
  shipNumber,
  namespace,
}: AflamarkCalculatorProps) => {
  const timePeriodOptions = useMemo(() => generateTimePeriodOptions(), [])
  const n = useNamespace(namespace)
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(
    timePeriodOptions[0],
  )
  const [changes, setChanges] = useState<Changes>({})
  const [changeErrors, setChangeErrors] = useState<ChangeErrors>({})

  const [state, send] = useMachine(machine)

  useEffect(() => {
    send({
      type: 'GET_DATA',
      variables: {
        input: {
          shipNumber,
          timePeriod: selectedTimePeriod.value,
        },
      },
    })
  }, [shipNumber, selectedTimePeriod.value])

  const reset = () => {
    send({
      type: 'GET_DATA',
      variables: {
        input: {
          shipNumber,
          timePeriod: selectedTimePeriod.value,
        },
      },
    })
    setChanges({})
    setChangeErrors({})
  }

  const validateChanges = () => {
    let valid = true
    const errors = {}
    for (const change of Object.values(changes)) {
      // The catchChange needs to be numeric
      if (isNaN(Number(change?.catchChange)) && change?.catchChange) {
        valid = false
        errors[change?.id] = { ...errors[change?.id], catchChange: true }
      }

      // The catchQuotaChange needs to be numeric
      if (isNaN(Number(change?.catchQuotaChange)) && change?.catchQuotaChange) {
        valid = false
        errors[change?.id] = {
          ...errors[change?.id],
          catchQuotaChange: true,
        }
      }

      if (!valid) continue

      const category = state.context.data?.catchQuotaCategories?.find(
        (c) => c.id === change?.id,
      )

      // If the change is a very small negative value that surpasses the absolute value then we've got an error
      if (category) {
        const selectedQuotaTypeIds = state.context.selectedQuotaTypes.map(
          (qt) => qt.id,
        )
        const categoryWasAddedByUser = selectedQuotaTypeIds.includes(change?.id)

        // If the category was added by the user than any number less than 0 will cause an error
        const catchValue = categoryWasAddedByUser ? 0 : category.catch
        const catchQuotaValue = categoryWasAddedByUser ? 0 : category.catchQuota

        const catchDifference = catchValue + Number(change.catchChange)
        const catchQuotaDifference =
          catchQuotaValue + Number(change.catchQuotaChange)

        if (catchDifference < 0) {
          valid = false
          errors[change?.id] = { ...errors[change?.id], catchChange: true }
        }
        if (catchQuotaDifference < 0) {
          valid = false
          errors[change?.id] = {
            ...errors[change?.id],
            catchQuotaChange: true,
          }
        }
      }
    }
    setChangeErrors(errors)
    return valid
  }

  const calculate = () => {
    if (!validateChanges()) {
      return
    }
    const changeValues = Object.values(changes)
    send({
      type: 'UPDATE_GENERAL_DATA',
      variables: {
        input: {
          shipNumber,
          timePeriod: selectedTimePeriod.value,
          changes: changeValues.map((change) => ({
            ...change,
            catchChange: Number(change?.catchChange ?? 0),
            catchQuotaChange: Number(change?.catchQuotaChange ?? 0),
          })),
        },
      },
    })
  }

  const loading =
    state.matches('getting data') ||
    state.matches('updating general data') ||
    state.matches('updating quota data')

  const getFieldDifference = (
    category: ExtendedCatchQuotaCategory,
    fieldName: string,
  ) => {
    const current = state.context.data?.catchQuotaCategories?.find(
      (c) => c.id === category.id,
    )?.[fieldName]
    const initial = state.context.initialData?.catchQuotaCategories?.find(
      (c) => c.id === category.id,
    )?.[fieldName]

    if (!current || !initial) return undefined
    return current - initial
  }

  const quotaTypes = useMemo(
    () =>
      state.context.quotaTypes.map((qt) => ({
        label: qt.name,
        value: qt.id,
      })),
    [state.context.quotaTypes],
  )

  return (
    <Box margin={6}>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        flexDirection={['column', 'column', 'row']}
      >
        <Inline space={3}>
          <Box className={styles.selectBox}>
            <Select
              disabled={loading}
              size="sm"
              label={n('timeperiod', 'Tímabil')}
              name="time-period-select"
              options={timePeriodOptions}
              value={selectedTimePeriod}
              onChange={(newTimePeriod) => {
                setSelectedTimePeriod(newTimePeriod as TimePeriodOption)
              }}
            />
          </Box>
          <Box className={styles.selectBox} marginBottom={3}>
            <Select
              disabled={loading}
              value={emptyValue}
              size="sm"
              label={n('addType', 'Bæta við tegund')}
              name="tegund-fiskur-select"
              options={quotaTypes}
              onChange={(selectedOption: { value: number; label: string }) => {
                send({
                  type: 'ADD_CATEGORY',
                  category: selectedOption,
                })
              }}
            />
          </Box>
        </Inline>

        <Box marginTop={[3, 3, 0]}>
          <Inline alignY="center" space={3} flexWrap="nowrap">
            <Button
              onClick={reset}
              variant="ghost"
              size="small"
              disabled={loading}
            >
              {n('reset', 'Frumstilla')}
            </Button>
            <Button
              onClick={calculate}
              size="small"
              disabled={loading || Object.values(changes).length === 0}
            >
              {n('calculate', 'Reikna')}
            </Button>
          </Inline>
        </Box>
      </Box>

      <Text variant="small">
        {n('fishingTimePeriod', 'Fiskveiðiárið')} 01.09.
        {selectedTimePeriod.startYear} - 31.08.
        {selectedTimePeriod.endYear}
      </Text>

      <Box className={styles.tagContainer}>
        <Inline alignY="center" space={3}>
          {state.context.selectedQuotaTypes.map((quotaType) => (
            <Tag
              onClick={() =>
                send({
                  type: 'REMOVE_CATEGORY',
                  categoryId: quotaType.id,
                })
              }
              key={quotaType.id}
            >
              <Box flexDirection="row" alignItems="center" flexWrap="nowrap">
                {quotaType.name}
                <span className={styles.crossmark}>&#10005;</span>
              </Box>
            </Tag>
          ))}
          {state.context.selectedQuotaTypes.length > 0 && (
            <Button
              onClick={() => send({ type: 'REMOVE_ALL_CATEGORIES' })}
              variant="text"
              size="small"
              colorScheme="default"
            >
              {n('clearAll', 'Hreinsa allt')}
            </Button>
          )}
        </Inline>
      </Box>

      <Box className={styles.minHeightBox} width="full" textAlign="center">
        {loading && <LoadingDots />}
        {state.matches('error') && (
          <Text>{n('aflamarkError', 'Villa kom upp við að sækja gögn')}</Text>
        )}
      </Box>

      {state.context.data?.catchQuotaCategories?.length > 0 && (
        <Box marginTop={3} className={styles.tableBox}>
          <table className={styles.tableContainer}>
            <thead className={styles.tableHead}>
              <tr>
                <th>{n('kvotategund', 'Kvótategund')}</th>
                {state.context.data.catchQuotaCategories.map((category) => {
                  return <th key={category.name}>{category.name}</th>
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{n('uthlutun', 'Úthlutun')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.allocation}</td>
                ))}
              </tr>
              <tr>
                <td>{n('serstokUthlutun', 'Sérst. úthl.')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.specialAlloction}</td>
                ))}
              </tr>
              <tr>
                <td>{n('milliAra', 'Milli ára')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.betweenYears}</td>
                ))}
              </tr>
              <tr>
                <td>{n('milliSkipa', 'Milli skipa')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.betweenShips}</td>
                ))}
              </tr>
              <tr>
                <td>{n('aflamarksbreyting', 'Aflamarksbr.')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      getFieldDifference(category, 'catchQuota')
                    ) : (
                      <input
                        disabled={loading}
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
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.catchQuota}</td>
                ))}
              </tr>
              <tr>
                <td>{n('afli', 'Afli')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.catch}</td>
                ))}
              </tr>
              <tr>
                <td>{n('aflabreyting', 'Aflabreyting')}</td>

                {state.context.data.catchQuotaCategories.map((category) => {
                  return (
                    <td key={category.name}>
                      {category.id === 0 ? (
                        getFieldDifference(category, 'catch')
                      ) : (
                        <input
                          disabled={loading}
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
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.status}</td>
                ))}
              </tr>
              <tr>
                <td>{n('tilfaersla', 'Tilfærsla')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.displacement}</td>
                ))}
              </tr>
              <tr>
                <td>{n('nyStada', 'Ný staða')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.newStatus}</td>
                ))}
              </tr>
              <tr>
                <td>{n('aNaestaAr', 'Á næsta ár')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.nextYear}</td>
                ))}
              </tr>
              <tr>
                <td>{n('umframafli', 'Umframafli')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.excessCatch}</td>
                ))}
              </tr>
              <tr>
                <td>{n('onotad', 'Ónotað')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>{category.unused}</td>
                ))}
              </tr>

              <tr>
                <td className={styles.visualSeparationLine}>
                  {n('heildaraflamark', 'Heildaraflamark')}
                </td>
                {state.context.quotaData.map((category) => (
                  <td
                    className={styles.visualSeparationLine}
                    key={category.name}
                  >
                    {category.totalCatchQuota}
                  </td>
                ))}
              </tr>

              {/* TODO: add server value */}
              <tr>
                <td>{n('uthlutadAflamark', 'Úthlutað aflamark')}</td>
                {state.context.quotaData.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      category.quotaShare
                    ) : (
                      <input disabled={loading} type="text" />
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td>{n('hlutdeild', 'Hlutdeild')}</td>
                {state.context.quotaData.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      category.quotaShare
                    ) : (
                      <input
                        disabled={loading}
                        type="text"
                        value={
                          // quotaState?.quotaShare?.[category.id] ??
                          category.quotaShare
                        }
                        onChange={(ev) => {
                          // setChanges((prevChanges) => {
                          //   const totalCatchQuota = data?.catchQuotaCategories?.find(
                          //     (c) => c?.id === category.id,
                          //   )?.totalCatchQuota
                          //   if (
                          //     !isNumber(ev.target.value) ||
                          //     totalCatchQuota === undefined
                          //   ) {
                          //     return prevChanges
                          //   }
                          //   const newRateOfShare = Number(ev.target.value) / 100
                          //   const newCatchQuota =
                          //     newRateOfShare * totalCatchQuota
                          //   const prevCatchQuota = data?.catchQuotaCategories?.find(
                          //     (c) => c?.id === category.id,
                          //   )?.allocation
                          //   const newCatchQuotaChange =
                          //     newCatchQuota - prevCatchQuota
                          //   setQuotaState((prev) => {
                          //     const percentNextYearQuota =
                          //       (data?.catchQuotaCategories?.find(
                          //         (c) => c?.id === category.id,
                          //       )?.percentNextYearQuota ?? 0) / 100
                          //     const percentNextYearFromQuota =
                          //       (data?.catchQuotaCategories?.find(
                          //         (c) => c?.id === category.id,
                          //       )?.percentNextYearFromQuota ?? 0) / 100
                          //     return {
                          //       ...prev,
                          //       quotaShare: {
                          //         ...prev?.quotaShare,
                          //         [category.id]: ev.target.value,
                          //       },
                          //       nextYearQuota: {
                          //         ...prev?.nextYearQuota,
                          //         [category.id]: String(
                          //           Math.round(
                          //             percentNextYearQuota *
                          //               newCatchQuota *
                          //               100,
                          //           ) / 100,
                          //         ),
                          //       },
                          //       nextYearFromQuota: {
                          //         ...prev?.nextYearFromQuota,
                          //         [category.id]: String(
                          //           Math.round(
                          //             percentNextYearFromQuota *
                          //               newCatchQuota *
                          //               100,
                          //           ) / 100,
                          //         ),
                          //       },
                          //     }
                          //   })
                          //   return {
                          //     ...prevChanges,
                          //     [category.id]: {
                          //       ...prevChanges?.[category.id],
                          //       id: category.id,
                          //       catchQuotaChange: String(
                          //         Math.round(newCatchQuotaChange * 100) / 100,
                          //       ),
                          //     },
                          //   }
                          // })
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td>{n('aNaestaArKvoti', 'Á næsta ár kvóti')}</td>

                {state.context.quotaData.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      category.nextYearQuota
                    ) : (
                      <input
                        disabled={loading}
                        value={
                          // quotaState?.nextYearQuota?.[category.id] ??
                          category.nextYearQuota
                        }
                        onChange={(ev) => {
                          // setQuotaState((prev) => ({
                          //   ...prev,
                          //   nextYearQuota: {
                          //     ...prev?.nextYearQuota,
                          //     [category.id]: ev.target.value,
                          //   },
                          // }))
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td>{n('afNaestaArKvoti', 'Af næsta ár kvóti')}</td>
                {state.context.quotaData.map((category) => (
                  <td key={category.name}>
                    {category.id === 0 ? (
                      category.nextYearFromQuota
                    ) : (
                      <input
                        disabled={loading}
                        value={
                          // quotaState?.nextYearFromQuota?.[category.id] ??
                          category.nextYearFromQuota
                        }
                        onChange={(ev) => {
                          // setQuotaState((prev) => {
                          //   return {
                          //     ...prev,
                          //     nextYearFromQuota: {
                          //       ...prev?.nextYearFromQuota,
                          //       [category.id]: ev.target.value,
                          //     },
                          //   }
                          // })
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
