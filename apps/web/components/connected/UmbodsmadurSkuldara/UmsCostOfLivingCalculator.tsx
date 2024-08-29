import { useMemo, useState } from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { PropsValue } from 'react-select'
import { useQuery } from '@apollo/client/react'

import {
  AlertMessage,
  Box,
  LoadingDots,
  Option,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { Query } from '@island.is/web/graphql/schema'
import { GET_UMS_COST_OF_LIVING_CALCULATOR } from '@island.is/web/screens/queries/UmsCostOfLivingCalculator'

import { translation as translationStrings } from './translation.strings'
import * as styles from './UmsCostOfLivingCalculator.css'

interface CalculatedFieldWrapperProps {
  title: string
  value: number | undefined
}

interface InputControllerFieldWrapperProps {
  control: Control<CostOfLivingInput>
  nameAndId: string
  label: string
}

const numberFormatter = new Intl.NumberFormat('de-DE')

const InputControllerFieldWrapper = ({
  control,
  nameAndId,
  label,
}: InputControllerFieldWrapperProps) => {
  return (
    <InputController
      control={control}
      name={nameAndId}
      id={nameAndId}
      label={label}
      type="number"
      inputMode="numeric"
      currency={true}
      suffix=""
      placeholder="0"
      size="sm"
    />
  )
}

const CalculatedFieldWrapper = ({
  title,
  value,
}: CalculatedFieldWrapperProps) => {
  return (
    <Stack space={1}>
      <Box className={styles.readOnlyValues}>
        <Text variant="eyebrow" fontWeight="semiBold">
          {title}
        </Text>
        <Box paddingLeft={2}>
          <Text fontWeight="semiBold">
            {numberFormatter.format(value ?? 0)}
          </Text>
        </Box>
      </Box>
    </Stack>
  )
}

interface CostOfLivingInput {
  familySize?: string
  houseRent?: string
  electricity?: string
  propertyTaxes?: string
  propertyInsurances?: string
  schoolAndDayCare?: string
  otherExpenses?: string
}

type DataState = 'loading' | 'loaded' | 'error'

const UmsCostOfLivingCalculator = () => {
  const { formatMessage } = useIntl()
  const methods = useForm<CostOfLivingInput>({
    defaultValues: { familySize: '1+0' },
  })
  const control = methods.control

  const [dataState, setDataState] = useState<DataState>('loading')
  const [costOfLivingCalculator, setCostOfLivingCalculator] =
    useState<Query['costOfLivingCalculator']>()

  useQuery<Query>(GET_UMS_COST_OF_LIVING_CALCULATOR, {
    onCompleted: (data) => {
      setCostOfLivingCalculator(data.costOfLivingCalculator)
      setDataState('loaded')
    },
    onError: () => {
      setDataState('error')
    },
  })

  const costOfLivingOptions = useMemo(() => {
    return [
      {
        label: formatMessage(translationStrings.individualLabel),
        options: [
          {
            label: formatMessage(translationStrings.individualChildlessLabel),
            value: '1+0',
          },
          {
            label: formatMessage(translationStrings.individualOneChildLabel),
            value: '1+1',
          },
          {
            label: formatMessage(translationStrings.individualTwoChildrenLabel),
            value: '1+2',
          },
          {
            label: formatMessage(
              translationStrings.individualThreeChildrenLabel,
            ),
            value: '1+3',
          },
          {
            label: formatMessage(
              translationStrings.individualFourChildrenLabel,
            ),
            value: '1+4',
          },
          {
            label: formatMessage(
              translationStrings.individualFiveChildrenLabel,
            ),
            value: '1+5',
          },
          {
            label: formatMessage(translationStrings.individualSixChildrenLabel),
            value: '1+6',
          },
          {
            label: formatMessage(
              translationStrings.individualSevenChildrenLabel,
            ),
            value: '1+7',
          },
          {
            label: formatMessage(
              translationStrings.individualEightChildrenLabel,
            ),
            value: '1+8',
          },
          {
            label: formatMessage(
              translationStrings.individualNineChildrenLabel,
            ),
            value: '1+9',
          },
        ],
      },
      {
        label: formatMessage(translationStrings.coupleLabel),
        options: [
          {
            label: formatMessage(translationStrings.coupleChildlessLable),
            value: '2+0',
          },
          {
            label: formatMessage(translationStrings.coupleOneChildLabel),
            value: '2+1',
          },
          {
            label: formatMessage(translationStrings.coupleTwoChildrenLable),
            value: '2+2',
          },
          {
            label: formatMessage(translationStrings.coupleThreeChildrenLable),
            value: '2+3',
          },
          {
            label: formatMessage(translationStrings.coupleFourChildrenLable),
            value: '2+4',
          },
          {
            label: formatMessage(translationStrings.coupleFiveChildrenLable),
            value: '2+5',
          },
          {
            label: formatMessage(translationStrings.coupleSixChildrenLable),
            value: '2+6',
          },
          {
            label: formatMessage(translationStrings.coupleSevenChildrenLable),
            value: '2+7',
          },
          {
            label: formatMessage(translationStrings.coupleEightChildrenLable),
            value: '2+8',
          },
          {
            label: formatMessage(translationStrings.coupleNineChildrenLable),
            value: '2+9',
          },
        ],
      },
    ]
  }, [formatMessage])

  const getSelectedValues = (option: string | undefined) => {
    if (costOfLivingCalculator) {
      for (const item of costOfLivingCalculator.items) {
        if (item.numberOf === option) {
          return item
        }
      }
      return undefined
    }
  }

  const houseRent = methods.watch('houseRent')
  const familySize = methods.watch('familySize')
  const propertyTaxes = methods.watch('propertyTaxes')
  const propertyInsurances = methods.watch('propertyInsurances')
  const schoolAndDayCare = methods.watch('schoolAndDayCare')
  const otherExpenses = methods.watch('otherExpenses')
  const familySizeData = getSelectedValues(familySize)

  const getTotal = () => {
    let total = familySizeData?.total ?? 0
    const expenses = [
      houseRent,
      propertyTaxes,
      propertyInsurances,
      schoolAndDayCare,
      otherExpenses,
    ]

    expenses.forEach((expense) => {
      if (expense) {
        total += Number(expense)
      }
    })

    return total
  }
  const selectValue = (
    value: string | undefined,
  ): PropsValue<Option<unknown>> | undefined => {
    for (const group of costOfLivingOptions) {
      for (const opt of group.options) {
        if (opt.value === value) {
          return opt
        }
      }
    }
    return undefined
  }

  return (
    <Box>
      <Box
        background="blue100"
        paddingY={[3, 3, 6]}
        paddingX={[3, 3, 3, 3, 15]}
        marginBottom={5}
      >
        {dataState === 'loading' && (
          <Box
            display="flex"
            marginTop={4}
            marginBottom={20}
            justifyContent="center"
          >
            <LoadingDots />
          </Box>
        )}
        {dataState === 'error' && (
          <AlertMessage
            title={formatMessage(translationStrings.errorTitle)}
            message={formatMessage(translationStrings.errorMessage)}
            type="error"
          />
        )}
        {dataState === 'loaded' && (
          <Stack space={5}>
            <Stack space={2}>
              <Text variant="h2">
                {formatMessage(translationStrings.costOfLivingCalculatorTitle)}
              </Text>
              <Controller
                control={control}
                name="familySize"
                defaultValue="1+0"
                render={({ field: { onChange, value } }) => (
                  <Select
                    label={formatMessage(translationStrings.familySizeLabel)}
                    options={costOfLivingOptions}
                    value={selectValue(value)}
                    size="sm"
                    isSearchable={false}
                    onChange={(option) => {
                      onChange(option?.value)
                    }}
                  />
                )}
              />
            </Stack>
            <Stack space={3}>
              <Text variant="h3">
                {formatMessage(translationStrings.preCalculatedTitle)}
              </Text>

              <CalculatedFieldWrapper
                title={formatMessage(translationStrings.foodLabel)}
                value={familySizeData?.food}
              />
              <CalculatedFieldWrapper
                title={formatMessage(translationStrings.clothesLabel)}
                value={familySizeData?.clothes}
              />
              <CalculatedFieldWrapper
                title={formatMessage(translationStrings.medicalCostLabel)}
                value={familySizeData?.medicalCost}
              />
              <CalculatedFieldWrapper
                title={formatMessage(translationStrings.hobbyLabel)}
                value={familySizeData?.hobby}
              />
              <CalculatedFieldWrapper
                title={formatMessage(translationStrings.communicationLabel)}
                value={familySizeData?.communication}
              />
              <CalculatedFieldWrapper
                title={formatMessage(translationStrings.transportLabel)}
                value={familySizeData?.transport}
              />
              <CalculatedFieldWrapper
                title={formatMessage(translationStrings.otherServicesLabel)}
                value={familySizeData?.otherServices}
              />
            </Stack>
            <Stack space={3}>
              <Box>
                <Stack space={2}>
                  <Text variant="h4">
                    {formatMessage(translationStrings.calculatorInputsTitle)}
                  </Text>
                  <Text>
                    {formatMessage(translationStrings.calculatorInputsIntro)}
                  </Text>
                </Stack>
              </Box>
              <Box>
                <Stack space={2}>
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'houseRent' as keyof CostOfLivingInput}
                    label={formatMessage(translationStrings.houseRentLabel)}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'electricity' as keyof CostOfLivingInput}
                    label={formatMessage(translationStrings.electricityLabel)}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'propertyTaxes' as keyof CostOfLivingInput}
                    label={formatMessage(translationStrings.propertyTaxesLabel)}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'propertyInsurances' as keyof CostOfLivingInput}
                    label={formatMessage(
                      translationStrings.propertyInsurancesLabel,
                    )}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'schoolAndDayCare' as keyof CostOfLivingInput}
                    label={formatMessage(
                      translationStrings.schoolAndDayCareLabel,
                    )}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'otherExpenses' as keyof CostOfLivingInput}
                    label={formatMessage(translationStrings.otherExpensesLabel)}
                  />
                </Stack>
              </Box>
            </Stack>
            <Stack space={2}>
              <Text variant="h3" fontWeight="semiBold">
                {formatMessage(translationStrings.totalText)}
              </Text>
              <Box className={styles.total}>
                <Text variant="eyebrow" fontWeight="semiBold" color="blue400">
                  {formatMessage(translationStrings.totalText)}
                </Text>
                <Box paddingLeft={2} textAlign="right">
                  <Text fontWeight="semiBold">
                    {numberFormatter.format(getTotal())}{' '}
                    {formatMessage(translationStrings.currencyText)}
                  </Text>
                </Box>
              </Box>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default UmsCostOfLivingCalculator
