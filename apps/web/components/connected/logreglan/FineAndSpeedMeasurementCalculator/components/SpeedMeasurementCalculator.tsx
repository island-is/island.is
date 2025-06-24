import { Dispatch, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Input,
  RadioButton,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { formatCurrency } from '@island.is/web/utils/currency'

import { m } from '../translation.strings'
import { calculateSpeedMeasurementFine } from '../utils'

const DEFAULT_SPEED_LIMIT_OPTIONS = [
  {
    label: '15',
    value: 15,
  },
  {
    label: '30',
    value: 30,
  },
  {
    label: '40',
    value: 40,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '60',
    value: 60,
  },
  {
    label: '70',
    value: 70,
  },
  {
    label: '80',
    value: 80,
  },
  {
    label: '90',
    value: 90,
  },
]

interface SpeedMeasurementCalculatorProps {
  measuredSpeed: string
  speedLimit: number
  over3500kgOrWithTrailer: boolean
  setMeasuredSpeed: Dispatch<SetStateAction<string>>
  setSpeedLimit: Dispatch<SetStateAction<number>>
  setOver3500kgOrWithTrailer: Dispatch<SetStateAction<boolean>>
  speedLimitOptions: typeof DEFAULT_SPEED_LIMIT_OPTIONS
}

export const SpeedMeasurementCalculator = ({
  measuredSpeed,
  speedLimit,
  over3500kgOrWithTrailer,
  setMeasuredSpeed,
  setSpeedLimit,
  setOver3500kgOrWithTrailer,
  speedLimitOptions,
}: SpeedMeasurementCalculatorProps) => {
  const { formatMessage } = useIntl()

  const {
    nidurstada,
    vikmork,
    punktar: points,
    twentyPercentLoad,
    manudurmissa: monthsOfDrivingLicenseLoss,
    sekt: fine,
    akaera,
  } = calculateSpeedMeasurementFine(
    Number(measuredSpeed),
    speedLimit,
    over3500kgOrWithTrailer,
  )

  return (
    <Stack space={3}>
      <GridRow rowGap={2}>
        <GridColumn span={['6/12', '6/12', '1/1', '6/12']}>
          <Input
            label={formatMessage(
              m.speedMeasurementCalculator.measuredSpeedInputLabel,
            )}
            name="measured-speed-input"
            size="xs"
            type="number"
            inputMode="numeric"
            value={measuredSpeed}
            onChange={(e) => {
              if (Number.isNaN(Number(e.target.value))) {
                return
              }
              setMeasuredSpeed(e.target.value)
            }}
          />
        </GridColumn>
        <GridColumn span={['3/12', '3/12', '1/2', '3/12']}>
          <Input
            label={formatMessage(
              m.speedMeasurementCalculator.vikmorkInputLabel,
            )}
            name="vikmork"
            size="xs"
            type="number"
            inputMode="numeric"
            value={vikmork}
            readOnly={true}
          />
        </GridColumn>
        <GridColumn span={['3/12', '3/12', '1/2', '3/12']}>
          <Input
            label={formatMessage(
              m.speedMeasurementCalculator.nidurstadaInputLabel,
            )}
            name="nidurstada"
            size="xs"
            type="number"
            inputMode="numeric"
            value={nidurstada}
            readOnly={true}
          />
        </GridColumn>
      </GridRow>
      <Select
        label={formatMessage(
          m.speedMeasurementCalculator.speedLimitSelectLabel,
        )}
        name="speed-limit-select"
        size="xs"
        options={speedLimitOptions}
        value={speedLimitOptions.find((option) => option.value === speedLimit)}
        onChange={(option) => {
          if (option) {
            setSpeedLimit(option.value)
          }
        }}
      />
      <Stack space={2}>
        <Text
          variant="eyebrow"
          color="blue400"
          id="over-3500kg-or-with-trailer-label"
        >
          {formatMessage(
            m.speedMeasurementCalculator.over3500kgOrWithTrailerLabel,
          )}
        </Text>
        <Box aria-labelledby="over-3500kg-or-with-trailer-label">
          <Inline space={5} alignY="center">
            <RadioButton
              label={formatMessage(m.speedMeasurementCalculator.no)}
              name="over-3500kg-or-with-trailer-no"
              id="over-3500kg-or-with-trailer-radio-no"
              value="no"
              checked={!over3500kgOrWithTrailer}
              onChange={() => {
                setOver3500kgOrWithTrailer(false)
              }}
            />
            <RadioButton
              label={formatMessage(m.speedMeasurementCalculator.yes)}
              name="over-3500kg-or-with-trailer-yes"
              id="over-3500kg-or-with-trailer-radio-yes"
              value="yes"
              checked={over3500kgOrWithTrailer}
              onChange={() => {
                setOver3500kgOrWithTrailer(true)
              }}
            />
          </Inline>
        </Box>
      </Stack>

      <Box paddingTop={2}>
        {akaera && (
          <Stack space={1}>
            <Text>
              <strong>
                {formatMessage(m.speedMeasurementCalculator.akaeraText)}
              </strong>
            </Text>
          </Stack>
        )}

        {!akaera && (
          <Stack space={1}>
            <Text>
              <strong>
                {formatMessage(m.speedMeasurementCalculator.finePrefix)}
              </strong>
              {formatCurrency(fine)}
            </Text>
            <Text>
              <strong>
                {formatMessage(m.speedMeasurementCalculator.pointsPrefix)}
              </strong>
              {points}
            </Text>
            <Text>
              <strong>
                {formatMessage(
                  m.speedMeasurementCalculator.twentyPercentLoadPrefix,
                )}
              </strong>
              {twentyPercentLoad
                ? formatMessage(m.speedMeasurementCalculator.yes)
                : formatMessage(m.speedMeasurementCalculator.no)}
            </Text>
            <Text>
              <strong>
                {formatMessage(
                  m.speedMeasurementCalculator.monthsOfDrivingLicenseLossPrefix,
                )}
              </strong>
              {monthsOfDrivingLicenseLoss}{' '}
              {formatMessage(m.speedMeasurementCalculator.months)}
            </Text>
          </Stack>
        )}
      </Box>
    </Stack>
  )
}
