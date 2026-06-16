import { ChangeEvent } from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'

import {
  Box,
  GridColumn,
  GridRow,
  Select,
  Stack,
  StringOption,
  Text,
} from '@island.is/island-ui/core'
import type { SpanType } from '@island.is/island-ui/core/types'
import { InputController } from '@island.is/shared/form-fields'

import { translation as translationStrings } from './translation.strings'

const COLUMN_SPANS: SpanType[] = [
  ['12/12', '4/12', '5/12', '4/12', '3/12'],
  ['12/12', '6/12', '7/12', '6/12', '5/12'],
  ['12/12', '6/12', '5/12', '4/12', '4/12'],
]

interface UnitInputProps {
  name: string
  label: string
  description?: string
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  inputMode?: 'decimal' | 'numeric'
  control: Control<UnitsFormValues>
  currency?: boolean
}

export const UnitInput = ({
  name,
  label,
  description,
  onChange,
  inputMode,
  control,
  currency,
}: UnitInputProps) => {
  const { formatMessage } = useIntl()
  return (
    <Stack space={1}>
      <InputController
        id={name}
        name={name}
        label={label}
        size="sm"
        backgroundColor="blue"
        onChange={onChange}
        type="number"
        inputMode={inputMode}
        currency={true}
        suffix={
          currency ? formatMessage(translationStrings.currenctSuffix) : ''
        }
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

export const Units = ({ unitStrings, currencyOptions }: UnitsProps) => {
  const { formatMessage } = useIntl()

  const { control } = useForm<UnitsFormValues>({
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

  let columnSpanIndex = 0

  return (
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
            <Controller
              name="priceWithShipping"
              control={control}
              render={({ field: { onChange } }) => (
                <UnitInput
                  name="priceWithShipping"
                  label={formatMessage(
                    translationStrings.priceWithShippingLabel,
                  )}
                  description={formatMessage(
                    translationStrings.priceWithShippingDescription,
                  )}
                  onChange={(event) => onChange(event.target.value)}
                  control={control}
                  currency={true}
                />
              )}
            />
          </GridColumn>
        </GridRow>
      </GridColumn>
      <GridColumn span="1/1">
        <GridRow rowGap={3}>
          {unitStrings.includes('STK') && (
            <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
              <Controller
                name="unitCount"
                control={control}
                render={({ field: { onChange } }) => (
                  <UnitInput
                    name="unitCount"
                    label={formatMessage(translationStrings.unitCountLabel)}
                    onChange={(event) => onChange(event.target.value)}
                    control={control}
                    description={formatMessage(
                      translationStrings.unitCountDescription,
                    )}
                  />
                )}
              />
            </GridColumn>
          )}
          {unitStrings.includes('NET') && (
            <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
              <Controller
                name="net"
                control={control}
                render={({ field: { onChange } }) => (
                  <UnitInput
                    name="net"
                    label={formatMessage(translationStrings.netWeightLabel)}
                    onChange={(event) => onChange(event.target.value)}
                    control={control}
                    description={formatMessage(
                      translationStrings.netWeightDescription,
                    )}
                  />
                )}
              />
            </GridColumn>
          )}
          {unitStrings.includes('LIT') && (
            <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
              <Controller
                name="liters"
                control={control}
                render={({ field: { onChange } }) => (
                  <UnitInput
                    name="liters"
                    label={formatMessage(translationStrings.litersLabel)}
                    onChange={(event) => onChange(event.target.value)}
                    control={control}
                    description={formatMessage(
                      translationStrings.litersDescription,
                    )}
                  />
                )}
              />
            </GridColumn>
          )}
          {unitStrings.includes('PRO') && (
            <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
              <Controller
                name="percentage"
                control={control}
                render={({ field: { onChange } }) => (
                  <UnitInput
                    name="percentage"
                    label={formatMessage(translationStrings.percentageLabel)}
                    onChange={(event) => onChange(event.target.value)}
                    control={control}
                    description={formatMessage(
                      translationStrings.percentageDescription,
                    )}
                  />
                )}
              />
            </GridColumn>
          )}
          {unitStrings.includes('UT*') && (
            <GridColumn span="1/1">
              <GridRow rowGap={3}>
                <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                  <Controller
                    name="nedc"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <UnitInput
                        name="nedc"
                        label={formatMessage(
                          translationStrings.nedcEmissionLabel,
                        )}
                        onChange={(event) => onChange(event.target.value)}
                        control={control}
                        description={formatMessage(
                          translationStrings.nedcDescription,
                        )}
                      />
                    )}
                  />
                </GridColumn>
                <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                  <Controller
                    name="nedcWeighted"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <UnitInput
                        name="nedcWeighted"
                        label={formatMessage(
                          translationStrings.nedcWeightedEmissionLabel,
                        )}
                        onChange={(event) => onChange(event.target.value)}
                        control={control}
                        description={formatMessage(
                          translationStrings.nedcWeightedEmissionDescription,
                        )}
                      />
                    )}
                  />
                </GridColumn>
                <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                  <Controller
                    name="wltp"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <UnitInput
                        name="wltp"
                        label={formatMessage(
                          translationStrings.wltpEmissionLabel,
                        )}
                        onChange={(event) => onChange(event.target.value)}
                        control={control}
                        description={formatMessage(
                          translationStrings.wltpEmissionDescription,
                        )}
                      />
                    )}
                  />
                </GridColumn>
                <GridColumn span={COLUMN_SPANS[columnSpanIndex++]}>
                  <Controller
                    name="wltpWeighted"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <UnitInput
                        name="wltpWeighted"
                        label={formatMessage(
                          translationStrings.wltpWeightedEmissionLabel,
                        )}
                        onChange={(event) => onChange(event.target.value)}
                        control={control}
                        description={formatMessage(
                          translationStrings.wltpWeightedEmissionDescription,
                        )}
                      />
                    )}
                  />
                </GridColumn>
              </GridRow>
            </GridColumn>
          )}
        </GridRow>
      </GridColumn>
    </GridRow>
  )
}
