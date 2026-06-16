import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Input,
  Select,
  Stack,
  type StringOption,
  Text,
} from '@island.is/island-ui/core'
import type { SpanType } from '@island.is/island-ui/core/types'

import { translation as translationStrings } from './translation.strings'
import { UnitInput } from './UnitInput'
import * as styles from './CustomsCalculator.css'

const COLUMN_SPAN: SpanType = ['1/1', '1/2', '1/1', '1/2']

interface UnitsProps {
  unitStrings: string[]
}

export const Units = ({ unitStrings }: UnitsProps) => {
  const { formatMessage } = useIntl()

  const [inputState, setInputState] = useState({
    net: '',
    unitCount: '',
    liters: '',
    percentage: '',
    nedc: '',
    nedcWeighted: '',
    wltp: '',
    wltpWeighted: '',
  })

  if (!unitStrings) return null
  if (unitStrings.length === 0) return null

  return (
    <GridRow rowGap={3}>
      {unitStrings.includes('NET') && (
        <GridColumn span={COLUMN_SPAN}>
          <UnitInput
            name="net"
            label={formatMessage(translationStrings.netWeightLabel)}
            value={inputState.net}
            onChange={(event) =>
              setInputState({ ...inputState, net: event.target.value })
            }
          />
        </GridColumn>
      )}
      {unitStrings.includes('STK') && (
        <GridColumn span={COLUMN_SPAN}>
          <UnitInput
            name="unitCount"
            label={formatMessage(translationStrings.unitCountLabel)}
            value={inputState.unitCount}
            onChange={(event) =>
              setInputState({ ...inputState, unitCount: event.target.value })
            }
          />
        </GridColumn>
      )}
      {unitStrings.includes('LIT') && (
        <GridColumn span={COLUMN_SPAN}>
          <UnitInput
            name="liters"
            label={formatMessage(translationStrings.litersLabel)}
            value={inputState.liters}
            onChange={(event) =>
              setInputState({ ...inputState, liters: event.target.value })
            }
          />
        </GridColumn>
      )}
      {unitStrings.includes('PRO') && (
        <GridColumn span={COLUMN_SPAN}>
          <UnitInput
            name="percentage"
            label={formatMessage(translationStrings.percentageLabel)}
            value={inputState.percentage}
            onChange={(event) =>
              setInputState({ ...inputState, percentage: event.target.value })
            }
          />
        </GridColumn>
      )}
      {unitStrings.includes('UT*') && (
        <GridColumn span="1/1">
          <GridRow rowGap={3}>
            <GridColumn span={COLUMN_SPAN}>
              <UnitInput
                name="nedc"
                label={formatMessage(translationStrings.nedcEmissionLabel)}
                value={inputState.nedc}
                onChange={(event) =>
                  setInputState({ ...inputState, nedc: event.target.value })
                }
              />
            </GridColumn>
            <GridColumn span={COLUMN_SPAN}>
              <UnitInput
                name="nedcWeighted"
                label={formatMessage(
                  translationStrings.nedcWeightedEmissionLabel,
                )}
                value={inputState.nedcWeighted}
                onChange={(event) =>
                  setInputState({
                    ...inputState,
                    nedcWeighted: event.target.value,
                  })
                }
              />
            </GridColumn>
            <GridColumn span={COLUMN_SPAN}>
              <UnitInput
                name="wltp"
                label={formatMessage(translationStrings.wltpEmissionLabel)}
                value={inputState.wltp}
                onChange={(event) =>
                  setInputState({ ...inputState, wltp: event.target.value })
                }
              />
            </GridColumn>
            <GridColumn span={COLUMN_SPAN}>
              <UnitInput
                name="wltpWeighted"
                label={formatMessage(
                  translationStrings.wltpWeightedEmissionLabel,
                )}
                value={inputState.wltpWeighted}
                onChange={(event) =>
                  setInputState({
                    ...inputState,
                    wltpWeighted: event.target.value,
                  })
                }
              />
            </GridColumn>
          </GridRow>
        </GridColumn>
      )}
    </GridRow>
  )
}
