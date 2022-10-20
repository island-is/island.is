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
import { machine } from './machine'
import { getYearOptions, YearOption } from '../../utils'
import { FiskistofaCatchQuotaCategory as CatchQuotaCategory } from '@island.is/web/graphql/schema'
import { numberFormatter } from '../../utils'

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

interface StraddlingStockCalculatorProps {
  namespace: Record<string, string>
  shipNumber: number
}

export const StraddlingStockCalculator = ({
  namespace,
  shipNumber,
}: StraddlingStockCalculatorProps) => {
  const yearOptions = useMemo(() => getYearOptions(), [])
  const [selectedYear, setSelectedYear] = useState<YearOption>(yearOptions[0])
  const [changes, setChanges] = useState<Changes>({})
  const [changeErrors, setChangeErrors] = useState<ChangeErrors>({})
  const n = useNamespace(namespace)
  const prevChangesRef = useRef<Changes | null>(null)

  const [state, send] = useMachine(machine)

  const reset = () => {
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
              label={n('year', 'Ár')}
              name="year-select"
              options={yearOptions}
              value={selectedYear}
              onChange={(newYear) => {
                setSelectedYear(newYear as YearOption)
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
              {n('calculate', 'Reikna')}
            </Button>
          </Inline>
        </Box>
      </Box>

      <Text variant="small">
        {n('calendarYear', 'Almanaksárið')} 01.01.{selectedYear.label} - 31.12.
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
              {n('clearAll', 'Hreinsa allt')}
            </Button>
          )}
        </Inline>
      </Box>

      <Box className={styles.minHeightBox} width="full" textAlign="center">
        {loading && <LoadingDots />}
        {state.matches('error') && (
          <Text>
            {n('deilistofnaError', 'Villa kom upp við að sækja gögn')}
          </Text>
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
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  )
}
