import { useMemo, useState } from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
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
import { ConnectedComponent, Query } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { GET_UMS_COST_OF_LIVING_CALCULATOR } from '@island.is/web/screens/queries/UmsCostOfLivingCalculator'

interface CalculatedFieldWrapperProps {
  title: string
  value: number | undefined
}

interface InputControllerFieldWrapperProps {
  control: Control<CostOfLivingInput>
  nameAndId: string
  label: string
}

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
      <Text variant="eyebrow" fontWeight="semiBold">
        {title}
      </Text>
      <Box paddingLeft={2}>
        <Text fontWeight="semiBold">{numberFormatter.format(value ?? 0)}</Text>
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

interface CostOfLivingCalculatorProps {
  slice: ConnectedComponent
}

type DataState = 'loading' | 'loaded' | 'error'

const numberFormatter = new Intl.NumberFormat('de-DE')

const UmsCostOfLivingCalculator = ({ slice }: CostOfLivingCalculatorProps) => {
  const n = useNamespace(slice.json ?? {})
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
        label: 'Einstaklingur',
        options: [
          { label: 'Einstaklingur, barnlaus', value: '1+0' },
          { label: 'Einstaklingur með 1 barn', value: '1+1' },
          { label: 'Einstaklingur með 2 börn', value: '1+2' },
          { label: 'Einstaklingur með 3 börn', value: '1+3' },
          { label: 'Einstaklingur með 4 börn', value: '1+4' },
          { label: 'Einstaklingur með 5 börn', value: '1+5' },
          { label: 'Einstaklingur með 6 börn', value: '1+6' },
          { label: 'Einstaklingur með 7 börn', value: '1+7' },
          { label: 'Einstaklingur með 8 börn', value: '1+8' },
          { label: 'Einstaklingur með 9 börn', value: '1+9' },
        ],
      },
      {
        label: 'Hjón',
        options: [
          { label: 'Hjón, barnlaus', value: '2+0' },
          { label: 'Hjón með 1 barn', value: '2+1' },
          { label: 'Hjón með 2 börn', value: '2+2' },
          { label: 'Hjón með 3 börn', value: '2+3' },
          { label: 'Hjón með 4 börn', value: '2+4' },
          { label: 'Hjón með 5 börn', value: '2+5' },
          { label: 'Hjón með 6 barn', value: '2+6' },
          { label: 'Hjón með 7 börn', value: '2+7' },
          { label: 'Hjón með 8 börn', value: '2+8' },
          { label: 'Hjón með 9 börn', value: '2+9' },
        ],
      },
    ]
  }, [])

  const getSelectedValues = (option: string | undefined) => {
    if (costOfLivingCalculator) {
      for (const item of costOfLivingCalculator.items) {
        if (item.numberOf === option) {
          return item
        }
      }
      return undefined
    } else {
      return undefined
    }
  }

  const houseRent = methods.watch('houseRent')
  const familySize = methods.watch('familySize')
  const propertyTaxes = methods.watch('propertyTaxes')
  const propertyInsurances = methods.watch('propertyInsurances')
  const schoolAndDayCare = methods.watch('schoolAndDayCare')
  const otherExpenses = methods.watch('otherExpenses')

  const getTotal = () => {
    let total = getSelectedValues(familySize)?.total ?? 0
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
            title={n('errorTitle', 'Villa')}
            message={n(
              'errorMessage',
              'Ekki tókst að sækja gögn fyrir framfærslu reiknivél.',
            )}
            type="error"
          />
        )}
        {dataState === 'loaded' && (
          <Stack space={5}>
            <Stack space={2}>
              <Text variant="h2">
                {n('costOfLivingCalculatorTitle', 'Fjölskyldustærð')}
              </Text>
              <Controller
                control={control}
                name="familySize"
                defaultValue={'1+0'}
                render={({ field: { onChange, value } }) => (
                  <Select
                    label={n('familySizeLabel', 'Fjölskyldustærð')}
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
                {n(
                  'preCalculatedTitle',
                  'Framfærsluviðmið umboðsmanns skuldara',
                )}
              </Text>

              <CalculatedFieldWrapper
                title={n(
                  'foodLabel',
                  'Matur, hreinlætisvörur og heimilisbúnaður',
                )}
                value={getSelectedValues(familySize)?.food}
              />
              <CalculatedFieldWrapper
                title={n('clothesLabel', 'Föt og skór')}
                value={getSelectedValues(familySize)?.clothes}
              />
              <CalculatedFieldWrapper
                title={n('medicalCostLabel', 'Læknis- og lyfjakostnaður')}
                value={getSelectedValues(familySize)?.medicalCost}
              />
              <CalculatedFieldWrapper
                title={n('hobbyLabel', 'Tómstundir')}
                value={getSelectedValues(familySize)?.hobby}
              />
              <CalculatedFieldWrapper
                title={n('communicationLabel', 'Samskiptakostnaður')}
                value={getSelectedValues(familySize)?.communication}
              />
              <CalculatedFieldWrapper
                title={n('transportLabel', 'Samgöngur')}
                value={getSelectedValues(familySize)?.transport}
              />
              <CalculatedFieldWrapper
                title={n('otherServicesLabel', 'Önnur þjónusta fyrir heimili')}
                value={getSelectedValues(familySize)?.otherServices}
              />
            </Stack>
            <Stack space={3}>
              <Box>
                <Stack space={2}>
                  <Text variant="h4">
                    {n('calculatorInputsTitle', 'Önnur mánaðarleg útgjöld')}
                  </Text>
                  <Text>
                    {n(
                      'calculatorInputsIntro',
                      'Fyrir önnur útgjöld notar umboðsmaður skuldara ekki viðmið, heldur tekur mið af raunútgjöldum hverrar fjölskyldu',
                    )}
                  </Text>
                </Stack>
              </Box>
              <Box>
                <Stack space={2}>
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'houseRent' as keyof CostOfLivingInput}
                    label={n('houseRentLabel', 'Húsaleiga')}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'electricity' as keyof CostOfLivingInput}
                    label={n('electricityLabel', 'Rafmagn, hiti og hússjóður')}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'propertyTaxes' as keyof CostOfLivingInput}
                    label={n(
                      'propertyTaxesLabel',
                      'Fasteigna-/vatns-/frv.gjöld',
                    )}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'propertyInsurances' as keyof CostOfLivingInput}
                    label={n(
                      'propertyInsurancesLabel',
                      'Tryggingar, aðrar en bílatryggingar',
                    )}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'schoolAndDayCare' as keyof CostOfLivingInput}
                    label={n('schoolAndDayCareLabel', 'Skóli og dagvistun')}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'otherExpenses' as keyof CostOfLivingInput}
                    label={n('otherExpensesLabel', 'Önnur útgjöld')}
                  />
                </Stack>
              </Box>
            </Stack>

            <Text variant="default" fontWeight="semiBold">
              {'Samtals: '}
              {numberFormatter.format(getTotal())}
              {' krónur'}
            </Text>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default UmsCostOfLivingCalculator
