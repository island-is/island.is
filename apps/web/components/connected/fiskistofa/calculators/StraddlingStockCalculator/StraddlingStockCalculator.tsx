import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useMachine } from '@xstate/react'

import {
  Box,
  Button,
  Inline,
  LoadingDots,
  Select,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { FiskistofaCatchQuotaCategory as CatchQuotaCategory } from '@island.is/web/graphql/schema'

import {
  getYearOptions,
  isNumberBelowZero,
  numberFormatter,
  YearOption,
} from '../utils'
import { Context, Event as EventType, machine } from './machine'
import { translation as translationStrings } from './translation.strings'
import * as styles from './StraddlingStockCalculator.css'

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

const StraddlingStockCalculator = () => {
  const yearOptions = useMemo(() => getYearOptions(), [])
  const [selectedYear, setSelectedYear] = useState<YearOption>(yearOptions[0])
  const [changes, setChanges] = useState<Changes>({})
  const [changeErrors, setChangeErrors] = useState<ChangeErrors>({})
  const { formatMessage } = useIntl()
  const prevChangesRef = useRef<Changes | null>(null)

  const [shipNumber, setShipNumber] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (router.query.nr && !isNaN(Number(router.query.nr))) {
      setShipNumber(Number(router.query.nr))
    }
  }, [router.query.nr])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const [state, send] = useMachine<Context, EventType>(machine)

  const reset = () => {
    if (!shipNumber) return
    send({
      type: 'GET_DATA',
      variables: {
        input: {
          shipNumber,
          year: selectedYear.value,
        },
      },
    })
    setChanges({})
    setChangeErrors({})
  }

  useEffect(() => {
    reset()
  }, [shipNumber, selectedYear.value])

  const validateChanges = () => {
    let valid = true
    const errors: ChangeErrors = {}
    for (const change of Object.values(changes)) {
      // The catchChange needs to be numeric
      if (isNaN(Number(change?.catchChange)) && change?.catchChange) {
        valid = false
        if (change.id)
          errors[change.id] = { ...errors[change.id], catchChange: true }
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
    if (!validateChanges() || !shipNumber) {
      return
    }
    prevChangesRef.current = changes
    const changeValues = Object.values(changes)
    send({
      type: 'UPDATE_DATA',
      variables: {
        input: {
          shipNumber,
          year: selectedYear.value,
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
    state.matches('getting data') || state.matches('updating data')

  const getFieldDifference = (
    category: CatchQuotaCategory,
    fieldName: string,
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
              label={formatMessage(translationStrings.year)}
              name="year-select"
              options={yearOptions}
              value={selectedYear}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              onChange={(newYear) => {
                setSelectedYear(newYear as YearOption)
              }}
            />
          </Box>
          <Box className={styles.selectBox} marginBottom={3}>
            <Select
              isDisabled={loading}
              value={emptyValue}
              size="sm"
              label={formatMessage(translationStrings.addType)}
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
                    codEquivalent: number
                    totalCatchQuota: number
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
              {formatMessage(translationStrings.reset)}
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
              {loading ? (
                <LoadingDots />
              ) : (
                formatMessage(translationStrings.calculate)
              )}
            </Button>
          </Inline>
        </Box>
      </Box>

      <Text variant="small">
        {formatMessage(translationStrings.calendarYear)} 01.01.
        {selectedYear.label} - 31.12.
        {selectedYear.label}
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
              {formatMessage(translationStrings.clearAll)}
            </Button>
          )}
        </Inline>
      </Box>

      <Box width="full" textAlign="center">
        {state.matches('error') && (
          <Text>{formatMessage(translationStrings.deilistofnaError)}</Text>
        )}
      </Box>

      {!!state.context.data?.catchQuotaCategories?.length && (
        <Box marginTop={3} className={styles.tableBox}>
          <table className={styles.tableContainer}>
            <thead className={styles.tableHead}>
              <tr>
                <th>{formatMessage(translationStrings.kvotategund)}</th>
                {state.context.data.catchQuotaCategories.map((category) => {
                  return <th key={category.name}>{category.name}</th>
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatMessage(translationStrings.codEquivalentRatio)}</td>
                {state.context.data.catchQuotaCategories.map((category) => (
                  <td
                    key={category.name}
                    className={cn({
                      [styles.redColor]: isNumberBelowZero(
                        category.codEquivalent,
                      ),
                    })}
                  >
                    {category.codEquivalent &&
                      numberFormatter.format(category.codEquivalent)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>{formatMessage(translationStrings.uthlutun)}</td>
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
                <td>{formatMessage(translationStrings.serstokUthlutun)}</td>
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
                <td>{formatMessage(translationStrings.milliAra)}</td>
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
                <td>{formatMessage(translationStrings.milliSkipa)}</td>
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
                <td>{formatMessage(translationStrings.aflamarksbreyting)}</td>
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
                <td>{formatMessage(translationStrings.aflamark)}</td>
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
                <td>{formatMessage(translationStrings.afli)}</td>
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
                <td>{formatMessage(translationStrings.aflabreyting)}</td>

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
                <td>{formatMessage(translationStrings.stada)}</td>
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
                <td>{formatMessage(translationStrings.tilfaersla)}</td>
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
                <td>{formatMessage(translationStrings.nyStada)}</td>
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
                <td>{formatMessage(translationStrings.aNaestaAr)}</td>
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
                <td>{formatMessage(translationStrings.umframafli)}</td>
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
                <td>{formatMessage(translationStrings.onotad)}</td>
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
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  )
}

export default StraddlingStockCalculator
