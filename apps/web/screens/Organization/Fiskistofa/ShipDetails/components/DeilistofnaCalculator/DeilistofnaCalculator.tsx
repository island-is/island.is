import { useEffect, useMemo, useState } from 'react'
import { useMachine } from '@xstate/react'
import {
  Box,
  Button,
  Inline,
  LoadingDots,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'
import { machine } from './machine'
import { getYearOptions, YearOption } from '../../utils'

import * as styles from './DeilistofnaCalculator.css'

interface DeilistofnaCalculatorProps {
  namespace: Record<string, string>
  shipNumber: number
}

export const DeilistofnaCalculator = ({
  namespace,
  shipNumber,
}: DeilistofnaCalculatorProps) => {
  const yearOptions = useMemo(() => getYearOptions(), [])
  const [selectedYear, setSelectedYear] = useState<YearOption>(yearOptions[0])
  const n = useNamespace(namespace)

  const [state, send] = useMachine(machine)

  useEffect(() => {
    send({
      type: 'GET_DATA',
      variables: {
        input: {
          shipNumber,
          year: selectedYear.value,
        },
      },
    })
  }, [shipNumber, selectedYear.value])

  const reset = () => {}
  const calculate = () => {}

  const loading =
    state.matches('getting data') || state.matches('updating data')

  const quotaTypes = useMemo(() => {
    const categoryIds = (state.context.data?.catchQuotaCategories ?? []).map(
      (c) => c.id,
    )
    const types = state.context.quotaTypes
      .filter((qt) => !categoryIds.includes(qt.id)) // Remove all quota types that are already in the category list
      .map((qt) => ({
        label: qt.name,
        value: qt.id,
      }))
    types.sort((a, b) => a.label.localeCompare(b.label)) // Order the types in ascending name order
    return types
  }, [state.context.quotaTypes])

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
              size="sm"
              label="Ár"
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
              size="sm"
              label={n('addType', 'Bæta við tegund')}
              name="tegund-fiskur-select"
              options={quotaTypes}
            />
          </Box>
        </Inline>

        <Box marginTop={[3, 3, 0]}>
          <Inline alignY="center" space={3} flexWrap="nowrap">
            <Button onClick={reset} variant="ghost" size="small">
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
        style={{
          visibility: loading ? 'visible' : 'hidden',
        }}
      >
        <LoadingDots />
      </Box>

      {state.matches('error') && (
        <Box width="full" textAlign="center">
          <Text>
            {n('deilistofnaError', 'Villa kom upp við að sækja gögn')}
          </Text>
        </Box>
      )}

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
                {/* TODO: keep track of difference from initial aflamark to what it is now */}
                {/* {state.context.data.catchQuotaCategories.map((category) => (
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
                ))} */}
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
                      {/* TODO: keep track of difference from initial afli to what it is now */}
                      {/* {category.id === 0 ? (
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
                      )} */}
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
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  )
}
