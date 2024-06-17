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
import { useI18n } from '@island.is/web/i18n'
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

const UmsCostOfLivingCalculator = ({ slice }: CostOfLivingCalculatorProps) => {
  const n = useNamespace(slice.json ?? {})
  const { activeLocale } = useI18n()
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
        label: n(
          'individualLabel',
          activeLocale === 'is' ? 'Einstaklingur' : 'Individual',
        ),
        options: [
          {
            label: n(
              'individualChildlessLabel',
              activeLocale === 'is'
                ? 'Einstaklingur, barnlaus'
                : 'Individual, childless',
            ),
            value: '1+0',
          },
          {
            label: n(
              'individualOneChildLabel',
              activeLocale === 'is'
                ? 'Einstaklingur með 1 barn'
                : 'Individual with 1 child',
            ),
            value: '1+1',
          },
          {
            label: n(
              'individualTwoChildrenLabel',
              activeLocale === 'is'
                ? 'Einstaklingur með 2 börn'
                : 'Individual with 2 children',
            ),
            value: '1+2',
          },
          {
            label: n(
              'individualThreeChildrenLabel',
              activeLocale === 'is'
                ? 'Einstaklingur með 3 börn'
                : 'Individual with 3 children',
            ),
            value: '1+3',
          },
          {
            label: n(
              'individualFourChildrenLabel',
              activeLocale === 'is'
                ? 'Einstaklingur með 4 börn'
                : 'Individual with 4 children',
            ),
            value: '1+4',
          },
          {
            label: n(
              'individualFiveChildrenLabel',
              activeLocale === 'is'
                ? 'Einstaklingur með 5 börn'
                : 'Individual with 5 children',
            ),
            value: '1+5',
          },
          {
            label: n(
              'individualSixChildrenLabel',
              activeLocale === 'is'
                ? 'Einstaklingur með 6 börn'
                : 'Individual with 6 children',
            ),
            value: '1+6',
          },
          {
            label: n(
              'individualSevenChildrenLabel',
              activeLocale === 'is'
                ? 'Einstaklingur með 7 börn'
                : 'Individual with 7 children',
            ),
            value: '1+7',
          },
          {
            label: n(
              'individualEightChildrenLabel',
              activeLocale === 'is'
                ? 'Einstaklingur með 8 börn'
                : 'Individual with 8 children',
            ),
            value: '1+8',
          },
          {
            label: n(
              'individualNineChildrenLabel',
              activeLocale === 'is'
                ? 'Einstaklingur með 9 börn'
                : 'Individual with 9 children',
            ),
            value: '1+9',
          },
        ],
      },
      {
        label: n('coupleLabel', activeLocale === 'is' ? 'Hjón' : 'Couple'),
        options: [
          {
            label: n(
              'coupleChildlessLable',
              activeLocale === 'is' ? 'Hjón, barnlaus' : 'Couple, childless',
            ),
            value: '2+0',
          },
          {
            label: n(
              'coupleOneChildLabel',
              activeLocale === 'is' ? 'Hjón með 1 barn' : 'Couple with 1 child',
            ),
            value: '2+1',
          },
          {
            label: n(
              'coupleTwoChildrenLable',
              activeLocale === 'is'
                ? 'Hjón með 2 börn'
                : 'Couple with 2 children',
            ),
            value: '2+2',
          },
          {
            label: n(
              'coupleThreeChildrenLable',
              activeLocale === 'is'
                ? 'Hjón með 3 börn'
                : 'Couple with 3 children',
            ),
            value: '2+3',
          },
          {
            label: n(
              'coupleFourChildrenLable',
              activeLocale === 'is'
                ? 'Hjón með 4 börn'
                : 'Couple with 4 children',
            ),
            value: '2+4',
          },
          {
            label: n(
              'coupleFiveChildrenLable',
              activeLocale === 'is'
                ? 'Hjón með 5 börn'
                : 'Couple with 5 children',
            ),
            value: '2+5',
          },
          {
            label: n(
              'coupleSixChildrenLable',
              activeLocale === 'is'
                ? 'Hjón með 6 barn'
                : 'Couple with 6 children',
            ),
            value: '2+6',
          },
          {
            label: n(
              'coupleSevenChildrenLable',
              activeLocale === 'is'
                ? 'Hjón með 7 börn'
                : 'Couple with 7 children',
            ),
            value: '2+7',
          },
          {
            label: n(
              'coupleEightChildrenLable',
              activeLocale === 'is'
                ? 'Hjón með 8 börn'
                : 'Couple with 8 children',
            ),
            value: '2+8',
          },
          {
            label: n(
              'coupleNineChildrenLable',
              activeLocale === 'is'
                ? 'Hjón með 9 börn'
                : 'Couple with 9 children',
            ),
            value: '2+9',
          },
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
            title={n('errorTitle', 'Villa')}
            message={n(
              'errorMessage',
              activeLocale === 'is'
                ? 'Ekki tókst að sækja gögn fyrir framfærslu reiknivél.'
                : 'Failed to retieve data for cost of living calculator',
            )}
            type="error"
          />
        )}
        {dataState === 'loaded' && (
          <Stack space={5}>
            <Stack space={2}>
              <Text variant="h2">
                {n(
                  'costOfLivingCalculatorTitle',
                  activeLocale === 'is' ? 'Fjölskyldustærð' : 'Family size',
                )}
              </Text>
              <Controller
                control={control}
                name="familySize"
                defaultValue="1+0"
                render={({ field: { onChange, value } }) => (
                  <Select
                    label={n(
                      'familySizeLabel',
                      activeLocale === 'is' ? 'Fjölskyldustærð' : 'Family size',
                    )}
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
                  activeLocale === 'is'
                    ? 'Framfærsluviðmið umboðsmanns skuldara'
                    : 'Subsistence criteria',
                )}
              </Text>

              <CalculatedFieldWrapper
                title={n(
                  'foodLabel',
                  activeLocale === 'is'
                    ? 'Matur, hreinlætisvörur og heimilisbúnaður'
                    : 'Food, hygiene products and household equipment',
                )}
                value={familySizeData?.food}
              />
              <CalculatedFieldWrapper
                title={n(
                  'clothesLabel',
                  activeLocale === 'is' ? 'Föt og skór' : 'Clothes and shoes',
                )}
                value={familySizeData?.clothes}
              />
              <CalculatedFieldWrapper
                title={n(
                  'medicalCostLabel',
                  activeLocale === 'is'
                    ? 'Læknis- og lyfjakostnaður'
                    : 'Medical and pharmaceutical costs',
                )}
                value={familySizeData?.medicalCost}
              />
              <CalculatedFieldWrapper
                title={n(
                  'hobbyLabel',
                  activeLocale === 'is' ? 'Tómstundir' : 'Hobby',
                )}
                value={familySizeData?.hobby}
              />
              <CalculatedFieldWrapper
                title={n(
                  'communicationLabel',
                  activeLocale === 'is'
                    ? 'Samskiptakostnaður'
                    : 'Communication expenses',
                )}
                value={familySizeData?.communication}
              />
              <CalculatedFieldWrapper
                title={n(
                  'transportLabel',
                  activeLocale === 'is' ? 'Samgöngur' : 'Transport',
                )}
                value={familySizeData?.transport}
              />
              <CalculatedFieldWrapper
                title={n(
                  'otherServicesLabel',
                  activeLocale === 'is'
                    ? 'Önnur þjónusta fyrir heimili'
                    : 'Other household expenses',
                )}
                value={familySizeData?.otherServices}
              />
            </Stack>
            <Stack space={3}>
              <Box>
                <Stack space={2}>
                  <Text variant="h4">
                    {n(
                      'calculatorInputsTitle',
                      activeLocale === 'is'
                        ? 'Önnur mánaðarleg útgjöld'
                        : 'Other monthly expenses',
                    )}
                  </Text>
                  <Text>
                    {n(
                      'calculatorInputsIntro',
                      activeLocale === 'is'
                        ? 'Fyrir önnur útgjöld notar umboðsmaður skuldara ekki viðmið, heldur tekur mið af raunútgjöldum hverrar fjölskyldu'
                        : 'For other expenses, the debtor`s representative does not use criteria, but takes into account the actual expenses of each family',
                    )}
                  </Text>
                </Stack>
              </Box>
              <Box>
                <Stack space={2}>
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'houseRent' as keyof CostOfLivingInput}
                    label={n(
                      'houseRentLabel',
                      activeLocale === 'is' ? 'Húsaleiga' : 'House rent',
                    )}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'electricity' as keyof CostOfLivingInput}
                    label={n(
                      'electricityLabel',
                      activeLocale === 'is'
                        ? 'Rafmagn, hiti og hússjóður'
                        : 'Electricity, house heating and housing fund ',
                    )}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'propertyTaxes' as keyof CostOfLivingInput}
                    label={n(
                      'propertyTaxesLabel',
                      activeLocale === 'is'
                        ? 'Fasteigna-/vatns-/frv.gjöld'
                        : 'Property taxes',
                    )}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'propertyInsurances' as keyof CostOfLivingInput}
                    label={n(
                      'propertyInsurancesLabel',
                      activeLocale === 'is'
                        ? 'Tryggingar, aðrar en bílatryggingar'
                        : 'Insurances, other than car insurance',
                    )}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'schoolAndDayCare' as keyof CostOfLivingInput}
                    label={n(
                      'schoolAndDayCareLabel',
                      activeLocale === 'is'
                        ? 'Skóli og dagvistun'
                        : 'School and day care',
                    )}
                  />
                  <InputControllerFieldWrapper
                    control={control}
                    nameAndId={'otherExpenses' as keyof CostOfLivingInput}
                    label={n(
                      'otherExpensesLabel',
                      activeLocale === 'is'
                        ? 'Önnur útgjöld'
                        : 'Other expenses',
                    )}
                  />
                </Stack>
              </Box>
            </Stack>

            <Text variant="default" fontWeight="semiBold">
              {n('totalText', activeLocale === 'is' ? 'Samtals' : 'Total')}
              {': '}
              {numberFormatter.format(getTotal())}{' '}
              {n('currencyText', activeLocale === 'is' ? 'krónur' : 'ISK')}
            </Text>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default UmsCostOfLivingCalculator
