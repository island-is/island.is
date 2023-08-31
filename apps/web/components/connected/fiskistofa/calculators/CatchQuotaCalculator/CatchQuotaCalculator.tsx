import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
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
import { useNamespace } from '@island.is/web/hooks'
import { FiskistofaExtendedCatchQuotaCategory as ExtendedCatchQuotaCategory } from '@island.is/api/schema'
import {
  formattedNumberStringToNumber,
  generateTimePeriodOptions,
  sevenFractionDigitNumberFormatter,
  TimePeriodOption,
  numberFormatter,
  isNumberBelowZero,
} from '../utils'
import { Context, machine, Event as EventType } from './machine'

import * as styles from './CatchQuotaCalculator.css'

const QUOTA_CHANGE_DEBOUNCE_TIME = 1000

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

type QuotaChanges = Record<
  number,
  {
    id?: number
    nextYearFromQuota?: string | undefined
    nextYearQuota?: string | undefined
    quotaShare?: string | undefined
    allocatedCatchQuota?: string | undefined
  }
>

type QuotaChangeErrors = Record<
  number,
  {
    id: number
    nextYearFromQuota?: boolean
    nextYearQuota?: boolean
    quotaShare?: boolean
    allocatedCatchQuota?: boolean
  }
>

interface QuotaStateChangeMetadata {
  lastChangeTimestamp: number
  lastChangeCategoryId: number
  lastChangeFieldName:
    | 'nextYearFromQuota'
    | 'nextYearQuota'
    | 'quotaShare'
    | 'allocatedCatchQuota'
  lastChangeFieldValue: string
  timerId: number | null
}

interface CatchQuotaCalculatorProps {
  namespace: Record<string, string>
}

