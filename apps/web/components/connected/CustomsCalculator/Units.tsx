import { Control, Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Select,
  Stack,
  StringOption,
  Text,
} from '@island.is/island-ui/core'
import type { SpanType } from '@island.is/island-ui/core/types'
import { InputController } from '@island.is/shared/form-fields'
import { formatCurrency } from '@island.is/shared/utils'
import type { CustomsCalculatorCalculateQuery } from '@island.is/web/graphql/schema'
import { GET_CUSTOMS_CALCULATOR_CALCULATE } from '@island.is/web/screens/queries/CustomsCalculator'

import { translation as translationStrings } from './translation.strings'
import * as styles from './Units.css'

const COLUMN_SPANS: SpanType[] = [
  ['12/12', '4/12', '5/12', '4/12', '3/12'],
  ['12/12', '6/12', '7/12', '6/12', '5/12'],
  ['12/12', '6/12', '5/12', '4/12', '4/12'],
]

interface UnitInputProps {
  name: string
  label: string
  description?: string
  inputMode?: 'decimal' | 'numeric'
  control: Control<UnitsFormValues>
  currency?: boolean
}

export const UnitInput = ({
  name,
  label,
  description,
  inputMode,
  control,
}: UnitInputProps) => {
  return (
    <Stack space={1}>
      <InputController
        id={name}
        name={name}
        label={label}
        size="sm"
        backgroundColor="blue"
        type="number"
        inputMode={inputMode}
        currency={true}
        suffix=""
        control={control}
        allowNegative={false}
      />
      {!!description && (
        <Box paddingX={1}>
          <Text variant="small">{description}</Text>
        </Box>
      )}
    </Stack>
  )
}

interface UnitsProps {
  unitStrings: string[]
  currencyOptions: StringOption[]
  tariffNumber: string
}

interface UnitsFormValues {
  net: string
  unitCount: string
  liters: string
  percentage: string
  nedc: string
  nedcWeighted: string
  wltp: string
  wltpWeighted: string
  currency?: StringOption
  priceWithShipping: string
}

