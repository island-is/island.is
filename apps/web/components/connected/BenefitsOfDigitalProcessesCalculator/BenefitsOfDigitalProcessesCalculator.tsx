import { type PropsWithChildren, type ReactNode, useState } from 'react'
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

const avinningurR = (
  laun: number,
  f2f: number,
  lengd: number,
  magn: number,
) => {
  return (laun / 60) * f2f * lengd * magn
}

const avinningurB = (
  fornarkostnadur: number,
  lengd: number,
  f2f: number,
  km: number,
  kmgjald: number,
  okuhradi: number,
  magn: number,
) => {
  return (
    (f2f * 2 * km * kmgjald +
      (60 / okuhradi) * km * 2 * f2f * (fornarkostnadur / 60) +
      ((f2f * lengd) / 60) * fornarkostnadur) *
    magn
  )
}

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

interface UserInput {
  nameOfProcess: string
  amountPerYear: number
  processDurationInMinutes: number
  visitCountToCompleteProcess: number
  averageDistanceToProcessInKilometers: number
}

interface Results {
  /* Ávinningur stofnunar */
  institutionGain: number

  /* Ávinningur borgara */
  citizenGain: number

  /* Ígildi stöðugildis */
  staffFreeToDoOtherThings: number

  /* Eknir kílómetrar */
  drivenKilometersSaved: number

  /* Sparaðir dagar hjá fólki við að sækja sér þjónustu */
  citizenTimeSaved: number
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

  const [resultMetadata, setResultMetadata] = useState({
    previousInput: null as null | UserInput,
  })

  const [userInput, setUserInput] = useState<UserInput>({
    amountPerYear: 0,
    averageDistanceToProcessInKilometers:
      slice.configJson?.['defaultAverageDistanceToProcessInKilometers'] ?? 7.5,
    nameOfProcess: '',
    processDurationInMinutes: 0,
    visitCountToCompleteProcess: 0,
  })

  const preConditions = {
    staffIncomePerHour:
      slice.configJson?.['Laun starfsmanna í framþjónustu krónur á klst'] ??
      6010,
    citizenIncomeLossPerHour:
      slice.configJson?.[
        'Fórnarkostnaður borgarar (meðallaun í landi á klst)'
      ] ?? 5122,
    kilometerFeePerKilometer: slice.configJson?.['Km gjald pr km'] ?? 141,
    averageGreenhouseGasesEmittedByCarPerKilometer:
      slice.configJson?.[
        'Average greenhouse gases emitted by car per km kg CO2e/km'
      ] ?? 0,
    averageDrivingSpeedInKilometersPerHour:
      slice.configJson?.['Meðalökuhraði km/klst'] ?? 40,
    bias: slice.configJson?.['Bias'] ?? 0,
    co2EmissionPerDrivenKilometer: slice.configJson?.['Kg co2 á ekinn km'] ?? 0,
    etsCO2Price: slice.configJson?.['Verð á CO2 kg (ETS) í krónum'] ?? 12,
    carbonWoodCO2Price:
      slice.configJson?.['Verð á CO2 kg (Kolviður) í krónum'] ?? 3,
    staffHourAverageInYear:
      slice.configJson?.['Klukkustundir í stöðugildi á ári'] ?? 1606,
    ringRoadDistanceInKilometers:
      slice.configJson?.['Hringvegurinn í km'] ?? 1321,
  }

  const results: Results = {
    institutionGain: avinningurR(
      preConditions.staffIncomePerHour,
      userInput.visitCountToCompleteProcess,
      userInput.processDurationInMinutes,
      userInput.amountPerYear,
    ),
    citizenGain: avinningurB(
      preConditions.citizenIncomeLossPerHour,
      userInput.processDurationInMinutes,
      userInput.visitCountToCompleteProcess,
      userInput.averageDistanceToProcessInKilometers,
      preConditions.kilometerFeePerKilometer,
      preConditions.averageDrivingSpeedInKilometersPerHour,
      userInput.amountPerYear,
    ),
    staffFreeToDoOtherThings:
      (userInput.amountPerYear *
        userInput.processDurationInMinutes *
        userInput.visitCountToCompleteProcess) /
      60 /
      preConditions.staffHourAverageInYear,
    drivenKilometersSaved:
      userInput.amountPerYear *
      userInput.visitCountToCompleteProcess *
      2 *
      userInput.averageDistanceToProcessInKilometers,
    citizenTimeSaved:
      (((userInput.visitCountToCompleteProcess *
        2 *
        userInput.averageDistanceToProcessInKilometers *
        60) /
        preConditions.averageDrivingSpeedInKilometersPerHour +
        userInput.visitCountToCompleteProcess *
          userInput.processDurationInMinutes) *
        userInput.amountPerYear) /
      60 /
      24,
  }

  const gainPerCitizen = 0
  const ringRoadTripsSaved =
    results.drivenKilometersSaved / preConditions.ringRoadDistanceInKilometers

  const resultColumnSpan: SpanType = ['1/1', '1/2', '1/1', '1/2', '1/3']

  const displayResults =
    resultMetadata.previousInput &&
    !canCalculate(userInput, resultMetadata.previousInput)

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
            disabled={!canCalculate(userInput, resultMetadata.previousInput)}
            onClick={() => {
              setResultMetadata({
                previousInput: {
                  ...userInput,
                },
              })
            }}
          >
            {formatMessage(t.results.calculate)}
          </Button>
        </Stack>
      </Box>

      {displayResults && (
        <Stack space={3}>
          <Text variant="h2">{userInput.nameOfProcess}</Text>

          <GridRow rowGap={4}>
            <GridColumn span={resultColumnSpan}>
              <ResultCard
                title={
                  results.institutionGain >= 1e6
                    ? `${formatValueForPresentation(
                        activeLocale,
                        results.institutionGain,
                      )}${formatMessage(t.results.currencyPostfix)}`
                    : (formatCurrency(
                        results.institutionGain,
                        formatMessage(t.results.currencyPostfix),
                      ) as string)
                }
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
                description={formatMessage(t.results.staffFreeToDoOtherThings)}
                icon={<Icon icon="people" color="blue400" size="large" />}
              />
            </GridColumn>
            <GridColumn span={resultColumnSpan}>
              <ResultCard
                title={
                  formatCurrency(
                    gainPerCitizen,
                    formatMessage(t.results.currencyPostfix),
                  ) as string
                }
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
                title={formatValueForPresentation(
                  activeLocale,
                  userInput.amountPerYear,
                )}
                description={formatMessage(t.results.digitalProcessesPerYear)}
                icon={<Icon icon="document" color="blue400" size="large" />}
              />
            </GridColumn>
          </GridRow>
        </Stack>
      )}
    </Stack>
  )
}
