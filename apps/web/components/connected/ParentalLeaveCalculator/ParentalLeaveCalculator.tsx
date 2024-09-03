import { type PropsWithChildren, useMemo, useRef } from 'react'
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
  Button,
  GridColumn,
  GridRow,
  Inline,
  Input,
  type Option,
  RadioButton,
  Select,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'
import type { ConnectedComponent } from '@island.is/web/graphql/schema'
import { formatCurrency } from '@island.is/web/utils/currency'

import { MarkdownText } from '../../Organization'
import { translations as t } from './translations.strings'
import * as styles from './ParentalLeaveCalculator.css'

interface FieldProps {
  heading: string
  headingTooltip?: string
  description?: string
  tooltip?: string
}

const Field = ({
  heading,
  headingTooltip,
  description,
  tooltip,
  children,
}: PropsWithChildren<FieldProps>) => {
  return (
    <Stack space={2}>
      <Inline flexWrap="nowrap" space={1} alignY="center">
        <Text variant="h3">{heading}</Text>
        {headingTooltip && <Tooltip text={headingTooltip} />}
      </Inline>
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

enum ParentalLeavePeriod {
  MONTH = 'month',
  THREE_WEEKS = 'threeWeeks',
  TWO_WEEKS = 'twoWeeks',
}

enum Screen {
  FORM = 'form',
  RESULTS = 'results',
}

enum LegalDomicileInIceland {
  YES = 'y',
  NO = 'n',
}

interface ParentalLeaveCalculatorProps {
  slice: ConnectedComponent
}

interface ScreenProps extends ParentalLeaveCalculatorProps {
  changeScreen: () => void
}

const FormScreen = ({ slice, changeScreen }: ScreenProps) => {
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
    const options: { label: string; multiplier: number }[] = slice.configJson
      ?.unionOptions
      ? [...slice.configJson.unionOptions]
      : []

    options.sort(sortAlpha('label'))

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

  const parentalLeavePeriodOptions = useMemo<Option<string>[]>(() => {
    return [
      {
        label: formatMessage(t.parentalLeavePeriod.monthOption),
        value: ParentalLeavePeriod.MONTH,
      },
      {
        label: formatMessage(t.parentalLeavePeriod.threeWeeksOption),
        value: ParentalLeavePeriod.THREE_WEEKS,
      },
      {
        label: formatMessage(t.parentalLeavePeriod.twoWeeksOption),
        value: ParentalLeavePeriod.TWO_WEEKS,
      },
    ]
  }, [formatMessage])

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
    parseAsInteger.withDefault(100),
  )
  const [parentalLeavePeriod, setParentalLeavePeriod] = useQueryState(
    'parentalLeavePeriod',
    parseAsStringEnum(Object.values(ParentalLeavePeriod)),
  )
  const [parentalLeaveRatio, setParentalLeaveRatio] = useQueryState(
    'parentalLeaveRatio',
    parseAsInteger.withDefault(100),
  )
  const [legalDomicileInIceland, setLegalDomicileInIceland] = useQueryState(
    'legalDomicileInIceland',
    parseAsStringEnum(Object.values(LegalDomicileInIceland)),
  )

  const canCalculate = () => {
    let value =
      Object.values(Status).includes(status) &&
      yearOptions.some((year) => year.value === birthyear)

    if (status === Status.OUTSIDE_WORKFORCE) {
      value = value && legalDomicileInIceland === LegalDomicileInIceland.YES
    }

    if (status === Status.PARENTAL_LEAVE) {
      value =
        value &&
        typeof income === 'number' &&
        income > 0 &&
        !!workPercentage &&
        Object.values(WorkPercentage).includes(workPercentage) &&
        parentalLeavePeriodOptions.some(
          (option) => option.value === parentalLeavePeriod,
        )
    }

    return value
  }

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

        {status === Status.OUTSIDE_WORKFORCE && (
          <Field
            heading={formatMessage(t.legalDomicile.heading)}
            headingTooltip={formatMessage(t.legalDomicile.tooltip)}
          >
            <GridRow rowGap={1}>
              <GridColumn span={['1/1', '1/2']}>
                <RadioButton
                  hasError={
                    legalDomicileInIceland === LegalDomicileInIceland.NO
                  }
                  id={LegalDomicileInIceland.YES}
                  onChange={() => {
                    setLegalDomicileInIceland(LegalDomicileInIceland.YES)
                  }}
                  checked={
                    legalDomicileInIceland === LegalDomicileInIceland.YES
                  }
                  value={LegalDomicileInIceland.YES}
                  backgroundColor="white"
                  large={true}
                  label={formatMessage(t.legalDomicile.yes)}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <RadioButton
                  hasError={
                    legalDomicileInIceland === LegalDomicileInIceland.NO
                  }
                  id={LegalDomicileInIceland.NO}
                  onChange={() => {
                    setLegalDomicileInIceland(LegalDomicileInIceland.NO)
                  }}
                  checked={legalDomicileInIceland === LegalDomicileInIceland.NO}
                  value={LegalDomicileInIceland.NO}
                  backgroundColor="white"
                  large={true}
                  label={formatMessage(t.legalDomicile.no)}
                />
              </GridColumn>
            </GridRow>
            {legalDomicileInIceland === LegalDomicileInIceland.NO && (
              <Text fontWeight="semiBold" color="red400">
                {formatMessage(t.legalDomicile.dontHaveRight)}
              </Text>
            )}
          </Field>
        )}

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

        {status === Status.PARENTAL_LEAVE && (
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
        )}

        {status === Status.PARENTAL_LEAVE && (
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
        )}

        {status === Status.PARENTAL_LEAVE && (
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
        )}

        {status === Status.PARENTAL_LEAVE && (
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
        )}

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

        {status === Status.PARENTAL_LEAVE && (
          <Field
            heading={formatMessage(t.parentalLeavePeriod.heading)}
            description={formatMessage(t.parentalLeavePeriod.description)}
          >
            <Select
              onChange={(option) => {
                setParentalLeavePeriod(
                  (option?.value as ParentalLeavePeriod) ?? null,
                )
              }}
              value={parentalLeavePeriodOptions.find(
                (option) => option.value === parentalLeavePeriod,
              )}
              label={formatMessage(t.parentalLeavePeriod.label)}
              options={parentalLeavePeriodOptions}
            />
          </Field>
        )}

        {status === Status.PARENTAL_LEAVE && (
          <Field
            heading={formatMessage(t.parentalLeaveRatio.heading)}
            description={formatMessage(t.parentalLeaveRatio.description)}
          >
            <NumberFormat
              onValueChange={({ value }) => {
                setParentalLeaveRatio(Number(value))
              }}
              label={formatMessage(t.parentalLeaveRatio.label)}
              value={String(parentalLeaveRatio || '')}
              customInput={Input}
              name="parentalLeaveRatio"
              id="parentalLeaveRatio"
              type="text"
              inputMode="numeric"
              suffix={formatMessage(t.parentalLeaveRatio.suffix)}
              placeholder={formatMessage(t.parentalLeaveRatio.placeholder)}
              format={(value) => {
                const maxParentalLeaveRatio =
                  slice.configJson?.maxParentalLeaveRatio ?? 100
                if (Number(value) > maxParentalLeaveRatio) {
                  value = String(maxParentalLeaveRatio)
                }
                return `${value}${formatMessage(t.parentalLeaveRatio.suffix)}`
              }}
            />
          </Field>
        )}

        <Button disabled={!canCalculate()} onClick={changeScreen}>
          {formatMessage(t.calculate.buttonText)}
        </Button>
      </Stack>
    </Box>
  )
}

