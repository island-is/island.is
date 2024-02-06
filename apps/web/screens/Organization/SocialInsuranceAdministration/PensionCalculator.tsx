import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import add from 'date-fns/add'
import { useRouter } from 'next/router'

import { Box, Button, Option, Stack, Text } from '@island.is/island-ui/core'
import {
  DatePickerController,
  InputController,
  RadioController,
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
  SocialInsurancePensionCalculationLivingCondition as LivingCondition,
  SocialInsurancePensionCalculationPeriodIncomeType as PeriodIncomeType,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import { Screen } from '../../../types'
import SidebarLayout from '../../Layouts/SidebarLayout'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'
import * as styles from './PensionCalculator.css'

interface FormState {
  basePensionType: BasePensionType
  birthdate: string
  startDate: string
  hasSpouse: boolean
  livingCondition: LivingCondition
  childCount: number
  childSupportCount: number
  mobilityImpairment: 'yes' | 'no'
  typeOfPeriodIncome: PeriodIncomeType
  taxCard: string
  income: string
  pensionPayments: string
  privatePensionPayments: string
  otherIncome: string
  capitalIncome: string
  benefitsFromMunicipality: string
  premium: string
  foreignBasicPension: string
  hasLivedAbroad: 'yes' | 'no'
  livingConditionAbroadInYears: string
  ageOfFirst75DisabilityAssessment: string
}

interface PensionCalculatorProps {
  organizationPage: OrganizationPage
  organization: Organization
}

const PensionCalculator: Screen<PensionCalculatorProps> = ({
  organizationPage,
  organization,
}) => {
  const methods = useForm<FormState>()
  const defaultPensionAge = 67 // TODO: add to namespace
  const maxMonthPensionDelay = 156 // TODO: add to namespace

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

  const noYesOptions = useMemo<Option<'yes' | 'no'>[]>(() => {
    return [
      {
        label: 'Nei',
        value: 'no',
      },
      {
        label: 'Já',
        value: 'yes',
      },
    ]
  }, [])

  const typeOfPeriodIncomeOptions = useMemo<Option<PeriodIncomeType>[]>(() => {
    return [
      {
        label: 'Mánaðartekjur',
        value: PeriodIncomeType.Month,
      },
      {
        label: 'Árstekjur',
        value: PeriodIncomeType.Year,
      },
    ]
  }, [])

  const dateOfCalculations = new Date() // TODO: change this value depending on year selected (ár reiknivélar)

  const { linkResolver } = useLinkResolver()

  const router = useRouter()

  const onSubmit = (data: FormState) => {
    const baseUrl = linkResolver('pensioncalculatorresults').href
    const queryParams = new URLSearchParams()

    if (data.benefitsFromMunicipality) {
      queryParams.append(
        'benefitsFromMunicipality',
        data.benefitsFromMunicipality,
      )
    }
    if (data.capitalIncome) {
      queryParams.append('capitalIncome', data.capitalIncome)
    }
    if (data.childCount) {
      queryParams.append('childCount', String(data.childCount))
    }
    if (data.childSupportCount) {
      queryParams.append('childSupportCount', String(data.childSupportCount))
    }
    if (data.foreignBasicPension) {
      queryParams.append('foreignBasicPension', data.foreignBasicPension)
    }
    if (data.income) {
      queryParams.append('income', data.income)
    }
    if (data.otherIncome) {
      queryParams.append('otherIncome', data.otherIncome)
    }
    if (data.livingCondition) {
      queryParams.append('livingCondition', data.livingCondition)
    }
    if (data.livingConditionAbroadInYears) {
      queryParams.append(
        'livingConditionAbroadInYears',
        data.livingConditionAbroadInYears,
      )
    }
    if (data.taxCard) {
      queryParams.append('taxCard', data.taxCard)
    }
    if (data.pensionPayments) {
      queryParams.append('pensionPayments', data.pensionPayments)
    }
    if (data.premium) {
      queryParams.append('premium', data.premium)
    }
    if (data.privatePensionPayments) {
      queryParams.append('privatePensionPayments', data.privatePensionPayments)
    }
    if (data.privatePensionPayments) {
      queryParams.append('privatePensionPayments', data.privatePensionPayments)
    }
    if (data.typeOfPeriodIncome) {
      queryParams.append('typeOfPeriodIncome', data.typeOfPeriodIncome)
    }
    if (data.basePensionType) {
      queryParams.append('typeOfBasePension', data.basePensionType)
    }
    if (data.birthdate) {
      queryParams.append('birthdate', data.birthdate)
    }

    queryParams.append(
      'mobilityImpairment',
      data.mobilityImpairment === 'yes' ? 'true' : 'false',
    )
    queryParams.append('hasSpouse', data.hasSpouse ? 'true' : 'false')
    queryParams.append('dateOfCalculations', dateOfCalculations.toISOString())

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

  return (
    <PensionCalculatorWrapper
      organizationPage={organizationPage}
      organization={organization}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack space={3}>
            <SidebarLayout
              sidebarContent={null}
              flexDirection="rowReverse"
              paddingTop={[5, 5, 8]}
              paddingBottom={3}
            >
              <Stack space={3}>
                <Text variant="h1" as="h1">
                  Reiknivél lífeyris {dateOfCalculations.getFullYear()}
                </Text>
                <Text>
                  Vinsamlegast athugið að reiknivélin gefur ekki bindandi
                  niðurstöður
                </Text>

                <Box className={styles.inputContainer}>
                  <SelectController
                    id="basePensionType"
                    name="basePensionType"
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
            </SidebarLayout>

            <Box paddingTop={5} background="blue100">
              <SidebarLayout
                sidebarContent={null}
                flexDirection="rowReverse"
                paddingTop={0}
              >
                <Stack space={3}>
                  <Box className={styles.inputContainer}>
                    <DatePickerController
                      id="birthdate"
                      name="birthdate"
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
                      id="startDate"
                      name="startDate"
                      label="Hvenær viltu hefja töku á ellilífeyri"
                      placeholder="Veldu dagsetningu"
                      locale={activeLocale}
                      minDate={startDateRange.minDate}
                      maxDate={startDateRange.maxDate}
                      minYear={startDateRange.minDate.getFullYear()}
                      maxYear={startDateRange.maxDate.getFullYear()}
                      disabled={!birthdate}
                    />
                  </Box>

                  <Text variant="h2" as="h2">
                    Þínar aðstæður
                  </Text>

                  <Box className={styles.inputContainer}>
                    <SelectController
                      id="hasSpouse"
                      name="hasSpouse"
                      label="Hjúskaparstaða"
                      placeholder="Veldu hjúskaparstöðu"
                      options={hasSpouseOptions}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <SelectController
                      id="livingCondition"
                      name="livingCondition"
                      label="Heimilisaðstæður"
                      placeholder="Heimilisaðstæður"
                      options={livingConditionOptions}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <SelectController
                      id="childCount"
                      name="childCount"
                      label="Börn yngri en 18 ára"
                      placeholder="Veldu fjölda barna"
                      options={childCountOptions}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <SelectController
                      id="childSupportCount"
                      name="childSupportCount"
                      label="Fær meðlag greitt með"
                      placeholder="Veldu fjölda barna"
                      options={childSupportCountOptions}
                    />
                  </Box>

                  {(basePensionType === BasePensionType.Disability ||
                    basePensionType === BasePensionType.Rehabilitation) && (
                    <Box className={styles.inputContainer}>
                      <InputController
                        id="ageOfFirst75DisabilityAssessment"
                        name="ageOfFirst75DisabilityAssessment"
                        label="Fyrsta 75% örorkumat"
                        suffix=" ára"
                        type="number"
                      />
                    </Box>
                  )}

                  <Stack space={2}>
                    <Text>Með hreyfihömlunarmat</Text>
                    <Box className={styles.inputContainer}>
                      <RadioController
                        id="mobilityImpairment"
                        name="mobilityImpairment"
                        defaultValue="no"
                        largeButtons={false}
                        split="1/2"
                        options={noYesOptions}
                      />
                    </Box>
                  </Stack>

                  <Stack space={2}>
                    <Text>Hefur búið erlendis</Text>
                    <Box className={styles.inputContainer}>
                      <RadioController
                        id="hasLivedAbroad"
                        name="hasLivedAbroad"
                        defaultValue="no"
                        largeButtons={false}
                        split="1/2"
                        options={noYesOptions}
                        onSelect={(state) => setHasLivedAbroad(state === 'yes')}
                      />
                    </Box>
                    {hasLivedAbroad && (
                      <Box className={styles.inputContainer}>
                        <InputController
                          id="livingConditionAbroadInYears"
                          name="livingConditionAbroadInYears"
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
                    <RadioController
                      id="typeOfPeriodIncome"
                      name="typeOfPeriodIncome"
                      defaultValue={PeriodIncomeType.Month}
                      largeButtons={false}
                      split="1/2"
                      options={typeOfPeriodIncomeOptions}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <InputController
                      id="taxCard"
                      name="taxCard"
                      label="Hlutfall skattkorts hjá TR"
                      required={true}
                      placeholder="%"
                      type="number"
                      suffix="%"
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <InputController
                      id="income"
                      name="income"
                      label="Tekjur m.a. af atvinnu, eftirlaunum og atvinnuleysisbótum"
                      placeholder="kr."
                      currency={true}
                    />
                  </Box>
                  <Box className={styles.inputContainer}>
                    <InputController
                      id="pensionPayments"
                      name="pensionPayments"
                      label="Greiðslur frá lífeyrissjóðum"
                      placeholder="kr."
                      currency={true}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <InputController
                      id="privatePensionPayments"
                      name="privatePensionPayments"
                      label="Greiðslur viðbótarlífeyrissparnaðar"
                      placeholder="kr."
                      currency={true}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <InputController
                      id="otherIncome"
                      name="otherIncome"
                      label="Aðrar tekjur"
                      placeholder="kr."
                      currency={true}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <InputController
                      id="capitalIncome"
                      name="capitalIncome"
                      label="Fjármagnstekjur"
                      placeholder="kr."
                      currency={true}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <InputController
                      id="benefitsFromMunicipality"
                      name="benefitsFromMunicipality"
                      label="Skattskyldar bætur sveitarfélaga"
                      placeholder="kr."
                      currency={true}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <InputController
                      id="premium"
                      name="premium"
                      label="Frádregin iðgjöld í lífeyrissjóði"
                      placeholder="kr."
                      currency={true}
                    />
                  </Box>

                  <Box className={styles.inputContainer}>
                    <InputController
                      id="foreignBasicPension"
                      name="foreignBasicPension"
                      label="Erlendur grunnlífeyrir"
                      placeholder="kr."
                      currency={true}
                    />
                  </Box>

                  <Button type="submit">Reikna niðurstöður</Button>
                </Stack>
              </SidebarLayout>
            </Box>
          </Stack>
        </form>
      </FormProvider>
    </PensionCalculatorWrapper>
  )
}

PensionCalculator.getProps = async ({ apolloClient, locale }) => {
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

  return {
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(PensionCalculator)
