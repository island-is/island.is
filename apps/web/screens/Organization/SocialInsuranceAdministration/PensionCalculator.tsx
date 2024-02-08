import { useMemo, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import add from 'date-fns/add'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Option,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { sortAlpha } from '@island.is/shared/utils'
import { getThemeConfig } from '@island.is/web/components'
import {
  Organization,
  OrganizationPage,
  Query,
  QueryGetOrganizationArgs,
  QueryGetOrganizationPageArgs,
  SocialInsurancePensionCalculationBasePensionType as BasePensionType,
  SocialInsurancePensionCalculationInput as CalculationInput,
  SocialInsurancePensionCalculationLivingCondition as LivingCondition,
  SocialInsurancePensionCalculationPeriodIncomeType as PeriodIncomeType,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import { Screen } from '../../../types'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'
import {
  convertQueryParametersToCalculationInput,
  convertToQueryParams,
} from './utils'
import * as styles from './PensionCalculator.css'

interface PensionCalculatorProps {
  organizationPage: OrganizationPage
  organization: Organization
  defaultValues: CalculationInput
}

const PensionCalculator: Screen<PensionCalculatorProps> = ({
  organizationPage,
  organization,
  defaultValues,
}) => {
  const methods = useForm<CalculationInput>({
    defaultValues,
  })
  const defaultPensionAge = 67 // TODO: add to namespace
  const maxMonthPensionDelay = 156 // TODO: add to namespace

  const [loadingResultPage, setLoadingResultPage] = useState(false)
  const [hasLivedAbroad, setHasLivedAbroad] = useState(false)
  const [birthdate, setBirthdate] = useState<string>()
  const [basePensionType, setBasePensionType] = useState<BasePensionType>(
    BasePensionType.Retirement,
  )

  const maxMonthPensionHurry =
    basePensionType === BasePensionType.Retirement ? 12 * 7 : 12 * 2 // TODO: add to namespace

  const basePensionTypeOptions = useMemo<Option<BasePensionType>[]>(() => {
    const options = [
      {
        label: 'Ellilífeyrir',
        value: BasePensionType.Retirement,
      },
      {
        label: 'Ellilífeyrir sjómanna',
        value: BasePensionType.FishermanRetirement,
      },
      {
        label: 'Örorkulífeyrir',
        value: BasePensionType.Disability,
      },
      {
        label: 'Endurhæfingarlífeyrir',
        value: BasePensionType.Rehabilitation,
      },
      {
        label: 'Hálfur ellilífeyrir',
        value: BasePensionType.HalfRetirement,
      },
    ]
    options.sort(sortAlpha('label'))
    return options
  }, [])

  const hasSpouseOptions = useMemo<Option<boolean>[]>(() => {
    return [
      {
        label: 'Á ekki maka',
        value: false,
      },
      { label: 'Á maka', value: true },
    ]
  }, [])

  const livingConditionOptions = useMemo<Option<LivingCondition>[]>(() => {
    return [
      {
        label: 'Bý ein(n)',
        value: LivingCondition.LivesAlone,
      },
      {
        label: 'Bý ekki ein(n)',
        value: LivingCondition.DoesNotLiveAlone,
      },
    ]
  }, [])

  const childCountOptions = useMemo<Option<number>[]>(() => {
    return [
      {
        label: 'Ekkert barn',
        value: 0,
      },
      {
        label: '1 barn',
        value: 1,
      },
      {
        label: '2 börn',
        value: 2,
      },
      {
        label: '3 börn',
        value: 3,
      },
      {
        label: '4 börn',
        value: 4,
      },
      {
        label: '5 börn',
        value: 5,
      },
      {
        label: '6 börn',
        value: 6,
      },
      {
        label: '7 börn',
        value: 7,
      },
      {
        label: '8 börn',
        value: 8,
      },
      {
        label: '9 börn',
        value: 9,
      },
    ]
  }, [])

  const childSupportCountOptions = useMemo<Option<number>[]>(() => {
    return [
      {
        label: 'Engu barni',
        value: 0,
      },
      {
        label: '1 barn',
        value: 1,
      },
      {
        label: '2 börn',
        value: 2,
      },
      {
        label: '3 börn',
        value: 3,
      },
      {
        label: '4 börn',
        value: 4,
      },
      {
        label: '5 börn',
        value: 5,
      },
      {
        label: '6 börn',
        value: 6,
      },
      {
        label: '7 börn',
        value: 7,
      },
      {
        label: '8 börn',
        value: 8,
      },
      {
        label: '9 börn',
        value: 9,
      },
    ]
  }, [])

  const dateOfCalculationsOptions = useMemo<Option<Date>[]>(() => {
    return [
      {
        label: '2024',
        value: new Date(2024, 2, 1),
      },
      {
        label: '2023 (júl-des)',
        value: new Date(2023, 7, 1),
      },
      {
        label: '2023 (jan-jún)',
        value: new Date(2023, 2, 1),
      },
      {
        label: '2022 (jún-des)',
        value: new Date(2022, 7, 1),
      },
      {
        label: '2022 (jan-maí)',
        value: new Date(2022, 2, 1),
      },
      {
        label: '2021',
        value: new Date(2021, 2, 1),
      },
      {
        label: '2020',
        value: new Date(2020, 2, 1),
      },
      {
        label: '2019',
        value: new Date(2019, 2, 1),
      },
      {
        label: '2018',
        value: new Date(2018, 2, 1),
      },
      {
        label: '2017',
        value: new Date(2017, 2, 1),
      },
      {
        label: '2016',
        value: new Date(2016, 2, 1),
      },
      {
        label: '2015',
        value: new Date(2015, 2, 1),
      },
    ]
  }, [])

  const [dateOfCalculations, setDateOfCalculations] = useState(
    dateOfCalculationsOptions[0].value,
  )

  const { linkResolver } = useLinkResolver()

  const router = useRouter()

  const onSubmit = (data: CalculationInput) => {
    const baseUrl = linkResolver('pensioncalculatorresults').href
    const queryParams = convertToQueryParams(data)
    setLoadingResultPage(true)
    router.push(`${baseUrl}?${queryParams.toString()}`)
  }

  const { activeLocale } = useI18n()

  const birthdateRange = {
    minDate: add(dateOfCalculations, { years: -130 }),
    maxDate: dateOfCalculations, // TODO: what should this be?
  }

  const startDateRange = !birthdate
    ? birthdateRange
    : {
        minDate: add(add(new Date(birthdate), { years: defaultPensionAge }), {
          months: -maxMonthPensionHurry,
        }),
        maxDate: add(add(new Date(birthdate), { years: defaultPensionAge }), {
          months: maxMonthPensionDelay, // Perhaps reconsider this date here?
        }),
      }

  const title = `Reiknivél lífeyris ${dateOfCalculations.getFullYear()}`

  return (
    <PensionCalculatorWrapper
      organizationPage={organizationPage}
      organization={organization}
      ogTitle={title}
      ogImageUrl={organizationPage.featuredImage?.url}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack space={3}>
            <GridContainer>
              <GridRow>
                <GridColumn
                  offset={['0', '0', '0', '1/9']}
                  className={styles.fullWidth}
                >
                  <Stack space={3}>
                    <Box
                      paddingTop={6}
                      columnGap={3}
                      rowGap={3}
                      display="flex"
                      flexDirection="row"
                      justifyContent="spaceBetween"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Stack space={3}>
                        <Text variant="h1" as="h1">
                          {title}
                        </Text>
                        <Box className={styles.textMaxWidth}>
                          <Text>
                            Vinsamlegast athugið að reiknivélin gefur ekki
                            bindandi niðurstöður
                          </Text>
                        </Box>
                      </Stack>
                      <Box className={styles.yearSelectContainer}>
                        <SelectController
                          id={'dateOfCalculations' as keyof CalculationInput}
                          name={'dateOfCalculations' as keyof CalculationInput}
                          label="Reiknivélar síðustu ára"
                          placeholder="Veldu ár"
                          size="sm"
                          options={dateOfCalculationsOptions}
                          onSelect={(option) => {
                            if (option) {
                              setDateOfCalculations(option.value)
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <Box className={styles.inputContainer}>
                      <SelectController
                        id={'typeOfBasePension' as keyof CalculationInput}
                        name={'typeOfBasePension' as keyof CalculationInput}
                        label="Tegund lífeyris"
                        options={basePensionTypeOptions}
                        defaultValue={BasePensionType.Retirement}
                        onSelect={(option) => {
                          if (option) {
                            setBasePensionType(option.value)
                          }
                        }}
                      />
                    </Box>
                  </Stack>
                </GridColumn>
              </GridRow>
            </GridContainer>

            <Box paddingY={5} background="blue100">
              <GridContainer>
                <GridRow>
                  <GridColumn offset={['0', '0', '0', '1/9']}>
                    <Stack space={3}>
                      <Box className={styles.inputContainer}>
                        <DatePickerController
                          id={'birthdate' as keyof CalculationInput}
                          name={'birthdate' as keyof CalculationInput}
                          label="Fæðingardagur"
                          placeholder="Veldu fæðingardag"
                          locale={activeLocale}
                          minDate={birthdateRange.minDate}
                          maxDate={birthdateRange.maxDate}
                          minYear={birthdateRange.minDate.getFullYear()}
                          maxYear={birthdateRange.maxDate.getFullYear()}
                          onChange={setBirthdate}
                        />
                      </Box>

                      <Text variant="h2" as="h2">
                        Upphaf greiðslna
                      </Text>
                      <Box className={styles.inputContainer}>
                        <DatePickerController
                          id={'startDate' as keyof CalculationInput}
                          name={'startDate' as keyof CalculationInput}
                          label="Hvenær viltu hefja töku á ellilífeyri"
                          placeholder="Veldu dagsetningu"
                          locale={activeLocale}
                          minDate={startDateRange.minDate}
                          maxDate={startDateRange.maxDate}
                          minYear={startDateRange.minDate.getFullYear()}
                          maxYear={startDateRange.maxDate.getFullYear()}
                          disabled={
                            !birthdate &&
                            !methods.formState.defaultValues?.birthdate
                          }
                        />
                      </Box>

                      <Text variant="h2" as="h2">
                        Þínar aðstæður
                      </Text>

                      <Box className={styles.inputContainer}>
                        <SelectController
                          id={'hasSpouse' as keyof CalculationInput}
                          name={'hasSpouse' as keyof CalculationInput}
                          label="Hjúskaparstaða"
                          placeholder="Veldu hjúskaparstöðu"
                          options={hasSpouseOptions}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <SelectController
                          id={'livingCondition' as keyof CalculationInput}
                          name={'livingCondition' as keyof CalculationInput}
                          label="Heimilisaðstæður"
                          placeholder="Heimilisaðstæður"
                          options={livingConditionOptions}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <SelectController
                          id={'childCount' as keyof CalculationInput}
                          name={'childCount' as keyof CalculationInput}
                          label="Börn yngri en 18 ára"
                          placeholder="Veldu fjölda barna"
                          options={childCountOptions}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <SelectController
                          id={'childSupportCount' as keyof CalculationInput}
                          name={'childSupportCount' as keyof CalculationInput}
                          label="Fær meðlag greitt með"
                          placeholder="Veldu fjölda barna"
                          options={childSupportCountOptions}
                        />
                      </Box>

                      {(basePensionType === BasePensionType.Disability ||
                        basePensionType === BasePensionType.Rehabilitation) && (
                        <Box className={styles.inputContainer}>
                          <InputController
                            id={
                              'ageOfFirst75DisabilityAssessment' as keyof CalculationInput
                            }
                            name={
                              'ageOfFirst75DisabilityAssessment' as keyof CalculationInput
                            }
                            label="Fyrsta 75% örorkumat"
                            suffix=" ára"
                            type="number"
                          />
                        </Box>
                      )}

                      <Stack space={2}>
                        <Text>Með hreyfihömlunarmat</Text>
                        <Box className={styles.inputContainer}>
                          <Controller
                            name={
                              'mobilityImpairment' as keyof CalculationInput
                            }
                            defaultValue={false}
                            render={({ field: { value, onChange } }) => (
                              <Inline space={3}>
                                <RadioButton
                                  id="mobilityImpairmentNo"
                                  checked={value === false}
                                  onChange={() => {
                                    onChange(false)
                                  }}
                                  label={'Nei'}
                                />
                                <RadioButton
                                  id="mobilityImpairmentYes"
                                  checked={value === true}
                                  onChange={() => {
                                    onChange(true)
                                  }}
                                  label={'Já'}
                                />
                              </Inline>
                            )}
                          />
                        </Box>
                      </Stack>

                      <Stack space={2}>
                        <Text>Hefur búið erlendis</Text>
                        <Box className={styles.inputContainer}>
                          <Controller
                            name={'hasLivedAbroad' as keyof CalculationInput}
                            defaultValue={false}
                            render={({ field: { value, onChange } }) => (
                              <Inline space={3}>
                                <RadioButton
                                  id="hasLivedAbroadNo"
                                  checked={value === false}
                                  onChange={() => {
                                    onChange(false)
                                    setHasLivedAbroad(false)
                                  }}
                                  label={'Nei'}
                                />
                                <RadioButton
                                  id="hasLivedAbroadYes"
                                  checked={value === true}
                                  onChange={() => {
                                    onChange(true)
                                    setHasLivedAbroad(true)
                                  }}
                                  label={'Já'}
                                />
                              </Inline>
                            )}
                          />
                        </Box>

                        {hasLivedAbroad && (
                          <Box className={styles.inputContainer}>
                            <InputController
                              id={
                                'livingConditionAbroadInYears' as keyof CalculationInput
                              }
                              name={
                                'livingConditionAbroadInYears' as keyof CalculationInput
                              }
                              label="Fjöldi ára erlendrar búsetu frá 16 til 67 ára"
                              placeholder="0 ár"
                              type="number"
                              suffix=" ár"
                            />
                          </Box>
                        )}
                      </Stack>

                      <Text variant="h2" as="h2">
                        Tekjur
                      </Text>

                      <Text variant="h3" as="h3">
                        Tekjur fyrir skatt
                      </Text>

                      <Box className={styles.inputContainer}>
                        <Controller
                          name={'typeOfPeriodIncome' as keyof CalculationInput}
                          defaultValue={PeriodIncomeType.Month}
                          render={({ field: { value, onChange } }) => (
                            <GridRow rowGap={3}>
                              <GridColumn span={['1/1', '1/2']}>
                                <RadioButton
                                  id="typeOfPeriodIncomeMonth"
                                  checked={value === PeriodIncomeType.Month}
                                  onChange={() => {
                                    onChange(PeriodIncomeType.Month)
                                  }}
                                  label={'Mánaðartekjur'}
                                />
                              </GridColumn>
                              <GridColumn span={['1/1', '1/2']}>
                                <RadioButton
                                  id="typeOfPeriodIncomeYear"
                                  checked={value === PeriodIncomeType.Year}
                                  onChange={() => {
                                    onChange(PeriodIncomeType.Year)
                                  }}
                                  label={'Árstekjur'}
                                />
                              </GridColumn>
                            </GridRow>
                          )}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'taxCard' as keyof CalculationInput}
                          name={'taxCard' as keyof CalculationInput}
                          label="Hlutfall skattkorts hjá TR"
                          required={true}
                          placeholder="%"
                          type="number"
                          suffix="%"
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'income' as keyof CalculationInput}
                          name={'income' as keyof CalculationInput}
                          label="Tekjur m.a. af atvinnu, eftirlaunum og atvinnuleysisbótum"
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>
                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'pensionPayments' as keyof CalculationInput}
                          name={'pensionPayments' as keyof CalculationInput}
                          label="Greiðslur frá lífeyrissjóðum"
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={
                            'privatePensionPayments' as keyof CalculationInput
                          }
                          name={
                            'privatePensionPayments' as keyof CalculationInput
                          }
                          label="Greiðslur viðbótarlífeyrissparnaðar"
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'otherIncome' as keyof CalculationInput}
                          name={'otherIncome' as keyof CalculationInput}
                          label="Aðrar tekjur"
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'capitalIncome' as keyof CalculationInput}
                          name={'capitalIncome' as keyof CalculationInput}
                          label="Fjármagnstekjur"
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={
                            'benefitsFromMunicipality' as keyof CalculationInput
                          }
                          name={
                            'benefitsFromMunicipality' as keyof CalculationInput
                          }
                          label="Skattskyldar bætur sveitarfélaga"
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'premium' as keyof CalculationInput}
                          name={'premium' as keyof CalculationInput}
                          label="Frádregin iðgjöld í lífeyrissjóði"
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'foreignBasicPension' as keyof CalculationInput}
                          name={'foreignBasicPension' as keyof CalculationInput}
                          label="Erlendur grunnlífeyrir"
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Button loading={loadingResultPage} type="submit">
                        Reikna niðurstöður
                      </Button>
                    </Stack>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
          </Stack>
        </form>
      </FormProvider>
    </PensionCalculatorWrapper>
  )
}

PensionCalculator.getProps = async ({ apolloClient, locale, query }) => {
  const slug =
    locale === 'is' ? 'tryggingastofnun' : 'social-insurance-administration'

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug,
          lang: locale,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug,
          lang: locale,
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: ${slug} was not found`,
    )
  }

  if (!getOrganization) {
    throw new CustomNextError(
      404,
      `Organization with slug: ${slug} was not found`,
    )
  }

  const defaultValues = convertQueryParametersToCalculationInput(query)

  return {
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    defaultValues,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(PensionCalculator)