const ResultsScreen = ({ slice, changeScreen }: ScreenProps) => {
  const { formatMessage } = useIntl()

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
    parseAsInteger.withDefault(100),
  )
  const [parentalLeavePeriod, setParentalLeavePeriod] = useQueryState(
    'parentalLeavePeriod',
    parseAsStringEnum(Object.values(ParentalLeavePeriod)),
  )
  const [parentalLeaveRatio, setParentalLeaveRatio] = useQueryState(
    'parentalLeaveRatio',
    parseAsInteger.withDefault(100),
  )
  const [legalDomicileInIceland, setLegalDomicileInIceland] = useQueryState(
    'legalDomicileInIceland',
    parseAsStringEnum(Object.values(LegalDomicileInIceland)),
  )

  // TODO: calculate
  const mainResultBeforeDeduction = 440000
  const mainResultAfterDeduction = 242471

  const mainSectionKeys = {
    [Status.PARENTAL_LEAVE]: {
      heading: t.results.mainParentalLeaveHeading,
      description: t.results.mainParentalLeaveDescription,
    },
    [Status.STUDENT]: {
      heading: t.results.mainStudentHeading,
      description: t.results.mainStudentDescription,
    },
    [Status.OUTSIDE_WORKFORCE]: {
      heading: t.results.mainOutsideWorkforceHeading,
      description: t.results.mainOutsideWorkforceDescription,
    },
  }

  const ratio =
    status === Status.PARENTAL_LEAVE && parentalLeaveRatio < 100
      ? parentalLeaveRatio
      : 100

  return (
    <Stack space={5}>
      <Stack space={3}>
        <Box background="blue100" paddingY={3} paddingX={4} textAlign="center">
          <Box className={styles.resultBorder} paddingY={2} paddingX={3}>
            <Stack space={2}>
              <Text variant="h3">
                {formatMessage(mainSectionKeys[status].heading)}
              </Text>
              <Text>
                {formatMessage(mainSectionKeys[status].description, {
                  ratio,
                })}
              </Text>
              <Text fontWeight="semiBold" variant="h3">
                {formatCurrency(
                  mainResultAfterDeduction,
                  formatMessage(t.results.currencySuffix),
                )}
              </Text>
              <Text>{formatMessage(t.results.mainDisclaimer)}</Text>
            </Stack>
          </Box>
        </Box>

        <Button onClick={changeScreen} variant="text" preTextIcon="arrowBack">
          {formatMessage(t.results.changeAssumptions)}
        </Button>
      </Stack>

      <Stack space={3}>
        <Table.Table>
          <Table.Head>
            <Table.HeadData>
              {formatMessage(t.results.incomePrerequisitesHeading)}
            </Table.HeadData>
            <Table.HeadData align="right">
              {formatMessage(t.results.perMonth)}
            </Table.HeadData>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Data>
                <MarkdownText>
                  {formatMessage(t.results.incomePrerequisitesDescription)}
                </MarkdownText>
              </Table.Data>
              <Table.Data />
            </Table.Row>
            <Table.Row>
              <Table.Data>
                <Text fontWeight="semiBold">
                  {formatMessage(t.results.incomePrerequisitesSubHeading)}
                </Text>
              </Table.Data>
              <Table.Data align="right">
                <Text whiteSpace="nowrap">550.000 krónur</Text>
              </Table.Data>
            </Table.Row>
          </Table.Body>
        </Table.Table>

        <Table.Table>
          <Table.Head>
            <Table.HeadData>
              {formatMessage(t.results.mainResultBeforeDeductionHeading)}
            </Table.HeadData>
            <Table.HeadData align="right">
              {formatMessage(t.results.perMonth)}
            </Table.HeadData>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Data>
                <Text fontWeight="semiBold">
                  {formatMessage(
                    t.results.mainResultBeforeDeductionDescription,
                    {
                      ratio,
                    },
                  )}
                </Text>
              </Table.Data>
              <Table.Data align="right">
                <Text whiteSpace="nowrap">
                  {formatCurrency(
                    mainResultBeforeDeduction,
                    formatMessage(t.results.currencySuffix),
                  )}
                </Text>
              </Table.Data>
            </Table.Row>
          </Table.Body>
        </Table.Table>

        <Table.Table>
          <Table.Head>
            <Table.HeadData>
              {formatMessage(t.results.deductionHeading)}
            </Table.HeadData>
            <Table.HeadData align="right">
              {formatMessage(t.results.amount)}
            </Table.HeadData>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Data>
                <Text fontWeight="semiBold">
                  {formatMessage(t.results.pensionFunding)}
                </Text>
              </Table.Data>
              <Table.Data align="right">
                <Text whiteSpace="nowrap">
                  {formatCurrency(
                    17600,
                    formatMessage(t.results.currencySuffix),
                  )}
                </Text>
              </Table.Data>
            </Table.Row>
            <Table.Row>
              <Table.Data>
                <Text fontWeight="semiBold">
                  {formatMessage(t.results.additionalPensionFunding)}
                </Text>
              </Table.Data>
              <Table.Data align="right">
                <Text whiteSpace="nowrap">
                  {formatCurrency(0, formatMessage(t.results.currencySuffix))}
                </Text>
              </Table.Data>
            </Table.Row>
            <Table.Row>
              <Table.Data>
                <Stack space={2}>
                  <Text fontWeight="semiBold">
                    {formatMessage(t.results.tax)}
                  </Text>
                  <Text>
                    {formatMessage(t.results.totalTax)} -{' '}
                    {formatCurrency(
                      132972,
                      formatMessage(t.results.currencySuffix),
                    )}
                  </Text>
                  <Text>
                    {formatMessage(t.results.usedPersonalDiscount)} -{' '}
                    {formatCurrency(
                      64926,
                      formatMessage(t.results.currencySuffix),
                    )}
                  </Text>
                </Stack>
              </Table.Data>
              <Table.Data align="right" style={{ verticalAlign: 'top' }}>
                <Text whiteSpace="nowrap">
                  {formatCurrency(
                    68046,
                    formatMessage(t.results.currencySuffix),
                  )}
                </Text>
              </Table.Data>
            </Table.Row>
            <Table.Row>
              <Table.Data>
                <Text fontWeight="semiBold">
                  {formatMessage(t.results.unionFee)}
                </Text>
              </Table.Data>
              <Table.Data align="right">
                <Text whiteSpace="nowrap">
                  {formatCurrency(0, formatMessage(t.results.currencySuffix))}
                </Text>
              </Table.Data>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </Stack>
    </Stack>
  )
}

export const ParentalLeaveCalculator = ({
  slice,
}: ParentalLeaveCalculatorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeScreen, setActiveScreen] = useQueryState(
    'activeScreen',
    parseAsStringEnum(Object.values(Screen)).withDefault(Screen.FORM),
  )

  return (
    <div ref={containerRef}>
      {activeScreen !== Screen.RESULTS && (
        <FormScreen
          slice={slice}
          changeScreen={() => {
            setActiveScreen(Screen.RESULTS)
            window.scrollTo({
              behavior: 'smooth',
              top: containerRef.current?.offsetTop ?? 0,
            })
          }}
        />
      )}
      {activeScreen === Screen.RESULTS && (
        <ResultsScreen
          slice={slice}
          changeScreen={() => {
            setActiveScreen(Screen.FORM)
            window.scrollTo({
              behavior: 'smooth',
              top: containerRef.current?.offsetTop ?? 0,
            })
          }}
        />
      )}
    </div>
  )
}
