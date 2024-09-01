import { type PropsWithChildren, useMemo } from 'react'
import { useIntl } from 'react-intl'
import NumberFormat from 'react-number-format'
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from 'next-usequerystate'

import {
  Box,
  GridColumn,
  GridRow,
  Input,
  type Option,
  RadioButton,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import type { ConnectedComponent } from '@island.is/web/graphql/schema'

import { translations as t } from './translations.strings'

interface FieldProps {
  heading: string
  description?: string
  tooltip?: string
}

const Field = ({
  heading,
  description,
  tooltip,
  children,
}: PropsWithChildren<FieldProps>) => {
  return (
    <Stack space={2}>
      <Text variant="h3">{heading}</Text>
      {description && (
        <Text variant="medium">
          {description}
          {tooltip && <Tooltip text={tooltip} />}
        </Text>
      )}
      {children}
    </Stack>
  )
}

enum Status {
  PARENTAL_LEAVE = 'parentalLeave',
  STUDENT = 'student',
  OUTSIDE_WORKFORCE = 'outsideWorkForce',
}

enum WorkPercentage {
  OPTION_1 = 'option1',
  OPTION_2 = 'option2',
}

interface ParentalLeaveCalculatorProps {
  slice: ConnectedComponent
}

export const ParentalLeaveCalculator = ({
  slice,
}: ParentalLeaveCalculatorProps) => {
  const { formatMessage } = useIntl()

  const statusOptions = useMemo<Option<Status>[]>(() => {
    return [
      {
        label: formatMessage(t.status.parentalLeaveOption),
        value: Status.PARENTAL_LEAVE,
      },
      {
        label: formatMessage(t.status.studentOption),
        value: Status.STUDENT,
      },
      {
        label: formatMessage(t.status.outsideWorkforceOption),
        value: Status.OUTSIDE_WORKFORCE,
      },
    ]
  }, [formatMessage])

  const yearOptions = useMemo<Option<number>[]>(() => {
    const keys = Object.keys(slice.configJson?.yearConfig || {}).map(Number)
    keys.sort()
    return keys.map((key) => ({
      label: String(key),
      value: key,
    }))
  }, [slice.configJson?.yearConfig])

  const additionalPensionFundingOptions = useMemo<
    Option<number | null>[]
  >(() => {
    const options: number[] = slice.configJson
      ?.additionalPensionFundingOptions ?? [1, 2, 3, 4]

    return [
      { value: null, label: formatMessage(t.additionalPensionFunding.none) },
      ...options.map((option) => ({
        label: `${option} ${formatMessage(
          t.additionalPensionFunding.optionSuffix,
        )}`,
        value: option,
      })),
    ]
  }, [formatMessage, slice.configJson?.additionalPensionFundingOptions])

  const unionOptions = useMemo<Option<string | null>[]>(() => {
    const options: { label: string; multiplier: number }[] =
      slice.configJson?.unionOptions ?? []

    return [
      {
        value: null,
        label: formatMessage(t.union.none),
      },
      ...options.map((option) => ({
        label: option.label,
        value: option.label,
      })),
    ]
  }, [formatMessage, slice.configJson?.unionOptions])

  const [status, setStatus] = useQueryState<Status>(
    'status',
    parseAsStringEnum(Object.values(Status)).withDefault(Status.PARENTAL_LEAVE),
  )
  const [birthyear, setBirthyear] = useQueryState('birthyear', parseAsInteger)
  const [workPercentage, setWorkPercentage] = useQueryState(
    'workPercentage',
    parseAsStringEnum(Object.values(WorkPercentage)),
  )
  const [income, setIncome] = useQueryState('income', parseAsInteger)
  const [
    additionalPensionFundingPercentage,
    setAdditionalPensionFundingPercentage,
  ] = useQueryState('additionalPensionFunding', parseAsInteger)
  const [union, setUnion] = useQueryState('union', parseAsString)
  const [personalDiscount, setPersonalDiscount] = useQueryState(
    'personalDiscount',
    parseAsInteger,
  )

  return (
    <Box background="blue100" paddingY={[3, 3, 5]} paddingX={[3, 3, 3, 3, 12]}>
      <Stack space={5}>
        <Field heading={formatMessage(t.status.heading)}>
          <Select
            onChange={(option) => {
              setStatus((option?.value as Status) ?? null)
            }}
            value={statusOptions.find((option) => option.value === status)}
            label={formatMessage(t.status.label)}
            options={statusOptions}
          />
        </Field>

        <Field
          heading={formatMessage(t.childBirthYear.heading)}
          description={formatMessage(t.childBirthYear.description)}
        >
          <Select
            onChange={(option) => {
              setBirthyear(option?.value ?? null)
            }}
            value={yearOptions.find((option) => option.value === birthyear)}
            label={formatMessage(t.childBirthYear.label)}
            options={yearOptions}
          />
        </Field>

        <Field
          heading={formatMessage(t.workPercentage.heading)}
          description={formatMessage(t.workPercentage.description)}
          tooltip={formatMessage(t.workPercentage.tooltip)}
        >
          <GridRow rowGap={1}>
            <GridColumn span={['1/1', '1/2']}>
              <RadioButton
                id={WorkPercentage.OPTION_1}
                onChange={() => {
                  setWorkPercentage(WorkPercentage.OPTION_1)
                }}
                checked={workPercentage === WorkPercentage.OPTION_1}
                value={WorkPercentage.OPTION_1}
                backgroundColor="white"
                large={true}
                label={formatMessage(t.workPercentage.option1)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']}>
              <RadioButton
                id={WorkPercentage.OPTION_2}
                onChange={() => {
                  setWorkPercentage(WorkPercentage.OPTION_2)
                }}
                checked={workPercentage === WorkPercentage.OPTION_2}
                value={WorkPercentage.OPTION_2}
                backgroundColor="white"
                large={true}
                label={formatMessage(t.workPercentage.option2)}
              />
            </GridColumn>
          </GridRow>
        </Field>

        <Field
          heading={formatMessage(t.income.heading)}
          description={formatMessage(t.income.description)}
        >
          <NumberFormat
            onValueChange={({ value }) => {
              setIncome(Number(value))
            }}
            label={formatMessage(t.income.label)}
            tooltip={formatMessage(t.income.tooltip)}
            value={String(income || '')}
            customInput={Input}
            name="income"
            id="income"
            type="text"
            inputMode="numeric"
            thousandSeparator="."
            decimalSeparator=","
            suffix={formatMessage(t.income.inputSuffix)}
            placeholder={formatMessage(t.income.inputPlaceholder)}
            maxLength={
              formatMessage(t.income.inputSuffix).length +
              (slice.configJson?.incomeInputMaxLength ?? 12)
            }
          />
        </Field>
        <Field
          heading={formatMessage(t.additionalPensionFunding.heading)}
          description={formatMessage(t.additionalPensionFunding.description)}
        >
          <Select
            onChange={(option) => {
              setAdditionalPensionFundingPercentage(option?.value ?? null)
            }}
            value={additionalPensionFundingOptions.find(
              (option) => option.value === additionalPensionFundingPercentage,
            )}
            label={formatMessage(t.additionalPensionFunding.label)}
            options={additionalPensionFundingOptions}
          />
        </Field>
        <Field
          heading={formatMessage(t.union.heading)}
          description={formatMessage(t.union.description)}
        >
          <Select
            onChange={(option) => {
              setUnion(option?.value ?? null)
            }}
            value={unionOptions.find((option) => option.value === union)}
            label={formatMessage(t.union.label)}
            options={unionOptions}
          />
        </Field>
        <Field
          heading={formatMessage(t.personalDiscount.heading)}
          description={formatMessage(t.personalDiscount.description)}
        >
          <NumberFormat
            onValueChange={({ value }) => {
              setPersonalDiscount(Number(value))
            }}
            label={formatMessage(t.personalDiscount.label)}
            value={String(personalDiscount || '')}
            customInput={Input}
            name="personalDiscount"
            id="personalDiscount"
            type="text"
            inputMode="numeric"
            suffix={formatMessage(t.personalDiscount.suffix)}
            placeholder={formatMessage(t.personalDiscount.placeholder)}
            format={(value) => {
              const maxPersonalDiscount =
                slice.configJson?.maxPersonalDiscount ?? 100
              if (Number(value) > maxPersonalDiscount) {
                value = String(maxPersonalDiscount)
              }
              return `${value}${formatMessage(t.personalDiscount.suffix)}`
            }}
          />
        </Field>
      </Stack>
    </Box>
  )
}
