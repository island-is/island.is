import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import NumberFormat from 'react-number-format'

import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Inline,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type { SpanType } from '@island.is/island-ui/core/types'
import type { ConnectedComponent } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { formatCurrency } from '@island.is/web/utils/currency'

import { formatValueForPresentation } from '../../Charts/v2/utils'
import { t } from './translation.strings'
import { calculateResults, UserInput } from './utils'

interface FieldProps {
  heading: string
  description?: string
}

const Field = ({
  heading,
  description,
  children,
}: PropsWithChildren<FieldProps>) => {
  return (
    <Stack space={2}>
      <Inline flexWrap="nowrap" space={1} alignY="center">
        <Text variant="h4">{heading}</Text>
      </Inline>
      {description && <Text variant="medium">{description}</Text>}
      {children}
    </Stack>
  )
}

interface ResultCardProps {
  title: string
  icon?: ReactNode
  description: string
}

const ResultCard = ({ title, icon, description }: ResultCardProps) => {
  return (
    <Box
      padding={[2, 2, 3]}
      borderRightWidth="large"
      borderColor="blue400"
      height="full"
      background="blue100"
      textAlign="right"
    >
      <Stack space={2}>
        <Inline space={1} justifyContent="flexEnd">
          {icon && icon}
          <Text variant="h3">{title}</Text>
        </Inline>

        <Text>{description}</Text>
      </Stack>
    </Box>
  )
}

const canCalculate = (current: UserInput, previous: UserInput | null) => {
  if (
    !(
      current.nameOfProcess.length > 0 &&
      current.amountPerYear > 0 &&
      current.processDurationInMinutes > 0 &&
      current.visitCountToCompleteProcess > 0 &&
      current.averageDistanceToProcessInKilometers > 0
    )
  ) {
    return false
  }

  if (!previous) {
    return true
  }

  for (const key in current) {
    if (
      current[key as keyof typeof current] !==
      previous[key as keyof typeof current]
    ) {
      return true
    }
  }

  return false
}

interface BenefitsOfDigitalProcessesCalculatorProps {
  slice: ConnectedComponent
}

