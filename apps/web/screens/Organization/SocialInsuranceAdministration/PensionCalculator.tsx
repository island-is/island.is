import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import add from 'date-fns/add'

import {
  Box,
  Button,
  GridContainer,
  Option,
  Stack,
  Text,
} from '@island.is/island-ui/core'
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
import type {
  Organization,
  OrganizationPage,
  Query,
  QueryGetOrganizationArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import { Screen } from '../../../types'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import * as styles from './PensionCalculator.css'
import SidebarLayout from '../../Layouts/SidebarLayout'

interface FormState {
  basePensionType: number
  birthdate: string
  startDate: string
  hasSpouse: boolean
  livingCondition: number
  childCount: number
  childSupportCount: number
  mobilityImpairment: 'yes' | 'no'
  typeOfPeriodIncome: string
  taxCard: number
  income: number
  pensionPayments: number
  privatePensionPayments: number
  otherIncome: number
  capitalIncome: number
  benefitsFromMunicipality: number
  premium: number
  foreignBasicPension: number
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

  const basePensionTypeOptions = useMemo<Option<number>[]>(() => {
    const options = [
      {
        label: 'Ellilífeyrir',
        value: 1,
      },
      {
        label: 'Ellilífeyrir sjómanna',
        value: 2,
      },
      {
        label: 'Örorkulífeyrir',
        value: 3,
      },
      {
        label: 'Endurhæfingarlífeyrir',
        value: 4,
      },
      {
        label: 'Hálfur ellilífeyrir',
        value: 5,
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

  const livingConditionOptions = useMemo<Option<number>[]>(() => {
    return [
      {
        label: 'Bý ein(n)',
        value: 1,
      },
      {
        label: 'Bý ekki ein(n)',
        value: 2,
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
      { label: 'Já', value: 'yes' },
    ]
  }, [])

  const typeOfPeriodIncomeOptions = useMemo<Option<string>[]>(() => {
    return [
      {
        label: 'Mánaðartekjur',
        value: 'month',
      },
      { label: 'Árstekjur', value: 'year' },
    ]
  }, [])

  const currentDate = new Date() // TODO: change this value depending on year selected (ár reiknivélar)

  const onSubmit = (data: FormState) => {
    console.log('SUBMITTED', data)
  }

  const { activeLocale } = useI18n()

  const dateRange = {
    minDate: add(currentDate, { years: -130 }),
    maxDate: currentDate, // TODO: what should this be?
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
                    defaultValue={1}
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
                      minDate={dateRange.minDate}
                      maxDate={dateRange.maxDate}
                      minYear={dateRange.minDate.getFullYear()}
                      maxYear={dateRange.maxDate.getFullYear()}
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
                      minDate={dateRange.minDate}
                      maxDate={dateRange.maxDate}
                      minYear={dateRange.minDate.getFullYear()}
                      maxYear={dateRange.maxDate.getFullYear()}
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
                      defaultValue="month"
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
