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
import { FiskistofaExtendedCatchQuotaCategory as ExtendedCatchQuotaCategory } from '@island.is/api/schema'
import { useLocalization } from '../../../../utils'
import {
  formattedNumberStringToNumber,
  generateTimePeriodOptions,
  sevenFractionDigitNumberFormatter,
  TimePeriodOption,
  numberFormatter,
} from '../utils'
import { machine } from './machine'

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
    id: number
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
  shipNumber: number
  namespace: Record<string, string>
}

export const CatchQuotaCalculator = ({
  shipNumber,
  namespace,
}: CatchQuotaCalculatorProps) => {
  const timePeriodOptions = useMemo(() => generateTimePeriodOptions(), [])
  const n = useLocalization(namespace)
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(
    timePeriodOptions[0],
  )
  const [changes, setChanges] = useState<Changes>({})
  const [changeErrors, setChangeErrors] = useState<ChangeErrors>({})

  const prevChangesRef = useRef<Changes | null>(null)

  const [state, send] = useMachine(machine)

  const quotaStateChangeMetadata = useRef({
    lastChangeTimestamp: 0,
    lastChangeCategoryId: -1,
    lastChangeFieldName: '',
    lastChangeFieldValue: '',
    timerId: null as Timeout | null,
  })
  const [quotaChange, setQuotaChange] = useState<QuotaChanges>({})
  const [quotaChangeErrors, setQuotaChangeErrors] = useState<QuotaChangeErrors>(
    {},
  )

  useEffect(() => {
    reset()
  }, [shipNumber, selectedTimePeriod.value])

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
          const formattedVal = {}
          for (const key of Object.keys(val)) {
            if (key === 'quotaShare') {
              formattedVal[key] = sevenFractionDigitNumberFormatter.format(
                val[key],
              )
            } else {
              formattedVal[key] = numberFormatter.format(val[key])
            }
          }
          acc[val.id] = { ...formattedVal }
          return acc
        }, {}),
      )
    }
  }, [state.context.quotaData])

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
    return numberFormatter.format(current - initial)
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
    <Box>
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
                  <td key={category.name}>
                    {numberFormatter.format(category.allocation)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('serstokUthlutun', 'Sérst. úthl.')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {numberFormatter.format(category.specialAlloction)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('milliAra', 'Milli ára')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {numberFormatter.format(category.betweenYears)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('milliSkipa', 'Milli skipa')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {numberFormatter.format(category.betweenShips)}
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
                  <td key={category.name}>
                    {numberFormatter.format(category.catchQuota)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('afli', 'Afli')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {numberFormatter.format(category.catch)}
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
                  <td key={category.name}>
                    {numberFormatter.format(category.status)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('tilfaersla', 'Tilfærsla')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {numberFormatter.format(category.displacement)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('nyStada', 'Ný staða')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {numberFormatter.format(category.newStatus)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('aNaestaAr', 'Á næsta ár')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {numberFormatter.format(category.nextYear)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('umframafli', 'Umframafli')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {numberFormatter.format(category.excessCatch)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{n('onotad', 'Ónotað')}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td key={category.name}>
                    {numberFormatter.format(category.unused)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className={styles.visualSeparationLine}>
                  {n('heildaraflamark', 'Heildaraflamark')}
                </td>
                {state.context.quotaData.map((category) => (
                  <td className={styles.visualSeparationLine} key={category.id}>
                    {numberFormatter.format(category.totalCatchQuota)}
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