export const BenefitsOfDigitalProcessesCalculator = ({
  slice,
}: BenefitsOfDigitalProcessesCalculatorProps) => {
  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()

  const resultsRef = useRef<HTMLDivElement | null>(null)
  const [previousInput, setPreviousInput] = useState<UserInput | null>(null)

  const [userInput, setUserInput] = useState<UserInput>({
    amountPerYear: 0,
    averageDistanceToProcessInKilometers:
      slice.configJson?.['defaultAverageDistanceToProcessInKilometers'] ?? 7.5,
    nameOfProcess: '',
    processDurationInMinutes: 0,
    visitCountToCompleteProcess: 0,
  })

  const resultColumnSpan: SpanType = ['1/1', '1/2', '1/1', '1/2', '1/3']

  const { results, gainPerCitizen, ringRoadTripsSaved, co2 } = calculateResults(
    slice,
    userInput,
  )

  const displayResults =
    Boolean(previousInput) &&
    !canCalculate(userInput, previousInput) &&
    userInput.nameOfProcess.length > 0 &&
    userInput.amountPerYear > 0 &&
    userInput.processDurationInMinutes > 0 &&
    userInput.visitCountToCompleteProcess > 0 &&
    userInput.averageDistanceToProcessInKilometers > 0

  useEffect(() => {
    if (!previousInput) return
    resultsRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [previousInput])

  const getCurrencyText = (value: number) => {
    return value >= 1e6
      ? `${formatValueForPresentation(activeLocale, value)}${
          activeLocale === 'is' ? '.' : ''
        }${
          activeLocale === 'is'
            ? formatMessage(t.results.currencyPostfix).trim()
            : formatMessage(t.results.currencyPostfix)
        }`
      : (formatCurrency(
          value,
          formatMessage(t.results.currencyPostfix),
        ) as string)
  }

  return (
    <Stack space={4}>
      <Box
        background="blue100"
        paddingY={[3, 3, 5]}
        paddingX={[3, 3, 3, 3, 12]}
      >
        <Stack space={5}>
          <Field heading={formatMessage(t.nameOfProcess.heading)}>
            <Input
              required={true}
              name="nameOfProcess"
              value={userInput.nameOfProcess}
              onChange={(ev) => {
                setUserInput((prevInput) => ({
                  ...prevInput,
                  nameOfProcess: ev.target.value,
                }))
              }}
              label={formatMessage(t.nameOfProcess.label)}
              placeholder={formatMessage(t.nameOfProcess.placeholder)}
            />
          </Field>

          <Field
            heading={formatMessage(t.amountPerYear.heading)}
            description={formatMessage(t.amountPerYear.description)}
          >
            <NumberFormat
              required={true}
              value={String(userInput.amountPerYear || '')}
              onValueChange={({ value }) => {
                setUserInput((prevInput) => ({
                  ...prevInput,
                  amountPerYear: Number(value),
                }))
              }}
              customInput={Input}
              name="amountPerYear"
              id="amountPerYear"
              type="text"
              inputMode="numeric"
              thousandSeparator="."
              decimalSeparator=","
              label={formatMessage(t.amountPerYear.label)}
              placeholder={formatMessage(t.amountPerYear.placeholder)}
            />
          </Field>

          <Field
            heading={formatMessage(t.processDurationInMinutes.heading)}
            description={formatMessage(t.processDurationInMinutes.description)}
          >
            <NumberFormat
              required={true}
              value={String(userInput.processDurationInMinutes || '')}
              onValueChange={({ value }) => {
                setUserInput((prevInput) => ({
                  ...prevInput,
                  processDurationInMinutes: Number(value),
                }))
              }}
              customInput={Input}
              name="processDurationInMinutes"
              id="processDurationInMinutes"
              type="text"
              inputMode="numeric"
              thousandSeparator="."
              decimalSeparator=","
              label={formatMessage(t.processDurationInMinutes.label)}
              placeholder={formatMessage(
                t.processDurationInMinutes.placeholder,
              )}
            />
          </Field>

          <Field
            heading={formatMessage(t.visitCountToCompleteProcess.heading)}
            description={formatMessage(
              t.visitCountToCompleteProcess.description,
            )}
          >
            <NumberFormat
              required={true}
              value={String(userInput.visitCountToCompleteProcess || '')}
              onValueChange={({ value }) => {
                setUserInput((prevInput) => ({
                  ...prevInput,
                  visitCountToCompleteProcess: Number(value),
                }))
              }}
              customInput={Input}
              name="visitCountToCompleteProcess"
              id="visitCountToCompleteProcess"
              type="text"
              inputMode="numeric"
              thousandSeparator="."
              decimalSeparator=","
              label={formatMessage(t.visitCountToCompleteProcess.label)}
              placeholder={formatMessage(
                t.visitCountToCompleteProcess.placeholder,
              )}
            />
          </Field>

          <Field
            heading={formatMessage(
              t.averageDistanceToProcessInKilometers.heading,
            )}
            description={formatMessage(
              t.averageDistanceToProcessInKilometers.description,
            )}
          >
            <NumberFormat
              required={true}
              value={String(
                userInput.averageDistanceToProcessInKilometers || '',
              )}
              onValueChange={({ value }) => {
                setUserInput((prevInput) => ({
                  ...prevInput,
                  averageDistanceToProcessInKilometers: Number(value),
                }))
              }}
              isNumericString={true}
              customInput={Input}
              name="averageDistanceToProcessInKilometers"
              id="averageDistanceToProcessInKilometers"
              inputMode="decimal"
              thousandSeparator="."
              decimalSeparator=","
              label={formatMessage(
                t.averageDistanceToProcessInKilometers.label,
              )}
            />
          </Field>

          <Button
            disabled={!canCalculate(userInput, previousInput)}
            onClick={() => {
              setPreviousInput({
                ...userInput,
              })
            }}
          >
            {formatMessage(t.results.calculate)}
          </Button>
        </Stack>
      </Box>

      <div ref={resultsRef} style={{ scrollMarginTop: '32px' }}>
        {displayResults && (
          <Stack space={3}>
            <Text variant="h2">{userInput.nameOfProcess}</Text>

            <GridRow rowGap={4}>
              <GridColumn span={resultColumnSpan}>
                <ResultCard
                  title={getCurrencyText(results.institutionGain)}
                  description={formatMessage(
                    t.results.institutionGainDescription,
                  )}
                  icon={<Icon icon="wallet" color="blue400" size="large" />}
                />
              </GridColumn>
              <GridColumn span={resultColumnSpan}>
                <ResultCard
                  title={formatValueForPresentation(
                    activeLocale,
                    results.staffFreeToDoOtherThings,
                    true,
                    1,
                  )}
                  description={formatMessage(
                    t.results.staffFreeToDoOtherThings,
                  )}
                  icon={<Icon icon="people" color="blue400" size="large" />}
                />
              </GridColumn>
              <GridColumn span={resultColumnSpan}>
                <ResultCard
                  title={getCurrencyText(gainPerCitizen)}
                  description={formatMessage(t.results.citizenGainDescription, {
                    nameOfProcess: userInput.nameOfProcess,
                  })}
                  icon={<Icon icon="person" color="blue400" size="large" />}
                />
              </GridColumn>
              <GridColumn span={resultColumnSpan}>
                <ResultCard
                  title={formatValueForPresentation(
                    activeLocale,
                    ringRoadTripsSaved,
                  )}
                  description={formatMessage(t.results.ringRoadTripsSaved)}
                  icon={<Icon icon="car" color="blue400" size="large" />}
                />
              </GridColumn>
              <GridColumn span={resultColumnSpan}>
                <ResultCard
                  title={`${formatValueForPresentation(
                    activeLocale,
                    results.citizenTimeSaved,
                  )} ${formatMessage(t.results.days)}`}
                  description={formatMessage(t.results.savedCitizenDays)}
                  icon={<Icon icon="time" color="blue400" size="large" />}
                />
              </GridColumn>
              <GridColumn span={resultColumnSpan}>
                <ResultCard
                  title={
                    co2 >= 1e6
                      ? `${formatValueForPresentation(
                          activeLocale,
                          co2,
                        )}${formatMessage(t.results.kgPostfix)}`
                      : (formatCurrency(
                          co2,
                          formatMessage(t.results.kgPostfix),
                        ) as string)
                  }
                  description={formatMessage(t.results.c02)}
                  icon={<Icon icon="leaf" color="blue400" size="large" />}
                />
              </GridColumn>
            </GridRow>
          </Stack>
        )}
      </div>
    </Stack>
  )
}
