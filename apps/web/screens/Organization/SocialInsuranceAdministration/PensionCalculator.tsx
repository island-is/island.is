import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import add from 'date-fns/add'
import differenceInMonths from 'date-fns/differenceInMonths'
import { useRouter } from 'next/router'
import { useQueryState } from 'next-usequerystate'

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
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { sortAlpha } from '@island.is/shared/utils'
import { getThemeConfig, MarkdownText } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
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
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { PensionCalculatorTitle } from './PensionCalculatorTitle'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'
import { translationStrings } from './translationStrings'
import {
  convertQueryParametersToCalculationInput,
  convertToQueryParams,
  extractSlug,
  getDateOfCalculationsOptions,
  is2025FormPreviewActive,
  NEW_SYSTEM_TAKES_PLACE_DATE,
} from './utils'
import * as styles from './PensionCalculator.css'

const lowercaseFirstLetter = (value: string | undefined) => {
  if (!value) return value
  return value[0].toLowerCase() + value.slice(1)
}

const hasDisabilityAssessment = (
  typeOfBasePension: BasePensionType | null | undefined,
) => {
  return (
    typeOfBasePension === BasePensionType.Disability ||
    typeOfBasePension === BasePensionType.Rehabilitation ||
    typeOfBasePension === BasePensionType.NewSystemDisability ||
    typeOfBasePension === BasePensionType.NewSystemPartialDisability ||
    typeOfBasePension === BasePensionType.NewSystemMedicalAndRehabilitation
  )
}

const hasStartDate = (
  typeOfBasePension: BasePensionType | null | undefined,
) => {
  return (
    typeOfBasePension === BasePensionType.Retirement ||
    typeOfBasePension === BasePensionType.HalfRetirement
  )
}

interface NumericInputFieldWrapperProps {
  heading: string
  description: string
}

