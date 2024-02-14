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
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'
import { translationStrings } from './translationStrings'
import {
  convertQueryParametersToCalculationInput,
  convertToQueryParams,
  extractSlug,
  getDateOfCalculationsOptions,
} from './utils'
import * as styles from './PensionCalculator.css'

interface PensionCalculatorProps {
  organizationPage: OrganizationPage
  organization: Organization
  defaultValues: CalculationInput
  dateOfCalculationsOptions: Option<string>[]
}

const PensionCalculator: CustomScreen<PensionCalculatorProps> = ({
  organizationPage,
  organization,
  defaultValues,
  dateOfCalculationsOptions,
  customPageData,
}) => {
  const { formatMessage } = useIntl()
  const defaultPensionAge = customPageData?.configJson?.defaultPensionAge ?? 67

  const methods = useForm<CalculationInput>({
    defaultValues,
  })
  const maxMonthPensionDelay =
    customPageData?.configJson?.maxMonthPensionDelay ?? 156

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
    customPageData?.configJson?.maxMonthPensionHurry?.[basePensionType] ??
    basePensionType === BasePensionType.FishermanRetirement
      ? 12 * 7
      : 12 * 2

  const basePensionTypeOptions = useMemo<Option<BasePensionType>[]>(() => {
    const options = [
      {
        label: formatMessage(translationStrings.basePensionRetirementLabel),
        value: BasePensionType.Retirement,
      },
      {
        label: formatMessage(
          translationStrings.basePensionFishermanRetirementLabel,
        ),
        value: BasePensionType.FishermanRetirement,
      },
      {
        label: formatMessage(translationStrings.basePensionDisabilityLabel),
        value: BasePensionType.Disability,
      },
      {
        label: formatMessage(translationStrings.basePensionRehabilitationLabel),
        value: BasePensionType.Rehabilitation,
      },
      {
        label: formatMessage(translationStrings.basePensionHalfRetirementLabel),
        value: BasePensionType.HalfRetirement,
      },
    ]
    options.sort(sortAlpha('label'))
    return options
  }, [formatMessage])

  const hasSpouseOptions = useMemo<Option<boolean>[]>(() => {
    return [
      {
        label: formatMessage(translationStrings.hasSpouseNoLabel),
        value: false,
      },
      {
        label: formatMessage(translationStrings.hasSpouseYesLabel),
        value: true,
      },
    ]
  }, [formatMessage])

  const livingConditionOptions = useMemo<Option<LivingCondition>[]>(() => {
    return [
      {
        label: formatMessage(translationStrings.livesAloneYesLabel),
        value: LivingCondition.LivesAlone,
      },
      {
        label: formatMessage(translationStrings.livesAloneNoLabel),
        value: LivingCondition.DoesNotLiveAlone,
      },
    ]
  }, [formatMessage])

  const childCountOptions = useMemo<Option<number>[]>(() => {
    return [
      {
        label: formatMessage(translationStrings.childCountOptionsNoneLabel),
        value: 0,
      },
      {
        label: formatMessage(translationStrings.childCountOptionsOneLabel),
        value: 1,
      },
      {
        label: formatMessage(translationStrings.childCountOptionsTwoLabel),
        value: 2,
      },
      {
        label: formatMessage(translationStrings.childCountOptionsThreeLabel),
        value: 3,
      },
      {
        label: formatMessage(translationStrings.childCountOptionsFourLabel),
        value: 4,
      },
      {
        label: formatMessage(translationStrings.childCountOptionsFiveLabel),
        value: 5,
      },
      {
        label: formatMessage(translationStrings.childCountOptionsSixLabel),
        value: 6,
      },
      {
        label: formatMessage(translationStrings.childCountOptionsSevenLabel),
        value: 7,
      },
      {
        label: formatMessage(translationStrings.childCountOptionsEightLabel),
        value: 8,
      },
      {
        label: formatMessage(translationStrings.childCountOptionsNineLabel),
        value: 9,
      },
    ]
  }, [formatMessage])

  const childSupportCountOptions = useMemo<Option<number>[]>(() => {
    const options = [
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsNoneLabel,
        ),
        value: 0,
      },
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsOneLabel,
        ),
        value: 1,
      },
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsTwoLabel,
        ),
        value: 2,
      },
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsThreeLabel,
        ),
        value: 3,
      },
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsFourLabel,
        ),
        value: 4,
      },
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsFiveLabel,
        ),
        value: 5,
      },
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsSixLabel,
        ),
        value: 6,
      },
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsSevenLabel,
        ),
        value: 7,
      },
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsEightLabel,
        ),
        value: 8,
      },
      {
        label: formatMessage(
          translationStrings.childSupportCountOptionsNineLabel,
        ),
        value: 9,
      },
    ]

    if (typeof childCount === 'number') {
      return options.slice(0, childCount + 1)
    }
    return []
  }, [childCount, formatMessage])

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

  const today = new Date()

  const birthdateRange = {
    minDate: add(today, {
      years: customPageData?.configJson?.minYearOffset ?? -130,
    }),
    maxDate: add(today, {
      years: customPageData?.configJson?.maxYearOffset ?? 0,
    }),
  }

  const startDateRange = !birthdate
    ? birthdateRange
    : {
        minDate: add(add(new Date(birthdate), { years: defaultPensionAge }), {
          months: -maxMonthPensionHurry,
        }),
        maxDate: add(add(new Date(birthdate), { years: defaultPensionAge }), {
          months: maxMonthPensionDelay,
        }),
      }

  const title = `${formatMessage(translationStrings.mainTitle)} ${
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
                            {formatMessage(translationStrings.disclaimer)}
                          </Text>
                        </Box>
                      </Stack>
                      <Box className={styles.yearSelectContainer}>
                        <SelectController
                          id={'dateOfCalculations' as keyof CalculationInput}
                          name={'dateOfCalculations' as keyof CalculationInput}
                          label={formatMessage(
                            translationStrings.dateOfCalculationsLabel,
                          )}
                          placeholder={formatMessage(
                            translationStrings.dateOfCalculationsPlaceholder,
                          )}
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
                        label={formatMessage(
                          translationStrings.typeOfBasePensionLabel,
                        )}
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
                          label={formatMessage(
                            translationStrings.birthdateLabel,
                          )}
                          placeholder={formatMessage(
                            translationStrings.birthdatePlaceholder,
                          )}
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
                          label={formatMessage(
                            translationStrings.startDateLabel,
                          )}
                          placeholder={formatMessage(
                            translationStrings.startDatePlaceholder,
                          )}
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
                          {formatMessage(
                            monthOffset === 0
                              ? translationStrings.pensionStartIsDefault
                              : monthOffset > 0
                              ? translationStrings.pensionStartIsDelayed
                              : translationStrings.pensionStartIsHurried,
                          )}
                        </Text>
                      )}

                      <Text variant="h2" as="h2">
                        {formatMessage(
                          translationStrings.yourCircumstancesHeading,
                        )}
                      </Text>

                      <Box className={styles.inputContainer}>
                        <SelectController
                          id={'hasSpouse' as keyof CalculationInput}
                          name={'hasSpouse' as keyof CalculationInput}
                          label={formatMessage(
                            translationStrings.hasSpouseLabel,
                          )}
                          placeholder={formatMessage(
                            translationStrings.hasSpousePlaceholder,
                          )}
                          options={hasSpouseOptions}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <SelectController
                          id={'livingCondition' as keyof CalculationInput}
                          name={'livingCondition' as keyof CalculationInput}
                          label={formatMessage(
                            translationStrings.livingConditionLabel,
                          )}
                          placeholder={formatMessage(
                            translationStrings.livingConditionPlaceholder,
                          )}
                          options={livingConditionOptions}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <SelectController
                          id={'childCount' as keyof CalculationInput}
                          name={'childCount' as keyof CalculationInput}
                          label={formatMessage(
                            translationStrings.childCountLabel,
                          )}
                          placeholder={formatMessage(
                            translationStrings.childCountPlaceholder,
                          )}
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
                            label={formatMessage(
                              translationStrings.childSupportCountLabel,
                            )}
                            placeholder={formatMessage(
                              translationStrings.childSupportCountPlaceholder,
                            )}
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
                              label={formatMessage(
                                translationStrings.livingConditionRatioLabel,
                              )}
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
                            suffix={formatMessage(
                              translationStrings.yearsSuffix,
                            )}
                            type="number"
                          />
                        </Box>
                      )}

                      <Stack space={2}>
                        <Text>
                          {formatMessage(
                            translationStrings.mobilityImpairmentLabel,
                          )}
                        </Text>
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
                                  label={formatMessage(
                                    translationStrings.mobilityImpairmentNo,
                                  )}
                                />
                                <RadioButton
                                  id="mobilityImpairmentYes"
                                  checked={value === true}
                                  onChange={() => {
                                    onChange(true)
                                  }}
                                  label={formatMessage(
                                    translationStrings.mobilityImpairmentYes,
                                  )}
                                />
                              </Inline>
                            )}
                          />
                        </Box>
                      </Stack>

                      <Stack space={2}>
                        <Text>
                          {formatMessage(
                            translationStrings.hasLivedAbroadLabel,
                          )}
                        </Text>
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
                              label={formatMessage(
                                translationStrings.hasLivedAbroadNo,
                              )}
                            />
                            <RadioButton
                              id="hasLivedAbroadYes"
                              checked={hasLivedAbroad === true}
                              onChange={() => {
                                setHasLivedAbroad(true)
                              }}
                              label={formatMessage(
                                translationStrings.hasLivedAbroadYes,
                              )}
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
                              label={formatMessage(
                                translationStrings.livingConditionAbroadInYearsLabel,
                              )}
                              placeholder="0 ár"
                              type="number"
                              suffix={formatMessage(
                                translationStrings.yearsSuffix,
                              )}
                            />
                          </Box>
                        )}
                      </Stack>

                      <Text variant="h2" as="h2">
                        {formatMessage(translationStrings.incomeHeading)}
                      </Text>

                      <Text variant="h3" as="h3">
                        {formatMessage(
                          translationStrings.incomeBeforeTaxHeading,
                        )}
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
                                  label={formatMessage(
                                    translationStrings.typeOfPeriodIncomeMonthLabel,
                                  )}
                                />
                              </GridColumn>
                              <GridColumn span={['1/1', '1/2']}>
                                <RadioButton
                                  id="typeOfPeriodIncomeYear"
                                  checked={value === PeriodIncomeType.Year}
                                  onChange={() => {
                                    onChange(PeriodIncomeType.Year)
                                  }}
                                  label={formatMessage(
                                    translationStrings.typeOfPeriodIncomeYearLabel,
                                  )}
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
                          label={formatMessage(
                            translationStrings.taxCardRatioLabel,
                          )}
                          placeholder="%"
                          type="number"
                          suffix="%"
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'income' as keyof CalculationInput}
                          name={'income' as keyof CalculationInput}
                          label={formatMessage(translationStrings.incomeLabel)}
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>
                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'pensionPayments' as keyof CalculationInput}
                          name={'pensionPayments' as keyof CalculationInput}
                          label={formatMessage(
                            translationStrings.pensionPaymentsLabel,
                          )}
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
                          label={formatMessage(
                            translationStrings.privatePensionPaymentsLabel,
                          )}
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'otherIncome' as keyof CalculationInput}
                          name={'otherIncome' as keyof CalculationInput}
                          label={formatMessage(
                            translationStrings.otherIncomeLabel,
                          )}
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'capitalIncome' as keyof CalculationInput}
                          name={'capitalIncome' as keyof CalculationInput}
                          label={formatMessage(
                            translationStrings.capitalIncomeLabel,
                          )}
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
                          label={formatMessage(
                            translationStrings.benefitsFromMunicipalityLabel,
                          )}
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'premium' as keyof CalculationInput}
                          name={'premium' as keyof CalculationInput}
                          label={formatMessage(translationStrings.premiumLabel)}
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Box className={styles.inputContainer}>
                        <InputController
                          id={'foreignBasicPension' as keyof CalculationInput}
                          name={'foreignBasicPension' as keyof CalculationInput}
                          label={formatMessage(
                            translationStrings.foreignBasicPensionLabel,
                          )}
                          placeholder="kr."
                          currency={true}
                        />
                      </Box>

                      <Button loading={loadingResultPage} type="submit">
                        {formatMessage(translationStrings.calculateResults)}
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

PensionCalculator.getProps = async ({
  apolloClient,
  locale,
  query,
  customPageData,
}) => {
  const slug = extractSlug(locale, customPageData)

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
    dateOfCalculationsOptions: getDateOfCalculationsOptions(customPageData),
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.PensionCalculator,
    PensionCalculator,
  ),
)