export const Units = ({
  unitStrings,
  currencyOptions,
  tariffNumber,
}: UnitsProps) => {
  const { formatMessage } = useIntl()

  const { control, getValues } = useForm<UnitsFormValues>({
    defaultValues: {
      net: '',
      unitCount: '',
      liters: '',
      percentage: '',
      nedc: '',
      nedcWeighted: '',
      wltp: '',
      wltpWeighted: '',
      currency: currencyOptions?.[0],
      priceWithShipping: '',
    },
  })

  const [calculate, { data }] = useLazyQuery<CustomsCalculatorCalculateQuery>(
    GET_CUSTOMS_CALCULATOR_CALCULATE,
  )

  let columnSpanIndex = 0

  return (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span={['12/12']}>
          <GridRow rowGap={3}>
            <GridColumn span={COLUMN_SPANS[0]}>
              <Controller
                name="currency"
                control={control}
                render={({ field: { onChange } }) => (
                  <Select
                    options={currencyOptions}
                    size="sm"
                    label={formatMessage(translationStrings.currencyLabel)}
                    backgroundColor="blue"
                    onChange={(option) => {
                      if (option) onChange(option)
                    }}
                    defaultValue={currencyOptions?.[0]}
                  />
                )}
              />
            </GridColumn>
            <GridColumn span={COLUMN_SPANS[1]}>
              <UnitInput
                name="priceWithShipping"
                label={formatMessage(translationStrings.priceWithShippingLabel)}
                description={formatMessage(
                  translationStrings.priceWithShippingDescription,
                )}
                control={control}
                currency={true}
              />
            </GridColumn>
          </GridRow>
        </GridColumn>
        <GridColumn span="1/1">
          <GridRow rowGap={3}>
            {unitStrings.includes('STK') && (
              <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                <UnitInput
                  name="unitCount"
                  label={formatMessage(translationStrings.unitCountLabel)}
                  control={control}
                  description={formatMessage(
                    translationStrings.unitCountDescription,
                  )}
                />
              </GridColumn>
            )}
            {unitStrings.includes('NET') && (
              <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                <UnitInput
                  name="net"
                  label={formatMessage(translationStrings.netWeightLabel)}
                  control={control}
                  description={formatMessage(
                    translationStrings.netWeightDescription,
                  )}
                />
              </GridColumn>
            )}
            {unitStrings.includes('LIT') && (
              <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                <UnitInput
                  name="liters"
                  label={formatMessage(translationStrings.litersLabel)}
                  control={control}
                  description={formatMessage(
                    translationStrings.litersDescription,
                  )}
                />
              </GridColumn>
            )}
            {unitStrings.includes('PRO') && (
              <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                <UnitInput
                  name="percentage"
                  label={formatMessage(translationStrings.percentageLabel)}
                  control={control}
                  description={formatMessage(
                    translationStrings.percentageDescription,
                  )}
                />
              </GridColumn>
            )}
            {unitStrings.includes('UT*') && (
              <GridColumn span="1/1">
                <GridRow rowGap={3}>
                  <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                    <UnitInput
                      name="nedc"
                      label={formatMessage(
                        translationStrings.nedcEmissionLabel,
                      )}
                      control={control}
                      description={formatMessage(
                        translationStrings.nedcDescription,
                      )}
                    />
                  </GridColumn>
                  <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                    <UnitInput
                      name="nedcWeighted"
                      label={formatMessage(
                        translationStrings.nedcWeightedEmissionLabel,
                      )}
                      control={control}
                      description={formatMessage(
                        translationStrings.nedcWeightedEmissionDescription,
                      )}
                    />
                  </GridColumn>
                  <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                    <UnitInput
                      name="wltp"
                      label={formatMessage(
                        translationStrings.wltpEmissionLabel,
                      )}
                      control={control}
                      description={formatMessage(
                        translationStrings.wltpEmissionDescription,
                      )}
                    />
                  </GridColumn>
                  <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                    <UnitInput
                      name="wltpWeighted"
                      label={formatMessage(
                        translationStrings.wltpWeightedEmissionLabel,
                      )}
                      control={control}
                      description={formatMessage(
                        translationStrings.wltpWeightedEmissionDescription,
                      )}
                    />
                  </GridColumn>
                </GridRow>
              </GridColumn>
            )}
          </GridRow>
        </GridColumn>
      </GridRow>

      <Box className={styles.buttonContainer}>
        <Button
          fluid={true}
          disabled={false}
          onClick={() => {
            const values = getValues()
            calculate({
              variables: {
                input: {
                  tariffNumber,
                  currencyCode: values.currency?.value,
                  priceWithShipping: values.priceWithShipping,
                  unitCount: values.unitCount,
                  netWeightKg: values.net,
                  liters: values.liters,
                  percentage: values.percentage,
                  nedcEmission: values.nedc,
                  nedcWeightedEmission: values.nedcWeighted,
                  wltpEmission: values.wltp,
                  wltpWeightedEmission: values.wltpWeighted,
                },
              },
            })
          }}
        >
          {formatMessage(translationStrings.runCalculation)}
        </Button>
      </Box>
      {data?.customsCalculatorCalculate && (
        <Box background="purple100" padding={3}>
          <Stack space={3}>
            <Stack space={2}>
              <Text variant="h5">
                {formatMessage(translationStrings.totalAmountLabel)}
              </Text>
              <Text variant="h2">
                {formatCurrency(
                  Number(data?.customsCalculatorCalculate?.totalAmount),
                )}
              </Text>
            </Stack>
            <Stack space={3}>
              <Divider thickness="thick" weight="purple300" />
              <GridRow>
                <GridColumn span={['4/12']}>
                  <Text variant="h5">
                    {formatMessage(translationStrings.additionalAmountLabel)}
                  </Text>
                </GridColumn>
                <GridColumn span={['4/12']}>
                  <Text variant="h5">
                    {formatCurrency(
                      Number(
                        data?.customsCalculatorCalculate?.additionalAmount,
                      ),
                    )}
                  </Text>
                </GridColumn>
              </GridRow>
              <Divider thickness="thick" weight="purple300" />
            </Stack>
            <Stack space={2}>
              <GridRow>
                <GridColumn span={['4/12']}>
                  <Text variant="h5">
                    {formatMessage(translationStrings.breakdownLabel)}
                  </Text>
                </GridColumn>
                <GridColumn span={['4/12']}>
                  <Text variant="h5">
                    {formatMessage(translationStrings.amountLabel)}
                  </Text>
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={['4/12']}>
                  <Text>
                    {formatMessage(translationStrings.startAmountLabel)}
                  </Text>
                </GridColumn>
                <GridColumn span={['4/12']}>
                  <Text>
                    {formatCurrency(
                      Number(data?.customsCalculatorCalculate?.startAmount),
                    )}
                  </Text>
                </GridColumn>
              </GridRow>
              {data?.customsCalculatorCalculate?.charges?.map((charge) => (
                <GridRow>
                  <GridColumn span={['4/12']}>
                    <Text>{charge.description}</Text>
                  </GridColumn>
                  <GridColumn span={['4/12']}>
                    <Text>{formatCurrency(Number(charge.amount))}</Text>
                  </GridColumn>
                </GridRow>
              ))}
            </Stack>
            <Divider thickness="standard" weight="purple300" />
            <GridRow>
              <GridColumn span={['4/12']}>
                <Text variant="h5">
                  {formatMessage(translationStrings.totalAmountBreakdownLabel)}
                </Text>
              </GridColumn>
              <GridColumn span={['4/12']}>
                <Text>
                  {formatCurrency(
                    Number(data?.customsCalculatorCalculate?.totalAmount),
                  )}
                </Text>
              </GridColumn>
            </GridRow>
          </Stack>
        </Box>
      )}
    </Stack>
  )
}