const CatchQuotaCalculator = ({ namespace }: CatchQuotaCalculatorProps) => {
  const timePeriodOptions = useMemo(() => generateTimePeriodOptions(), [])
  const n = useNamespace(namespace)
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(
    timePeriodOptions[0],
  )
  const [changes, setChanges] = useState<Changes>({})
  const [changeErrors, setChangeErrors] = useState<ChangeErrors>({})

  const [shipNumber, setShipNumber] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (router.query.nr && !isNaN(Number(router.query.nr))) {
      setShipNumber(Number(router.query.nr))
    }
  }, [router.query.nr])

  const prevChangesRef = useRef<Changes | null>(null)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const [state, send] = useMachine<Context, EventType>(machine)

  const quotaStateChangeMetadata = useRef({
    lastChangeTimestamp: 0,
    lastChangeCategoryId: -1,
    lastChangeFieldName: '',
    lastChangeFieldValue: '',
    timerId: null as NodeJS.Timeout | null,
  })
  const [quotaChange, setQuotaChange] = useState<QuotaChanges>({})
  const [quotaChangeErrors, setQuotaChangeErrors] = useState<QuotaChangeErrors>(
    {},
  )

  const updateQuota = (
    categoryId: number,
    fieldName: QuotaStateChangeMetadata['lastChangeFieldName'],
    value: string,
  ) => {
    const timestamp = Date.now()

    // Only allow a single field to be changed at a time (unless it's the same field)
    if (
      quotaStateChangeMetadata.current.lastChangeTimestamp +
        QUOTA_CHANGE_DEBOUNCE_TIME >=
        timestamp &&
      categoryId !== quotaStateChangeMetadata.current.lastChangeCategoryId &&
      quotaStateChangeMetadata.current.lastChangeFieldName !== fieldName
    ) {
      return
    }

    quotaStateChangeMetadata.current.lastChangeCategoryId = categoryId
    quotaStateChangeMetadata.current.lastChangeFieldName = fieldName
    quotaStateChangeMetadata.current.lastChangeFieldValue = value
    quotaStateChangeMetadata.current.lastChangeTimestamp = timestamp

    setQuotaChange((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev?.[categoryId],
        [fieldName]: value,
      },
    }))

    if (quotaStateChangeMetadata.current.timerId) {
      clearTimeout(quotaStateChangeMetadata.current.timerId)
    }

    quotaStateChangeMetadata.current.timerId = setTimeout(() => {
      if (value && isNaN(formattedNumberStringToNumber(value))) {
        setQuotaChangeErrors((prev) => ({
          ...prev,
          [categoryId]: { ...prev?.[categoryId], [fieldName]: true },
        }))
        return
      }
      setQuotaChangeErrors({})

      if (!shipNumber) return

      send({
        type: 'UPDATE_QUOTA_DATA',
        variables: {
          input: {
            shipNumber,
            timePeriod: selectedTimePeriod.value,
            change: {
              id: categoryId,
              [fieldName]: formattedNumberStringToNumber(value),
            },
          },
        },
      })
    }, QUOTA_CHANGE_DEBOUNCE_TIME)
  }

  const reset = () => {
    if (typeof shipNumber !== 'number') return
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
    setQuotaChange({})
    setQuotaChangeErrors({})
  }

  useEffect(() => {
    reset()
  }, [shipNumber, selectedTimePeriod.value])

  const validateChanges = () => {
    let valid = true
    const errors: ChangeErrors = {}
    for (const change of Object.values(changes)) {
      // The catchChange needs to be numeric
      if (isNaN(Number(change?.catchChange)) && change?.catchChange) {
        valid = false
        if (change?.id) {
          errors[change.id] = { ...errors[change.id], catchChange: true }
        }
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

        const catchDifference = (catchValue ?? 0) + Number(change.catchChange)
        const catchQuotaDifference =
          (catchQuotaValue ?? 0) + Number(change.catchQuotaChange)

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
    if (!validateChanges() || typeof shipNumber !== 'number') {
      return
    }
    prevChangesRef.current = changes
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

  useEffect(() => {
    if (state.context.quotaData) {
      setQuotaChange(
        state.context.quotaData.reduce((acc, val) => {
          const formattedVal: Partial<QuotaChanges[number]> = {}
          for (const k of Object.keys(val)) {
            const key = k as keyof typeof val
            if (key === 'quotaShare') {
              formattedVal[key] = sevenFractionDigitNumberFormatter.format(
                val[key] as number,
              )
            } else {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              formattedVal[key] = numberFormatter.format(val[key] as number)
            }
          }
          if (val.id) acc[val.id] = { ...formattedVal }
          return acc
        }, {} as QuotaChanges),
      )
    }
  }, [state.context.quotaData])

  const loading =
    state.matches('getting data') ||
    state.matches('updating general data') ||
    state.matches('updating quota data')

  const getFieldDifference = (
    category: ExtendedCatchQuotaCategory,
    fieldName: keyof ExtendedCatchQuotaCategory,
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    const current = state.context.data?.catchQuotaCategories?.find(
      (c) => c.id === category.id,
    )?.[fieldName]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    const initial = state.context.initialData?.catchQuotaCategories?.find(
      (c) => c.id === category.id,
    )?.[fieldName]

    if (!current || !initial) return undefined
    return numberFormatter.format(current - initial)
  }

  const quotaTypes = useMemo(
    () =>
      state.context.quotaTypes.map((qt) => ({
        label: qt.name,
        value: qt.id,
        codEquivalent: qt.codEquivalent,
        totalCatchQuota: qt.totalCatchQuota,
      })),
    [state.context.quotaTypes],
  )

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        flexDirection={['column', 'column', 'row']}
      >
        <Inline space={3}>
          <Box className={styles.selectBox}>
            <Select
              isDisabled={loading}
              size="sm"
              label={n('timeperiod', 'Tímabil')}
              name="time-period-select"
              options={timePeriodOptions}
              value={selectedTimePeriod}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              onChange={(newTimePeriod) => {
                setSelectedTimePeriod(newTimePeriod as TimePeriodOption)
              }}
            />
          </Box>
          <Box className={styles.selectBox} marginBottom={3}>
            <Select
              isDisabled={loading}
              value={emptyValue}
              size="sm"
              label={n('addType', 'Bæta við tegund')}
              name="tegund-fiskur-select"
              options={quotaTypes}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              onChange={(selectedOption) => {
                send({
                  type: 'ADD_CATEGORY',
                  category: selectedOption as {
                    value: number
                    label: string
                    totalCatchQuota: number
                    codEquivalent: number
                  },
                })
              }}
            />
          </Box>
        </Inline>

        <Box marginTop={[3, 3, 0]} marginBottom={3}>
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
              disabled={
                loading ||
                Object.values(changes).length === 0 ||
                JSON.stringify(changes) ===
                  JSON.stringify(prevChangesRef.current)
              }
            >
              {loading ? <LoadingDots /> : n('calculate', 'Reikna')}
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

      <Box width="full" textAlign="center">
        {state.matches('error') && (
          <Text>{n('aflamarkError', 'Villa kom upp við að sækja gögn')}</Text>
        )}
      </Box>

      {!!state.context.data?.catchQuotaCategories?.length && (
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
                <td>{n('codEquivalentRatio', 'Þorskígildisstuðull')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {category.codEquivalent
                      ? numberFormatter.format(category.codEquivalent)
                      : null}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('uthlutun', 'Úthlutun')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(category.allocation),
                    })}
                  >
                    {numberFormatter.format(category.allocation as number)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('serstokUthlutun', 'Sérst. úthl.')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(
                        category.specialAlloction,
                      ),
                    })}
                  >
                    {numberFormatter.format(
                      category.specialAlloction as number,
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('milliAra', 'Milli ára')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(
                        category.betweenYears,
                      ),
                    })}
                  >
                    {numberFormatter.format(category.betweenYears as number)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('milliSkipa', 'Milli skipa')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(
                        category.betweenShips,
                      ),
                    })}
                  >
                    {numberFormatter.format(category.betweenShips as number)}
                  </td>
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
                            changeErrors?.[category.id as number]
                              ?.catchQuotaChange,
                        })}
                        value={
                          changes?.[category.id as number]?.catchQuotaChange ??
                          ''
                        }
                        onChange={(ev) => {
                          setChanges((prevChanges) => {
                            if (!category.id) return prevChanges
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
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(category.catchQuota),
                    })}
                  >
                    {numberFormatter.format(category.catchQuota as number)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('afli', 'Afli')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(category.catch),
                    })}
                  >
                    {numberFormatter.format(category.catch as number)}
                  </td>
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
                              changeErrors?.[category.id as number]
                                ?.catchChange,
                          })}
                          value={
                            changes?.[category.id as number]?.catchChange ?? ''
                          }
                          onChange={(ev) => {
                            setChanges((prevChanges) => {
                              if (!category.id) return prevChanges
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
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(category.status),
                    })}
                  >
                    {numberFormatter.format(category.status as number)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('tilfaersla', 'Tilfærsla')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(
                        category.displacement,
                      ),
                    })}
                  >
                    {numberFormatter.format(category.displacement as number)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('nyStada', 'Ný staða')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(category.newStatus),
                    })}
                  >
                    {numberFormatter.format(category.newStatus as number)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('aNaestaAr', 'Á næsta ár')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(category.nextYear),
                    })}
                  >
                    {numberFormatter.format(category.nextYear as number)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('umframafli', 'Umframafli')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({ [styles.redColor]: category.excessCatch })}
                  >
                    {numberFormatter.format(category.excessCatch as number)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('onotad', 'Ónotað')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(category.unused),
                    })}
                  >
                    {numberFormatter.format(category.unused as number)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className={styles.visualSeparationLine}>
                  {n('heildaraflamark', 'Heildaraflamark')}
                </td>
                {state.context.quotaData.map((category) => (
                  <td
                    className={cn(styles.visualSeparationLine, {
                      [styles.redColor]: isNumberBelowZero(
                        category.totalCatchQuota,
                      ),
                    })}
                    key={category.id}
                  >
                    {numberFormatter.format(category.totalCatchQuota as number)}
                  </td>
                ))}
              </tr>

              <tr>
                <td>{n('aaetladAflamark', 'Áætlað aflamark')}</td>
                {state.context.quotaData.map((category) => (
                  <td key={category.id}>
                    {category.id === 0 ? (
                      category?.allocatedCatchQuota
                    ) : (
                      <input
                        className={cn({
                          [styles.error]:
                            quotaChangeErrors?.[category.id]
                              ?.allocatedCatchQuota,
                        })}
                        disabled={loading}
                        type="text"
                        value={
                          quotaChange[category.id]?.allocatedCatchQuota ??
                          category?.allocatedCatchQuota
                        }
                        onChange={(ev) => {
                          updateQuota(
                            category.id,
                            'allocatedCatchQuota',
                            ev.target.value,
                          )
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td>{n('hlutdeild', 'Hlutdeild')}</td>
                {state.context.quotaData.map((category) => (
                  <td key={category.id}>
                    {category.id === 0 ? (
                      category.quotaShare
                    ) : (
                      <input
                        className={cn({
                          [styles.error]:
                            quotaChangeErrors?.[category.id]?.quotaShare,
                        })}
                        disabled={loading}
                        type="text"
                        value={
                          quotaChange[category.id]?.quotaShare ??
                          category?.quotaShare
                        }
                        onChange={(ev) => {
                          updateQuota(
                            category.id,
                            'quotaShare',
                            ev.target.value,
                          )
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td>{n('aNaestaArKvoti', 'Á næsta ár kvóti')}</td>

                {state.context.quotaData.map((category) => (
                  <td key={category.id}>
                    {category.id === 0 ? (
                      category.nextYearQuota
                    ) : (
                      <input
                        className={cn({
                          [styles.error]:
                            quotaChangeErrors?.[category.id]?.nextYearQuota,
                        })}
                        disabled={loading}
                        value={
                          quotaChange[category.id]?.nextYearQuota ??
                          category?.nextYearQuota
                        }
                        onChange={(ev) => {
                          updateQuota(
                            category.id,
                            'nextYearQuota',
                            ev.target.value,
                          )
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td>{n('afNaestaArKvoti', 'Af næsta ári kvóti')}</td>
                {state.context.quotaData.map((category) => (
                  <td key={category.id}>
                    {category.id === 0 ? (
                      category.nextYearFromQuota
                    ) : (
                      <input
                        className={cn({
                          [styles.error]:
                            quotaChangeErrors?.[category.id]?.nextYearFromQuota,
                        })}
                        disabled={loading}
                        value={
                          quotaChange[category.id]?.nextYearFromQuota ??
                          category?.nextYearFromQuota
                        }
                        onChange={(ev) => {
                          updateQuota(
                            category.id,
                            'nextYearFromQuota',
                            ev.target.value,
                          )
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

export default CatchQuotaCalculator
