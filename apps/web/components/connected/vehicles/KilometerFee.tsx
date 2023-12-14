import { useMemo, useState } from 'react'

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
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

const MAX_KILOMETER_INPUT_LENGTH = 10

export const formatCurrency = (answer: number | null | undefined) => {
  if (typeof answer !== 'number') return answer
  return String(answer).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

interface InputState {
  energySource?: 'electric' | 'hydrogen' | 'hybrid'
  timeline?: 'perDay' | 'perMonth' | 'perYear'
  kilometers: number
}

interface KilometerFeeProps {
  slice: ConnectedComponent
}

const KilometerFee = ({ slice }: KilometerFeeProps) => {
  const n = useNamespace(slice?.json ?? {})
  const { activeLocale } = useI18n()
  const [result, setResult] = useState(0)

  const [inputState, setInputState] = useState<InputState>({
    kilometers: 0,
    energySource: 'electric',
    timeline: 'perMonth',
  })

  const timelineOptions = useMemo(() => {
    return [
      {
        label: n(
          'perYear',
          activeLocale === 'is' ? 'Á ári' : 'Per year',
        ) as string,
        value: 'perYear',
      },
      {
        label: n(
          'perMonth',
          activeLocale === 'is' ? 'Á mánuði' : 'Per month',
        ) as string,
        value: 'perMonth',
      },
      {
        label: n(
          'perDay',
          activeLocale === 'is' ? 'Á dag' : 'Per day',
        ) as string,
        value: 'perDay',
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocale])

  const updateInputState = <T extends keyof InputState>(
    key: T,
    value: InputState[T],
  ) => {
    setInputState((prevState) => ({ ...prevState, [key]: value }))
  }

  const updateResult = () => {
    let unit = 0

    if (inputState.energySource === 'hydrogen') {
      unit = slice?.configJson?.hydrogenCost ?? 6
    } else if (inputState.energySource === 'hybrid') {
      unit = slice?.configJson?.hybridCost ?? 2
    } else if (inputState.energySource === 'electric') {
      unit = slice?.configJson?.energyCost ?? 6
    }

    let newResult = unit * inputState.kilometers

    if (inputState.timeline === 'perDay') {
      newResult *= slice?.configJson?.daysPerMonth ?? 30
    } else if (inputState.timeline === 'perYear') {
      newResult /= slice?.configJson?.monthsPerYear ?? 12
    }

    setResult(newResult)
  }

  const canSubmit = useMemo(
    () =>
      Object.keys(inputState).every((key) =>
        Boolean(inputState[key as keyof InputState]),
      ),
    [inputState],
  )

  const maxKilometerInputLength =
    slice?.configJson?.maxKilometerInputLength ?? MAX_KILOMETER_INPUT_LENGTH

  return (
    <Box background="blue100" paddingY={[3, 3, 5]} paddingX={[3, 3, 3, 3, 12]}>
      <Stack space={5}>
        <Stack space={0}>
          <Text variant="medium" fontWeight="light" paddingBottom={2}>
            {n(
              'energySource',
              activeLocale === 'is'
                ? 'Orkugjafi ökutækis'
                : 'Energy source of vehicle',
            )}
          </Text>

          <Inline space={[3, 3, 5]} collapseBelow="sm">
            <RadioButton
              label={n(
                'electric',
                activeLocale === 'is' ? 'Rafmagn' : 'Electric',
              )}
              name="electric"
              onChange={() => {
                updateInputState('energySource', 'electric')
              }}
              checked={inputState.energySource === 'electric'}
            />
            <RadioButton
              label={n(
                'hydrogen',
                activeLocale === 'is' ? 'Vetni' : 'Hydrogen',
              )}
              name="hydrogen"
              onChange={() => {
                updateInputState('energySource', 'hydrogen')
              }}
              checked={inputState.energySource === 'hydrogen'}
            />
            <RadioButton
              label={n(
                'hybrid',
                activeLocale === 'is' ? 'Tengiltvinnbíll' : 'Hybrid',
              )}
              name="hybrid"
              onChange={() => {
                updateInputState('energySource', 'hybrid')
              }}
              checked={inputState.energySource === 'hybrid'}
            />
          </Inline>
        </Stack>

        <Stack space={1}>
          <Text variant="medium" fontWeight="light">
            {n(
              'kilometerInputPlaceholder',
              activeLocale === 'is'
                ? 'Áætlaður akstur í kílómetrum'
                : 'Estimated driving in kilometers',
            )}
          </Text>

          <Inline space={1} alignY="bottom">
            <Input
              id="kilometers"
              name="kilometers"
              type="number"
              size="xs"
              value={inputState.kilometers || undefined}
              onChange={(ev) => {
                if (ev.target.value.length > maxKilometerInputLength) return
                updateInputState('kilometers', Number(ev.target.value))
              }}
            />

            <Select
              size="sm"
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

        <Inline space={3} justifyContent="spaceBetween">
          <Button onClick={updateResult} disabled={!canSubmit}>
            {n('calculate', activeLocale === 'is' ? 'Reikna' : 'Calculate')}
          </Button>

          {result > 0 && (
            <Stack space={1}>
              <Text variant="medium" fontWeight="light">
                {n(
                  'resultPrefix',
                  activeLocale === 'is'
                    ? 'Áætlað kílómetragjald'
                    : 'Estimated kilometer fee',
                )}
              </Text>
              <Text variant="h4" color="blue400" fontWeight="semiBold">
                {result === 0 ? '' : formatCurrency(result)}{' '}
                {n(
                  'resultPostfix',
                  activeLocale === 'is' ? 'krónur á mánuði' : 'isk per month',
                )}
              </Text>
            </Stack>
          )}
        </Inline>
      </Stack>
    </Box>
  )
}

export default KilometerFee
