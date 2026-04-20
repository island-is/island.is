import { useMemo, useState } from 'react'
import { type MessageDescriptor, useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Button,
  Inline,
  Input,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  ConnectedComponent,
  PublicVehicleSearchQuery,
  PublicVehicleSearchQueryVariables,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { PUBLIC_VEHICLE_SEARCH_QUERY } from '@island.is/web/screens/queries/PublicVehicleSearch'
import { formatCurrency } from '@island.is/web/utils/currency'

import { translation as translationStrings } from './translation.strings'

const MAX_KILOMETER_INPUT_LENGTH = 10
const numberFormatter = new Intl.NumberFormat('de-DE')

const getValueOrEmptyString = (value?: string | null) => {
  return value ? value : ''
}

const formatVehicleType = (
  vehicleInformation?: {
    vehicleCommercialName?: string | null
    color?: string | null
    make?: string | null
  } | null,
) => {
  const bothCommercialNameAndMakeArePresent =
    !!vehicleInformation?.make && !!vehicleInformation?.vehicleCommercialName
  if (!bothCommercialNameAndMakeArePresent) return ''

  return `${getValueOrEmptyString(vehicleInformation.make)}${
    bothCommercialNameAndMakeArePresent ? ' - ' : ''
  }${getValueOrEmptyString(vehicleInformation.vehicleCommercialName)}${
    vehicleInformation.color ? ' (' + vehicleInformation.color + ')' : ''
  }`
}

const calculate = (
  inputState: InputState,
  slice: ConnectedComponent,
  massLaden: number,
  formatMessage: (message: MessageDescriptor) => string,
): { fee: number; environmentalFee?: number; errorMessage?: string } => {
  const matrix = (slice?.configJson?.massLadenMatrix ?? []) as {
    from: number
    to?: number
    fee: number
    multipliers?: {
      [key: string]: number
    }
    environmentalMultipliers?: {
      [key: string]: number
    }
  }[]

  const row = matrix.find(
    (row) => massLaden >= row.from && massLaden <= (row.to ?? Infinity),
  )

  if (!row) {
    return {
      errorMessage: formatMessage(
        translationStrings.vehicleWeightClassNotFound,
      ),
      fee: 0,
    }
  }

  let year = String(new Date().getFullYear())
  if (year === '2025') year = '2026'

  let multiplier = 1
  let environmentalMultiplier = 1

  if (row.environmentalMultipliers?.[year] !== undefined) {
    environmentalMultiplier = row.environmentalMultipliers[year]
  }
  if (row.multipliers?.[year] !== undefined) {
    multiplier = row.multipliers[year]
  }

  const unit = row.fee * multiplier
  const environmentalUnit = row.fee * environmentalMultiplier

  let newResult = unit * Number(inputState.kilometers || 0)
  let newEnvironmentalResult =
    environmentalUnit * Number(inputState.kilometers || 0)

  if (inputState.timeline === 'perDay') {
    newResult *= slice?.configJson?.daysPerMonth ?? 30
    newEnvironmentalResult *= slice?.configJson?.daysPerMonth ?? 30
  } else if (inputState.timeline === 'perYear') {
    newResult /= slice?.configJson?.monthsPerYear ?? 12
    newEnvironmentalResult /= slice?.configJson?.monthsPerYear ?? 12
  }

  return {
    fee: newResult,
    environmentalFee:
      newEnvironmentalResult === newResult ? undefined : newEnvironmentalResult,
  }
}

interface InputState {
  plateNumber: string
  timeline?: 'perDay' | 'perMonth' | 'perYear'
  kilometers: string
}

interface NewKilometerFeeProps {
  slice: ConnectedComponent
}

const initialInputState: InputState = {
  kilometers: '',
  plateNumber: '',
  timeline: 'perMonth',
}

const NewKilometerFee = ({ slice }: NewKilometerFeeProps) => {
  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()
  const [result, setResult] = useState({
    massLaden: 0,
    plateNumber: '',
    fee: 0,
    environmentalFee: 0 as number | undefined,
    vehicleType: '',
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [inputState, setInputState] = useState(initialInputState)

  const timelineOptions = useMemo(() => {
    return [
      {
        label: formatMessage(translationStrings.perYear),
        value: 'perYear',
      },
      {
        label: formatMessage(translationStrings.perMonth),
        value: 'perMonth',
      },
      {
        label: formatMessage(translationStrings.perDay),
        value: 'perDay',
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocale])

  const updateInputState = <T extends keyof InputState>(
    key: T,
    value: InputState[T],
  ) => {
    setResult({
      massLaden: 0,
      plateNumber: '',
      fee: 0,
      environmentalFee: undefined,
      vehicleType: '',
    })
    setInputState((prevState) => ({ ...prevState, [key]: value }))
  }

  const maxKilometerInputLength =
    slice?.configJson?.maxKilometerInputLength ?? MAX_KILOMETER_INPUT_LENGTH

  const canCalculate =
    Object.keys(inputState).every((key) =>
      Boolean(inputState[key as keyof InputState]),
    ) && result.fee === 0

  const [search, { loading }] = useLazyQuery<
    PublicVehicleSearchQuery,
    PublicVehicleSearchQueryVariables
  >(PUBLIC_VEHICLE_SEARCH_QUERY, {
    onCompleted(data) {
      const massLaden = data.publicVehicleSearch?.massLaden ?? 0
      if (!massLaden) {
        setErrorMessage(formatMessage(translationStrings.noVehicleFound))
        return
      }

      const newResult = calculate(inputState, slice, massLaden, formatMessage)
      if (newResult.errorMessage) {
        setErrorMessage(newResult.errorMessage)
        return
      }

      setErrorMessage(null)

      setResult({
        massLaden,
        plateNumber: data.publicVehicleSearch?.regno ?? inputState.plateNumber,
        fee: newResult.fee,
        environmentalFee: newResult.environmentalFee,
        vehicleType: formatVehicleType(data.publicVehicleSearch),
      })
    },
    onError(error) {
      console.error(error)
      setErrorMessage(formatMessage(translationStrings.errorOccurred))
    },
  })

  const onKeyDown = (
    ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (ev.key === 'Enter' && canCalculate && !loading) {
      search({
        variables: { input: { search: inputState.plateNumber } },
      })
    }
  }

  return (
    <Box background="blue100" paddingY={[3, 3, 5]} paddingX={[3, 3, 3, 3, 12]}>
      <Stack space={5}>
        <Inline space={2} alignY="bottom">
          <Input
            name="plateNumber"
            type="text"
            inputMode="text"
            size="xs"
            label={formatMessage(translationStrings.plateNumberLabel)}
            value={inputState.plateNumber}
            onChange={(ev) => {
              updateInputState('plateNumber', ev.target.value.toUpperCase())
            }}
            maxLength={16}
            disabled={loading}
            onKeyDown={onKeyDown}
          />
          <Box
            style={{
              visibility:
                result.vehicleType && result.massLaden ? 'visible' : 'hidden',
              minHeight: 104,
            }}
          >
            <Stack space={1}>
              <Stack space={0}>
                <Text variant="eyebrow">
                  {formatMessage(translationStrings.vehicleTypeLabel)}
                </Text>
                <Text>{result.vehicleType}</Text>
              </Stack>
              <Stack space={0}>
                <Text variant="eyebrow">
                  {formatMessage(translationStrings.massLadenLabel)}
                </Text>
                <Text>{numberFormatter.format(result.massLaden)} kg</Text>
              </Stack>
            </Stack>
          </Box>
        </Inline>

        <Stack space={2}>
          <Inline space={1} alignY="bottom">
            <Input
              id="kilometers"
              label={formatMessage(translationStrings.kilometerInputLabel)}
              name="kilometers"
              type="number"
              inputMode="numeric"
              size="xs"
              value={inputState.kilometers}
              placeholder={formatMessage(
                translationStrings.kilometerInputPlaceholder,
              )}
              onChange={(ev) => {
                if (
                  ev.target.value.length > maxKilometerInputLength ||
                  isNaN(Number(ev.target.value))
                ) {
                  return
                }
                updateInputState('kilometers', ev.target.value)
              }}
              onKeyDown={onKeyDown}
              disabled={loading}
            />

            <Select
              size="xs"
              options={timelineOptions}
              value={timelineOptions.find(
                (o) => o.value === inputState.timeline,
              )}
              onChange={(option) => {
                if (option?.value) {
                  updateInputState(
                    'timeline',
                    option.value as keyof InputState['timeline'],
                  )
                }
              }}
              isDisabled={loading}
            />
          </Inline>
        </Stack>
        <Button
          onClick={() =>
            search({ variables: { input: { search: inputState.plateNumber } } })
          }
          disabled={!canCalculate || loading}
          loading={loading}
        >
          {formatMessage(translationStrings.calculate)}
        </Button>
        {errorMessage && (
          <Text fontWeight="semiBold" variant="medium">
            {errorMessage}
          </Text>
        )}
        {(result.fee > 0 ||
          (typeof result.environmentalFee === 'number' &&
            result.environmentalFee > 0)) &&
          !errorMessage && (
            <Stack space={5}>
              <Stack space={3}>
                <Stack space={1}>
                  <Text variant="medium" fontWeight="light">
                    {formatMessage(translationStrings.resultPrefix)}
                  </Text>
                  <Text variant="h4" color="blue400" fontWeight="semiBold">
                    {formatCurrency(result.fee, '')}{' '}
                    {formatMessage(translationStrings.resultPostfix)}
                  </Text>
                </Stack>
                {result.environmentalFee && (
                  <Stack space={1}>
                    <Text variant="medium" fontWeight="light">
                      {formatMessage(
                        translationStrings.environmentalResultPrefix,
                      )}
                    </Text>
                    <Text variant="h4" color="blue400" fontWeight="semiBold">
                      {formatCurrency(result.environmentalFee, '')}{' '}
                      {formatMessage(translationStrings.resultPostfix)}
                    </Text>
                  </Stack>
                )}
              </Stack>
            </Stack>
          )}
      </Stack>
    </Box>
  )
}

export default NewKilometerFee
