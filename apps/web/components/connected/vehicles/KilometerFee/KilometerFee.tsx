import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  Inline,
  Input,
  RadioButton,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { ConnectedComponent } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { formatCurrency } from '@island.is/web/utils/currency'

import { translation as translationStrings } from './translation.strings'

const MAX_KILOMETER_INPUT_LENGTH = 10

const calculate = (inputState: InputState, slice: ConnectedComponent) => {
  let unit = 0

  if (inputState.energySource === 'hydrogen') {
    unit = slice?.configJson?.hydrogenCost ?? 6
  } else if (inputState.energySource === 'hybrid') {
    unit = slice?.configJson?.hybridCost ?? 2
  } else if (inputState.energySource === 'electric') {
    unit = slice?.configJson?.energyCost ?? 6
  }

  let newResult = unit * Number(inputState.kilometers || 0)

  if (inputState.timeline === 'perDay') {
    newResult *= slice?.configJson?.daysPerMonth ?? 30
  } else if (inputState.timeline === 'perYear') {
    newResult /= slice?.configJson?.monthsPerYear ?? 12
  }

  return newResult
}

interface InputState {
  energySource?: 'electric' | 'hydrogen' | 'hybrid'
  timeline?: 'perDay' | 'perMonth' | 'perYear'
  kilometers: string
}

interface KilometerFeeProps {
  slice: ConnectedComponent
}

const initialInputState: InputState = {
  kilometers: '',
  energySource: 'electric',
  timeline: 'perMonth',
}

const KilometerFee = ({ slice }: KilometerFeeProps) => {
  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()
  const [result, setResult] = useState(0)
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
    setResult(0)
    setInputState((prevState) => ({ ...prevState, [key]: value }))
  }

  const maxKilometerInputLength =
    slice?.configJson?.maxKilometerInputLength ?? MAX_KILOMETER_INPUT_LENGTH

  const updateResult = () => {
    setResult(calculate(inputState, slice))
  }

  const canCalculate =
    Object.keys(inputState).every((key) =>
      Boolean(inputState[key as keyof InputState]),
    ) && result === 0

  return (
    <Box background="blue100" paddingY={[3, 3, 5]} paddingX={[3, 3, 3, 3, 12]}>
      <Stack space={5}>
        <Stack space={2}>
          <Text variant="medium" fontWeight="light">
            {formatMessage(translationStrings.energySource)}
          </Text>

          <Inline space={[3, 3, 5]} collapseBelow="sm">
            <RadioButton
              label={formatMessage(translationStrings.electric)}
              name="electric"
              onChange={() => {
                updateInputState('energySource', 'electric')
              }}
              checked={inputState.energySource === 'electric'}
            />
            <RadioButton
              label={formatMessage(translationStrings.hydrogen)}
              name="hydrogen"
              onChange={() => {
                updateInputState('energySource', 'hydrogen')
              }}
              checked={inputState.energySource === 'hydrogen'}
            />
            <RadioButton
              label={formatMessage(translationStrings.hybrid)}
              name="hybrid"
              onChange={() => {
                updateInputState('energySource', 'hybrid')
              }}
              checked={inputState.energySource === 'hybrid'}
            />
          </Inline>
        </Stack>

        <Stack space={2}>
          <Text variant="medium" fontWeight="light">
            {formatMessage(translationStrings.kilometerInputLabel)}
          </Text>

          <Inline space={1} alignY="bottom">
            <Input
              id="kilometers"
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
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  updateResult()
                }
              }}
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
            />
          </Inline>
        </Stack>

        <Button onClick={updateResult} disabled={!canCalculate}>
          {formatMessage(translationStrings.calculate)}
        </Button>

        {result > 0 && (
          <Stack space={1}>
            <Text variant="medium" fontWeight="light">
              {formatMessage(translationStrings.resultPrefix)}
            </Text>
            <Text variant="h4" color="blue400" fontWeight="semiBold">
              {formatCurrency(result, '')}{' '}
              {formatMessage(translationStrings.resultPostfix)}
            </Text>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default KilometerFee
