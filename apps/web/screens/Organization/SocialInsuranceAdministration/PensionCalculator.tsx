import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import add from 'date-fns/add'
import addYears from 'date-fns/addYears'
import differenceInMonths from 'date-fns/differenceInMonths'
import { useLazyQuery } from '@apollo/client'

import { Box, Button, Option, Stack, Text } from '@island.is/island-ui/core'
import {
  DatePickerController,
  InputController,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { sortAlpha } from '@island.is/shared/utils'
import {
  getThemeConfig,
  OrganizationFooter,
  OrganizationHeader,
} from '@island.is/web/components'
import {
  Organization,
  OrganizationPage,
  Query,
  QueryGetOrganizationArgs,
  QueryGetOrganizationPageArgs,
  QueryGetPensionCalculationArgs,
  SocialInsurancePensionCalculationBasePensionType as BasePensionType,
  SocialInsurancePensionCalculationBirthyear as Birthyear,
  SocialInsurancePensionCalculationLivingCondition as LivingCondition,
  SocialInsurancePensionCalculationPensionStart as PensionStart,
  SocialInsurancePensionCalculationPeriodIncomeType as PeriodIncomeType,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import { Screen } from '../../../types'
import SidebarLayout from '../../Layouts/SidebarLayout'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { GET_PENSION_CALCULATION } from '../../queries/PensionCalculator'
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
}

interface PensionCalculatorProps {
  organizationPage: OrganizationPage
  organization: Organization
}

const convertStringToNumber = (value: string) => {
  return value ? Number(value) : undefined
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

  const [fetchResult, { data, error }] = useLazyQuery<
    Query,
    QueryGetPensionCalculationArgs
  >(GET_PENSION_CALCULATION)

  console.log('DATA', data)
  console.log('error', error)

  const currentDate = new Date() // TODO: change this value depending on year selected (ár reiknivélar)

  const onSubmit = (data: FormState) => {
    let hurryPension = 0
    let delayPension = 0

    if (data.birthdate && data.startDate) {
      const birthdate = new Date(data.birthdate)
      const startDate = new Date(data.startDate)

      const defaultPensionDate = addYears(birthdate, defaultPensionAge)
      console.log(defaultPensionDate)

      const offset = differenceInMonths(startDate, defaultPensionDate)
      console.log(offset)

      if (offset < 0) {
        hurryPension = Math.abs(offset)
      } else {
        delayPension = offset
      }
    }

    // TODO: do calculators for previous years take current year into account? I think not

    const pensionStart = data.startDate
      ? new Date(data.startDate).getFullYear() >= 2018
        ? PensionStart.Starts2018OrLater
        : PensionStart.Starts2017OrBefore
      : undefined

    fetchResult({
      variables: {
        input: {
          hurryPension,
          delayPension,
          benefitsFromMunicipality: convertStringToNumber(
            data.benefitsFromMunicipality,
          ),
          capitalIncome: convertStringToNumber(data.capitalIncome),
          childCount: data.childCount,
          childSupportCount: data.childSupportCount,
          dateOfCalculations: currentDate,
          foreignBasicPension: convertStringToNumber(data.foreignBasicPension),
          hasSpouse: data.hasSpouse,
          income: convertStringToNumber(data.income),
          otherIncome: convertStringToNumber(data.otherIncome),
          livingCondition: data.livingCondition,
          livingConditionAbroadInYears: convertStringToNumber(
            data.livingConditionAbroadInYears,
          ),
          taxCard: convertStringToNumber(data.taxCard),
          mobilityImpairment: data.mobilityImpairment === 'yes',
          pensionPayments: convertStringToNumber(data.pensionPayments),
          premium: convertStringToNumber(data.premium),
          privatePensionPayments: convertStringToNumber(
            data.privatePensionPayments,
          ),
          typeOfPeriodIncome: data.typeOfPeriodIncome,
          typeOfBasePension: data.basePensionType,
          startPension: pensionStart,
          yearOfBirth: data.birthdate
            ? new Date(data.birthdate).getFullYear() >= 1952
              ? Birthyear.Born1952OrLater
              : Birthyear.Born1951OrEarlier
            : undefined,
          // TODO: handle other fields
        },
      },
    })
  }

  const { activeLocale } = useI18n()

  const birthdateRange = {
    minDate: add(currentDate, { years: -130 }),
    maxDate: currentDate, // TODO: what should this be?
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
    <>
      <OrganizationHeader organizationPage={organizationPage} />

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
                  Reiknivél lífeyris {currentDate.getFullYear()}
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

      <OrganizationFooter organizations={[organization]} />
    </>
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
          lang: 'is',
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug,
          lang: 'is',
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