const NumericInputFieldWrapper = ({
  heading,
  description,
  children,
}: PropsWithChildren<NumericInputFieldWrapperProps>) => {
  return (
    <Stack space={2}>
      <Stack space={1}>
        <Box className={styles.textMaxWidth}>
          <Text variant="h4" as="h4">
            {heading}
          </Text>
        </Box>
        <Box className={styles.textMaxWidth}>
          <MarkdownText>{description}</MarkdownText>
        </Box>
      </Stack>
      {children}
    </Stack>
  )
}

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
  const { activeLocale } = useI18n()
  const defaultPensionAge = customPageData?.configJson?.defaultPensionAge ?? 67
  const methods = useForm<CalculationInput>({
    defaultValues,
  })

  const [dateOfCalculations, setDateOfCalculations] = useQueryState(
    'dateOfCalculations',
    {
      defaultValue:
        methods.formState.defaultValues?.dateOfCalculations ??
        dateOfCalculationsOptions[0].value,
    },
  )

  const currencyInputMaxLength =
    customPageData?.configJson?.currencyInputMaxLength ?? 14

  const maxMonthPensionDelayIfBornAfter1951 =
    customPageData?.configJson?.maxMonthPensionDelayIfBornAfter1951 ?? 156

  const maxMonthPensionDelayIfBorn1951OrEarlier =
    customPageData?.configJson?.maxMonthPensionDelayIfBorn1951OrEarlier ?? 60

  const [loadingResultPage, setLoadingResultPage] = useState(false)
  const [hasLivedAbroad, setHasLivedAbroad] = useState(
    methods.formState.defaultValues?.livingConditionAbroadInYears
      ? true
      : false,
  )

  const typeOfBasePension = methods.watch('typeOfBasePension')
  const birthMonth = methods.watch('birthMonth')
  const birthYear = methods.watch('birthYear')
  const startMonth = methods.watch('startMonth')
  const startYear = methods.watch('startYear')

  const maxMonthPensionHurry =
    customPageData?.configJson?.maxMonthPensionHurry?.[
      typeOfBasePension ?? BasePensionType.Retirement
    ] ?? typeOfBasePension === BasePensionType.FishermanRetirement
      ? 12 * 7
      : 12 * 2

  const maxMonthPensionDelay =
    typeof birthYear === 'number' && birthYear < 1952
      ? maxMonthPensionDelayIfBorn1951OrEarlier
      : maxMonthPensionDelayIfBornAfter1951

  const allCalculatorsOptions = useMemo(() => {
    const options = [...dateOfCalculationsOptions]

    if (is2025FormPreviewActive(customPageData)) {
      options.unshift({
        label: formatMessage(translationStrings.form2025PreviewLabel),
        value: NEW_SYSTEM_TAKES_PLACE_DATE.toISOString(),
      })
    }

    return options
  }, [customPageData, dateOfCalculationsOptions, formatMessage])

  const isNewSystemActive =
    is2025FormPreviewActive(customPageData) &&
    dateOfCalculations === NEW_SYSTEM_TAKES_PLACE_DATE.toISOString()

  const basePensionTypeOptions = useMemo<Option<BasePensionType>[]>(() => {
    if (isNewSystemActive) {
      const options = [
        {
          label: formatMessage(
            translationStrings.basePensionNewSystemDisabilityLabel,
          ),
          value: BasePensionType.NewSystemDisability,
        },
        {
          label: formatMessage(
            translationStrings.basePensionNewSystemPartialDisabilityLabel,
          ),
          value: BasePensionType.NewSystemPartialDisability,
        },
        {
          label: formatMessage(
            translationStrings.basePensionNewSystemMedicalAndRehabilitation,
          ),
          value: BasePensionType.NewSystemMedicalAndRehabilitation,
        },
      ]
      return options
    }
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
  }, [formatMessage, isNewSystemActive])

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

  const { linkResolver } = useLinkResolver()

  const router = useRouter()

  const onSubmit = (data: CalculationInput) => {
    const baseUrl = linkResolver('pensioncalculatorresults').href
    const queryParams = convertToQueryParams({
      ...data,
      ...(!hasDisabilityAssessment(data.typeOfBasePension) && {
        ageOfFirst75DisabilityAssessment: undefined,
      }),
      ...(hasDisabilityAssessment(data.typeOfBasePension) && {
        livingConditionAbroadInYears: undefined,
      }),
      ...(!hasStartDate(data.typeOfBasePension) && {
        birthMonth: undefined,
        birthYear: undefined,
        startMonth: undefined,
        startYear: undefined,
      }),
      dateOfCalculations: data.dateOfCalculations
        ? data.dateOfCalculations
        : dateOfCalculationsOptions[0].value,
    })
    setLoadingResultPage(true)
    router.push(`${baseUrl}?${queryParams.toString()}`)
  }

  const monthOptions = useMemo<Option<number>[]>(() => {
    return [
      {
        label: formatMessage(translationStrings.january),
        value: 0,
      },
      {
        label: formatMessage(translationStrings.february),
        value: 1,
      },
      {
        label: formatMessage(translationStrings.march),
        value: 2,
      },
      {
        label: formatMessage(translationStrings.april),
        value: 3,
      },
      {
        label: formatMessage(translationStrings.may),
        value: 4,
      },
      {
        label: formatMessage(translationStrings.june),
        value: 5,
      },
      {
        label: formatMessage(translationStrings.july),
        value: 6,
      },
      {
        label: formatMessage(translationStrings.august),
        value: 7,
      },
      {
        label: formatMessage(translationStrings.september),
        value: 8,
      },
      {
        label: formatMessage(translationStrings.october),
        value: 9,
      },
      {
        label: formatMessage(translationStrings.november),
        value: 10,
      },
      {
        label: formatMessage(translationStrings.december),
        value: 11,
      },
    ]
  }, [formatMessage])

  // Make sure we never enter an invalid state
  useEffect(() => {
    if (isNewSystemActive) {
      if (
        typeOfBasePension !== BasePensionType.NewSystemDisability &&
        typeOfBasePension !== BasePensionType.NewSystemPartialDisability &&
        typeOfBasePension !== BasePensionType.NewSystemMedicalAndRehabilitation
      ) {
        methods.setValue(
          'typeOfBasePension',
          BasePensionType.NewSystemDisability,
        )
      }
    } else {
      if (
        typeOfBasePension === BasePensionType.NewSystemDisability ||
        typeOfBasePension === BasePensionType.NewSystemPartialDisability ||
        typeOfBasePension === BasePensionType.NewSystemMedicalAndRehabilitation
      ) {
        methods.setValue('typeOfBasePension', BasePensionType.Retirement)
      }
    }
  }, [isNewSystemActive, methods, typeOfBasePension])

  const birthYearOptions = useMemo<Option<number>[]>(() => {
    const today = new Date()
    const options: Option<number>[] = []

    const minYear = add(today, {
      years: customPageData?.configJson?.minYearOffset ?? -100,
    }).getFullYear()
    const maxYear = today.getFullYear()

    for (let i = minYear; i <= maxYear; i += 1) {
      options.push({
        label: String(i),
        value: i,
      })
    }

    return options
  }, [customPageData?.configJson?.minYearOffset])

  const defaultPensionDate =
    typeof birthMonth === 'number' && typeof birthYear === 'number'
      ? add(new Date(birthYear, birthMonth + 1), {
          years: defaultPensionAge,
        })
      : null

  const monthOffset =
    defaultPensionDate &&
    typeof startMonth === 'number' &&
    typeof startYear === 'number'
      ? differenceInMonths(new Date(startYear, startMonth), defaultPensionDate)
      : undefined

  const startYearOptions = useMemo<Option<number>[]>(() => {
    const options: Option<number>[] = []

    if (defaultPensionDate) {
      const minYear = add(defaultPensionDate, {
        months: -maxMonthPensionHurry,
      }).getFullYear()

      const maxYear = add(defaultPensionDate, {
        months: maxMonthPensionDelay,
      }).getFullYear()

      for (let i = minYear; i <= maxYear; i += 1) {
        options.push({
          label: String(i),
          value: i,
        })
      }
    }

    return options
  }, [defaultPensionDate, maxMonthPensionDelay, maxMonthPensionHurry])

  const title = `${formatMessage(
    isNewSystemActive
      ? translationStrings.form2025PreviewMainTitle
      : translationStrings.mainTitle,
  )}`
  const titlePostfix = `${(
    allCalculatorsOptions.find((o) => o.value === dateOfCalculations)?.label ??
    dateOfCalculationsOptions[0].label
  ).toLowerCase()}`

  const titleVariant = isNewSystemActive ? 'h2' : 'h1'

  const startMonthOptions = useMemo(() => {
    if (!defaultPensionDate) {
      return monthOptions
    }

    if (startYear === startYearOptions[0]?.value) {
      const minMonth = add(defaultPensionDate, {
        months: -maxMonthPensionHurry,
      }).getMonth()
      return monthOptions.filter((month) => month.value >= minMonth)
    }

    if (startYear === startYearOptions[startYearOptions.length - 1]?.value) {
      const maxMonth = add(defaultPensionDate, {
        months: maxMonthPensionDelay,
      }).getMonth()

      return monthOptions.filter((month) => month.value <= maxMonth)
    }

    return monthOptions
  }, [
    defaultPensionDate,
    maxMonthPensionDelay,
    maxMonthPensionHurry,
    monthOptions,
    startYear,
    startYearOptions,
  ])

  const defaultStartMonthLabel = monthOptions.find(
    (option) => defaultPensionDate?.getMonth() === option.value,
  )?.label

  const maxLivingConditionAbroadInYears: number =
    customPageData?.configJson?.maxLivingConditionAbroadInYears ?? 52

  const maxTaxCardRatio: number =
    customPageData?.configJson?.maxTaxCardRatio ?? 100

  const isTurnedOff = customPageData?.configJson?.isTurnedOff ?? true

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
      {isTurnedOff && (
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '1/9']}
              className={styles.fullWidth}
            >
              <Box paddingY={5}>
                <Stack space={3}>
                  <PensionCalculatorTitle
                    isNewSystemActive={isNewSystemActive}
                    title={title}
                    titlePostfix={titlePostfix}
                    titleVariant={titleVariant}
                  />
                  <Text>{formatMessage(translationStrings.isTurnedOff)}</Text>
                </Stack>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
      {!isTurnedOff && (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack space={6}>
              <GridContainer>
                <GridRow>
                  <GridColumn
                    offset={['0', '0', '0', '1/9']}
                    className={styles.fullWidth}
                  >
                    <Stack space={3}>
                      <Stack space={3}>
                        <Box paddingTop={6}>
                          <PensionCalculatorTitle
                            isNewSystemActive={isNewSystemActive}
                            title={title}
                            titlePostfix={titlePostfix}
                            titleVariant={titleVariant}
                          />
                        </Box>
                      </Stack>
                      <Box
                        columnGap={3}
                        rowGap={3}
                        display="flex"
                        flexDirection="row"
                        justifyContent="spaceBetween"
                        alignItems="flexEnd"
                        flexWrap="wrap"
                      >
                        <Box className={styles.textMaxWidth}>
                          <MarkdownText>
                            {formatMessage(translationStrings.introduction)}
                          </MarkdownText>
                        </Box>

                        <Box className={styles.dateOfCalculationsSelect}>
                          <SelectController
                            id={'dateOfCalculations' as keyof CalculationInput}
                            name={
                              'dateOfCalculations' as keyof CalculationInput
                            }
                            label={formatMessage(
                              translationStrings.dateOfCalculationsLabel,
                            )}
                            placeholder={formatMessage(
                              translationStrings.dateOfCalculationsPlaceholder,
                            )}
                            size="sm"
                            options={allCalculatorsOptions}
                            onSelect={(option) => {
                              if (option) {
                                setDateOfCalculations(option.value)
                                if (isNewSystemActive) {
                                  if (
                                    option.value ===
                                    NEW_SYSTEM_TAKES_PLACE_DATE.toISOString()
                                  ) {
                                    // Date is being moved to the new system date
                                    methods.setValue(
                                      'typeOfBasePension',
                                      BasePensionType.NewSystemDisability,
                                    )
                                  } else if (
                                    dateOfCalculations ===
                                    NEW_SYSTEM_TAKES_PLACE_DATE.toISOString()
                                  ) {
                                    // Date is being moved from new system date
                                    methods.setValue(
                                      'typeOfBasePension',
                                      BasePensionType.Retirement,
                                    )
                                  }
                                }
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
                        />
                      </Box>
                    </Stack>
                  </GridColumn>
                </GridRow>
              </GridContainer>

              <Box paddingY={5} background="blue100">
                <GridContainer>
                  <GridRow>
                    <GridColumn
                      offset={['0', '0', '0', '1/9']}
                      className={styles.fullWidth}
                    >
                      <Stack space={5}>
                        {hasStartDate(typeOfBasePension) && (
                          <Stack space={3}>
                            <Box className={styles.textMaxWidth}>
                              <Text variant="h2" as="h2">
                                {formatMessage(
                                  translationStrings.startOfPaymentsHeading,
                                )}
                              </Text>
                            </Box>

                            <Box className={styles.textMaxWidth}>
                              <Text>
                                {formatMessage(
                                  translationStrings.startOfPaymentsDescription,
                                )}
                              </Text>
                            </Box>

                            <Box className={styles.textMaxWidth}>
                              <Text>
                                {formatMessage(
                                  translationStrings.birthMonthAndYearDescription,
                                )}
                              </Text>
                            </Box>

                            <Inline space={3} collapseBelow="sm">
                              <Box className={styles.monthSelectContainer}>
                                <SelectController
                                  id={'birthMonth' as keyof CalculationInput}
                                  name={'birthMonth' as keyof CalculationInput}
                                  options={monthOptions}
                                  label={formatMessage(
                                    translationStrings.birthMonthLabel,
                                  )}
                                  placeholder={formatMessage(
                                    translationStrings.birthMonthPlaceholder,
                                  )}
                                  onSelect={(option) => {
                                    methods.setValue(
                                      'startMonth',
                                      option.value > 10 ? 0 : option.value + 1,
                                    )
                                    methods.setValue(
                                      'startYear',
                                      birthYear +
                                        defaultPensionAge +
                                        (option.value > 10 ? 1 : 0),
                                    )
                                  }}
                                />
                              </Box>
                              <Box className={styles.yearSelectContainer}>
                                <SelectController
                                  id={'birthYear' as keyof CalculationInput}
                                  name={'birthYear' as keyof CalculationInput}
                                  options={birthYearOptions}
                                  label={formatMessage(
                                    translationStrings.birthYearLabel,
                                  )}
                                  placeholder={formatMessage(
                                    translationStrings.birthYearPlaceholder,
                                  )}
                                  onSelect={(option) => {
                                    methods.setValue(
                                      'startYear',
                                      option.value + defaultPensionAge,
                                    )
                                  }}
                                />
                              </Box>
                            </Inline>

                            {startYearOptions?.length > 0 && (
                              <Box className={styles.textMaxWidth}>
                                <MarkdownText>
                                  {formatMessage(
                                    translationStrings.startMonthAndYearDescriptionMarkdown,
                                    {
                                      month:
                                        activeLocale !== 'en'
                                          ? lowercaseFirstLetter(
                                              defaultStartMonthLabel,
                                            )
                                          : defaultStartMonthLabel,
                                      year: startYearOptions?.[2]?.label,
                                    },
                                  )}
                                </MarkdownText>
                              </Box>
                            )}

                            {typeof birthMonth === 'number' &&
                              typeof birthYear === 'number' && (
                                <Inline space={3} collapseBelow="sm">
                                  <Box className={styles.monthSelectContainer}>
                                    <SelectController
                                      id={
                                        'startMonth' as keyof CalculationInput
                                      }
                                      name={
                                        'startMonth' as keyof CalculationInput
                                      }
                                      options={startMonthOptions}
                                      label={formatMessage(
                                        translationStrings.startMonthLabel,
                                      )}
                                      placeholder={formatMessage(
                                        translationStrings.startMonthPlaceholder,
                                      )}
                                    />
                                  </Box>
                                  <Box className={styles.yearSelectContainer}>
                                    <SelectController
                                      id={'startYear' as keyof CalculationInput}
                                      name={
                                        'startYear' as keyof CalculationInput
                                      }
                                      disabled={
                                        typeof birthMonth !== 'number' ||
                                        typeof birthYear !== 'number'
                                      }
                                      options={startYearOptions}
                                      label={formatMessage(
                                        translationStrings.startYearLabel,
                                      )}
                                      placeholder={formatMessage(
                                        translationStrings.startYearPlaceholder,
                                      )}
                                      onSelect={(option) => {
                                        if (!defaultPensionDate) {
                                          return
                                        }
                                        if (
                                          option.value ===
                                          startYearOptions[0]?.value
                                        ) {
                                          const minMonth = add(
                                            defaultPensionDate,
                                            {
                                              months: -maxMonthPensionHurry,
                                            },
                                          ).getMonth()
                                          if (
                                            typeof startMonth === 'number' &&
                                            startMonth < minMonth
                                          ) {
                                            methods.setValue(
                                              'startMonth',
                                              minMonth,
                                            )
                                          }
                                        }

                                        if (
                                          option.value ===
                                          startYearOptions[
                                            startYearOptions.length - 1
                                          ]?.value
                                        ) {
                                          const maxMonth = add(
                                            defaultPensionDate,
                                            {
                                              months: maxMonthPensionDelay,
                                            },
                                          ).getMonth()

                                          if (
                                            typeof startMonth === 'number' &&
                                            startMonth > maxMonth
                                          ) {
                                            methods.setValue(
                                              'startMonth',
                                              maxMonth,
                                            )
                                          }
                                        }
                                      }}
                                    />
                                  </Box>
                                </Inline>
                              )}

                            {typeof monthOffset === 'number' &&
                              monthOffset !== 0 && (
                                <Text>
                                  {formatMessage(
                                    monthOffset > 0
                                      ? translationStrings.pensionStartIsDelayed
                                      : translationStrings.pensionStartIsHurried,
                                    {
                                      monthAmount: `${Math.abs(monthOffset)} ${
                                        activeLocale === 'is'
                                          ? 'mánuð'
                                          : 'month'
                                      }${
                                        Math.abs(monthOffset) !== 1
                                          ? activeLocale === 'is'
                                            ? 'i'
                                            : 's'
                                          : ''
                                      }`,
                                    },
                                  )}
                                </Text>
                              )}
                          </Stack>
                        )}
                        <Text variant="h2" as="h2">
                          {formatMessage(
                            translationStrings.yourCircumstancesHeading,
                          )}
                        </Text>

                        <Stack space={6}>
                          <Stack space={3}>
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
                                name={
                                  'livingCondition' as keyof CalculationInput
                                }
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
                              />
                            </Box>

                            {(typeOfBasePension ===
                              BasePensionType.Disability ||
                              typeOfBasePension ===
                                BasePensionType.NewSystemDisability ||
                              typeOfBasePension ===
                                BasePensionType.NewSystemPartialDisability ||
                              typeOfBasePension ===
                                BasePensionType.Rehabilitation) && (
                              <Box className={styles.inputContainer}>
                                <InputController
                                  id={
                                    'ageOfFirst75DisabilityAssessment' as keyof CalculationInput
                                  }
                                  name={
                                    'ageOfFirst75DisabilityAssessment' as keyof CalculationInput
                                  }
                                  label={formatMessage(
                                    typeOfBasePension ===
                                      BasePensionType.Disability ||
                                      typeOfBasePension ===
                                        BasePensionType.NewSystemDisability ||
                                      typeOfBasePension ===
                                        BasePensionType.NewSystemPartialDisability
                                      ? translationStrings.ageOfFirst75DisabilityAssessment
                                      : translationStrings.ageOfFirst75RehabilitationAssessment,
                                  )}
                                  suffix={
                                    ' ' +
                                    formatMessage(
                                      translationStrings.ageOfFirst75DisabilityAssessmentSuffix,
                                    )
                                  }
                                  type="number"
                                  maxLength={
                                    formatMessage(
                                      translationStrings.ageOfFirst75DisabilityAssessmentSuffix,
                                    ).length + 3
                                  }
                                  placeholder={formatMessage(
                                    translationStrings.ageOfFirst75DisabilityAssessmentPlaceholder,
                                  )}
                                />
                              </Box>
                            )}
                          </Stack>
                          {!hasDisabilityAssessment(typeOfBasePension) && (
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
                                    placeholder={formatMessage(
                                      translationStrings.livingConditionAbroadInYearsPlaceholder,
                                    )}
                                    type="number"
                                    suffix={` ${formatMessage(
                                      translationStrings.yearsSuffix,
                                    )}`}
                                    format={(value) => {
                                      if (
                                        Number(value) >
                                        maxLivingConditionAbroadInYears
                                      ) {
                                        value = String(
                                          maxLivingConditionAbroadInYears,
                                        )
                                      }
                                      return `${value} ${formatMessage(
                                        translationStrings.yearsSuffix,
                                      )}`
                                    }}
                                  />
                                </Box>
                              )}
                            </Stack>
                          )}

                          <NumericInputFieldWrapper
                            heading={formatMessage(
                              translationStrings.taxCardRatioHeading,
                            )}
                            description={formatMessage(
                              translationStrings.taxCardRatioDescription,
                            )}
                          >
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
                                format={(value) => {
                                  if (Number(value) > maxTaxCardRatio) {
                                    value = String(maxTaxCardRatio)
                                  }
                                  return `${value}%`
                                }}
                              />
                            </Box>
                          </NumericInputFieldWrapper>
                        </Stack>

                        <Text variant="h2" as="h2">
                          {formatMessage(translationStrings.mainIncomeHeading)}
                        </Text>

                        <MarkdownText>
                          {formatMessage(translationStrings.incomeDisclaimer)}
                        </MarkdownText>

                        <Stack space={3}>
                          <Text variant="h4" as="h3">
                            {formatMessage(
                              translationStrings.incomeBeforeTaxHeading,
                            )}
                          </Text>

                          <Box className={styles.inputContainer}>
                            <Controller
                              name={
                                'typeOfPeriodIncome' as keyof CalculationInput
                              }
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
                        </Stack>
                        <Text>
                          {formatMessage(translationStrings.amountDisclaimer)}
                        </Text>

                        <Stack space={6}>
                          <NumericInputFieldWrapper
                            heading={formatMessage(
                              translationStrings.incomeHeading,
                            )}
                            description={formatMessage(
                              translationStrings.incomeDescription,
                            )}
                          >
                            <Box className={styles.inputContainer}>
                              <InputController
                                id={'income' as keyof CalculationInput}
                                name={'income' as keyof CalculationInput}
                                label={formatMessage(
                                  translationStrings.incomeLabel,
                                )}
                                placeholder="kr."
                                currency={true}
                                maxLength={currencyInputMaxLength}
                              />
                            </Box>
                          </NumericInputFieldWrapper>

                          <NumericInputFieldWrapper
                            heading={formatMessage(
                              translationStrings.pensionPaymentsHeading,
                            )}
                            description={formatMessage(
                              translationStrings.pensionPaymentsDescription,
                            )}
                          >
                            <Box className={styles.inputContainer}>
                              <InputController
                                id={'pensionPayments' as keyof CalculationInput}
                                name={
                                  'pensionPayments' as keyof CalculationInput
                                }
                                label={formatMessage(
                                  translationStrings.pensionPaymentsLabel,
                                )}
                                placeholder="kr."
                                currency={true}
                                maxLength={currencyInputMaxLength}
                              />
                            </Box>
                          </NumericInputFieldWrapper>

                          <NumericInputFieldWrapper
                            heading={formatMessage(
                              translationStrings.privatePensionPaymentsHeading,
                            )}
                            description={formatMessage(
                              translationStrings.privatePensionPaymentsDescription,
                            )}
                          >
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
                                maxLength={currencyInputMaxLength}
                              />
                            </Box>
                          </NumericInputFieldWrapper>

                          <NumericInputFieldWrapper
                            heading={formatMessage(
                              translationStrings.otherIncomeHeading,
                            )}
                            description={formatMessage(
                              translationStrings.otherIncomeDescription,
                            )}
                          >
                            <Box className={styles.inputContainer}>
                              <InputController
                                id={'otherIncome' as keyof CalculationInput}
                                name={'otherIncome' as keyof CalculationInput}
                                label={formatMessage(
                                  translationStrings.otherIncomeLabel,
                                )}
                                placeholder="kr."
                                currency={true}
                                maxLength={currencyInputMaxLength}
                              />
                            </Box>
                          </NumericInputFieldWrapper>

                          <NumericInputFieldWrapper
                            heading={formatMessage(
                              translationStrings.capitalIncomeHeading,
                            )}
                            description={formatMessage(
                              translationStrings.capitalIncomeDescription,
                            )}
                          >
                            <Box className={styles.inputContainer}>
                              <InputController
                                id={'capitalIncome' as keyof CalculationInput}
                                name={'capitalIncome' as keyof CalculationInput}
                                label={formatMessage(
                                  translationStrings.capitalIncomeLabel,
                                )}
                                placeholder="kr."
                                currency={true}
                                maxLength={currencyInputMaxLength}
                              />
                            </Box>
                          </NumericInputFieldWrapper>

                          <NumericInputFieldWrapper
                            heading={formatMessage(
                              translationStrings.foreignBasicPensionHeading,
                            )}
                            description={formatMessage(
                              translationStrings.foreignBasicPensionDescription,
                            )}
                          >
                            <Box className={styles.inputContainer}>
                              <InputController
                                id={
                                  'foreignBasicPension' as keyof CalculationInput
                                }
                                name={
                                  'foreignBasicPension' as keyof CalculationInput
                                }
                                label={formatMessage(
                                  translationStrings.foreignBasicPensionLabel,
                                )}
                                placeholder="kr."
                                currency={true}
                                maxLength={currencyInputMaxLength}
                              />
                            </Box>
                          </NumericInputFieldWrapper>

                          <NumericInputFieldWrapper
                            heading={formatMessage(
                              translationStrings.benefitsFromMunicipalityHeading,
                            )}
                            description={formatMessage(
                              translationStrings.benefitsFromMunicipalityDescription,
                            )}
                          >
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
                                maxLength={currencyInputMaxLength}
                              />
                            </Box>
                          </NumericInputFieldWrapper>

                          <NumericInputFieldWrapper
                            heading={formatMessage(
                              translationStrings.premiumHeading,
                            )}
                            description={formatMessage(
                              translationStrings.premiumDescription,
                            )}
                          >
                            <Box className={styles.inputContainer}>
                              <InputController
                                id={'premium' as keyof CalculationInput}
                                name={'premium' as keyof CalculationInput}
                                label={formatMessage(
                                  translationStrings.premiumLabel,
                                )}
                                placeholder="kr."
                                currency={true}
                                maxLength={currencyInputMaxLength}
                              />
                            </Box>
                          </NumericInputFieldWrapper>

                          <Box className={styles.textMaxWidth}>
                            <Text variant="h5">
                              {formatMessage(translationStrings.disclaimer)}
                            </Text>
                          </Box>

                          <Button loading={loadingResultPage} type="submit">
                            {formatMessage(translationStrings.calculateResults)}
                          </Button>
                        </Stack>
                      </Stack>
                    </GridColumn>
                  </GridRow>
                </GridContainer>
              </Box>
            </Stack>
          </form>
        </FormProvider>
      )}
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
          subpageSlugs: [locale === 'is' ? 'reiknivel' : 'calculator'],
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

  const dateOfCalculationsOptions = getDateOfCalculationsOptions(customPageData)

  defaultValues = {
    ...defaultValues,
    typeOfBasePension: defaultValues.typeOfBasePension
      ? defaultValues.typeOfBasePension
      : BasePensionType.Retirement,
    typeOfPeriodIncome: defaultValues.typeOfPeriodIncome
      ? defaultValues.typeOfPeriodIncome
      : PeriodIncomeType.Month,
    dateOfCalculations: defaultValues.dateOfCalculations
      ? defaultValues.dateOfCalculations
      : dateOfCalculationsOptions[0].value,
  }

  const organizationNamespace =
    extractNamespaceFromOrganization(getOrganization)

  return {
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    defaultValues,
    customTopLoginButtonItem: organizationNamespace?.customTopLoginButtonItem,
    dateOfCalculationsOptions,
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
