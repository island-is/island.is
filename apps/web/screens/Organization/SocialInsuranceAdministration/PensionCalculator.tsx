import { useMemo, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import add from 'date-fns/add'
import differenceInMonths from 'date-fns/differenceInMonths'
import { useRouter } from 'next/router'
import { useQueryState } from 'next-usequerystate'

import { CustomPageUniqueIdentifier } from '@island.is/api/schema'
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
  CustomPage,
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

import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import {
  CustomScreen,
  withCustomPageWrapper,
} from './CustomPage/CustomPageWrapper'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'
import { pensionCalculatorStrings } from './strings'
import {
  convertQueryParametersToCalculationInput,
  convertToQueryParams,
} from './utils'
import * as styles from './PensionCalculator.css'

interface PensionCalculatorProps {
  organizationPage: OrganizationPage
  organization: Organization
  defaultValues: CalculationInput
  dateOfCalculationsOptions: Option<string>[]
  customPageData?: CustomPage | null
}

const PensionCalculator: CustomScreen<PensionCalculatorProps> = ({
  organizationPage,
  organization,
  defaultValues,
  dateOfCalculationsOptions,
  customPageData,
}) => {
  const defaultPensionAge = customPageData?.configJson?.defaultPensionAge ?? 67

  const methods = useForm<CalculationInput>({
    defaultValues,
  })
  const maxMonthPensionDelay = 156 // TODO: add to namespace

  const [loadingResultPage, setLoadingResultPage] = useState(false)
  const [hasLivedAbroad, setHasLivedAbroad] = useState(
    methods.formState.defaultValues?.livingConditionAbroadInYears
      ? true
      : false,
  )
  const [birthdate, setBirthdate] = useState(defaultValues.birthdate)
  const [startDate, setStartDate] = useState(defaultValues.startDate)
  const [basePensionType, setBasePensionType] = useState<BasePensionType>(
    defaultValues.typeOfBasePension || BasePensionType.Retirement,
  )
  const [childCount, setChildCount] = useState<number | undefined | null>(
    methods.formState.defaultValues?.childCount,
  )

  const maxMonthPensionHurry =
    basePensionType === BasePensionType.FishermanRetirement ? 12 * 7 : 12 * 2 // TODO: add to namespace

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
      {
        label: 'Á maka',
        value: true,
      },
    ]
  }, [])

  const livingConditionOptions = useMemo<Option<LivingCondition>[]>(() => {
    return [
      {
        label: 'Býr ein(n)',
        value: LivingCondition.LivesAlone,
      },
      {
        label: 'Býr ekki ein(n)',
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
    const options = [
      {
        label: 'Engu barni',
        value: 0,
      },
      {
        label: '1 barni',
        value: 1,
      },
      {
        label: '2 börnum',
        value: 2,
      },
      {
        label: '3 börnum',
        value: 3,
      },
      {
        label: '4 börnum',
        value: 4,
      },
      {
        label: '5 börnum',
        value: 5,
      },
      {
        label: '6 börnum',
        value: 6,
      },
      {
        label: '7 börnum',
        value: 7,
      },
      {
        label: '8 börnum',
        value: 8,
      },
      {
        label: '9 börnum',
        value: 9,
      },
    ]

    if (typeof childCount === 'number') {
      return options.slice(0, childCount + 1)
    }
    return []
  }, [childCount])

  const [dateOfCalculations, setDateOfCalculations] = useQueryState(
    'dateOfCalculations',
    {
      defaultValue:
        methods.formState.defaultValues?.dateOfCalculations ??
        dateOfCalculationsOptions[0].value,
    },
  )

  const { linkResolver } = useLinkResolver()

  const router = useRouter()

  const onSubmit = (data: CalculationInput) => {
    const baseUrl = linkResolver('pensioncalculatorresults').href
    const queryParams = convertToQueryParams({
      ...data,
      dateOfCalculations: data.dateOfCalculations
        ? data.dateOfCalculations
        : dateOfCalculationsOptions[0].value,
    })
    setLoadingResultPage(true)
    router.push(`${baseUrl}?${queryParams.toString()}`)
  }

  const { activeLocale } = useI18n()

  const birthdateRange = {
    minDate: add(new Date(), { years: -130 }),
    maxDate: new Date(), // TODO: what should this be?
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

  const title = `Reiknivél lífeyris ${
    dateOfCalculationsOptions.find((o) => o.value === dateOfCalculations)
      ?.label ?? dateOfCalculationsOptions[0].label
  }`

  const defaultPensionDate = birthdate
    ? add(new Date(birthdate), {
        years: defaultPensionAge,
      })
    : null

  const monthOffset =
    defaultPensionDate && startDate
      ? differenceInMonths(new Date(startDate), defaultPensionDate)
      : undefined

  // const n = useTranslationNamespace(
  //   customPageData?.translationStrings,
  //   pensionCalculatorStrings,
  // )

  // n(pensionCalculatorStrings.pensionStartMonthIsDefault)

  console.log(customPageData)
  const { formatMessage } = useIntl()
  return (
    <PensionCalculatorWrapper
      organizationPage={organizationPage}
      organization={organization}
      ogTitle={title}
      ogImageUrl={organizationPage.featuredImage?.url}
      indexableBySearchEngine={
        customPageData?.configJson?.indexableBySearchEngine ?? false
      }
    >
      {formatMessage(pensionCalculatorStrings.pensionStartMonthIsDefault)}
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
                          onChange={(date) => {
                            setBirthdate(date)
                            const newStartDate = add(new Date(date), {
                              years: defaultPensionAge,
                            }).toISOString()
                            methods.setValue('startDate', newStartDate)
                            setStartDate(newStartDate)
                          }}
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
                          onChange={setStartDate}
                        />
                      </Box>

                      {typeof monthOffset === 'number' && (
                        <Text>
                          {/* {n(
                            monthOffset === 0
                              ? 'pensionStartMonthIsDefault'
                              : monthOffset > 0
                              ? 'pensionStartMonthIsDelayed'
                              : 'pensionStartMonthIsHurried',
                            'a',
                          )} */}
                        </Text>
                      )}

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
                          onSelect={(option) => {
                            if (option) {
                              setChildCount(option.value)
                              methods.setValue('childSupportCount', 0)
                            }
                          }}
                        />
                      </Box>

                      {typeof childCount === 'number' && childCount > 0 && (
                        <Box className={styles.inputContainer}>
                          <SelectController
                            id={'childSupportCount' as keyof CalculationInput}
                            name={'childSupportCount' as keyof CalculationInput}
                            label="Fær meðlag greitt með"
                            placeholder="Veldu fjölda barna"
                            options={childSupportCountOptions}
                          />
                        </Box>
                      )}

                      {new Date(dateOfCalculations).getFullYear() <= 2020 &&
                        new Date(dateOfCalculations).getFullYear() > 2015 && (
                          <Box className={styles.inputContainer}>
                            <InputController
                              id={
                                'livingConditionRatio' as keyof CalculationInput
                              }
                              name={
                                'livingConditionRatio' as keyof CalculationInput
                              }
                              label="Búsetuhlutfall"
                              placeholder="%"
                              type="number"
                              suffix="%"
                            />
                          </Box>
                        )}

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
                          <Inline space={3}>
                            <RadioButton
                              id="hasLivedAbroadNo"
                              checked={hasLivedAbroad === false}
                              onChange={() => {
                                setHasLivedAbroad(false)
                                methods.setValue(
                                  'livingConditionAbroadInYears',
                                  null,
                                )
                              }}
                              label={'Nei'}
                            />
                            <RadioButton
                              id="hasLivedAbroadYes"
                              checked={hasLivedAbroad === true}
                              onChange={() => {
                                setHasLivedAbroad(true)
                              }}
                              label={'Já'}
                            />
                          </Inline>
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
  // TODO: these values could be fetched from the custom page
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

  let defaultValues = convertQueryParametersToCalculationInput(query)

  defaultValues = {
    ...defaultValues,
    typeOfBasePension: defaultValues.typeOfBasePension
      ? defaultValues.typeOfBasePension
      : BasePensionType.Retirement,
    typeOfPeriodIncome: defaultValues.typeOfPeriodIncome
      ? defaultValues.typeOfPeriodIncome
      : PeriodIncomeType.Month,
    livingConditionRatio: 100,
    taxCard: 0,
  }

  return {
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    defaultValues,
    dateOfCalculationsOptions: [{ label: 'TEST', value: '123' }], // TODO
    // dateOfCalculationsOptions: getDateOfCalculationsOptions(customPage),
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.PensionCalculator)(
    PensionCalculator, // TODO
  ),
)
