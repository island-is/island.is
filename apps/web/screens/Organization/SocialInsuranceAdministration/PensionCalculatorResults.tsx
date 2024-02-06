import {
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsStringEnum,
} from 'next-usequerystate'

import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Inline,
  LinkV2,
  Stack,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { getThemeConfig } from '@island.is/web/components'
import {
  Organization,
  OrganizationPage,
  Query,
  QueryGetOrganizationArgs,
  QueryGetOrganizationPageArgs,
  QueryGetPensionCalculationArgs,
  SocialInsurancePensionCalculationBasePensionType,
  SocialInsurancePensionCalculationLivingCondition,
  SocialInsurancePensionCalculationPeriodIncomeType,
  SocialInsurancePensionCalculationResponse,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import SidebarLayout from '../../Layouts/SidebarLayout'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { GET_PENSION_CALCULATION } from '../../queries/PensionCalculator'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'

export const formatCurrency = (answer: number | null | undefined) => {
  if (typeof answer !== 'number') return answer
  return String(answer).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
}

interface PensionCalculatorResultsProps {
  organizationPage: OrganizationPage
  organization: Organization
  calculation: SocialInsurancePensionCalculationResponse
  calculationYear?: number
}

const PensionCalculatorResults: Screen<PensionCalculatorResultsProps> = ({
  organizationPage,
  organization,
  calculation,
  calculationYear,
}) => {
  const { linkResolver } = useLinkResolver() // TODO: add query params to pensioncalculator button

  const totalAfterTax = calculation.items.find((item) =>
    item.name?.includes('Samtals frá TR eftir skatt'),
  )
  console.log(calculation)
  console.log(totalAfterTax)
  return (
    <PensionCalculatorWrapper
      organizationPage={organizationPage}
      organization={organization}
    >
      <SidebarLayout sidebarContent={null} flexDirection="rowReverse">
        <Stack space={2}>
          <Text variant="h1" as="h1">
            Reiknivél lífeyris {calculationYear}
          </Text>
          <Box>
            <Text>
              Vinsamlega hafðu í huga að reiknivélin reiknar greiðslur miðað við
              þær forsendur sem þú gefur upp.
            </Text>
            <Text>
              Líkanið er einungis til leiðbeiningar en veitir ekki bindandi
              upplýsingar um endanlega afgreiðslu máls eða greiðslufjárhæðir
            </Text>
          </Box>
          <Inline alignY="center" justifyContent="spaceBetween" space={5}>
            <Text variant="h2" as="h2">
              Samtals greiðslur frá TR eftir skatt
            </Text>
            <LinkV2 href={linkResolver('pensioncalculator').href}>
              <Button unfocusable={true} size="small">
                Breyta forsendum
              </Button>
            </LinkV2>
          </Inline>
          <Inline space={8}>
            <Box textAlign="right">
              <Text variant="h3">
                {formatCurrency(totalAfterTax?.monthlyAmount)}
              </Text>
              <Text>á mánuði</Text>
            </Box>
            {/* TODO: add line */}
            <Box textAlign="right">
              <Text variant="h3">
                {formatCurrency(totalAfterTax?.yearlyAmount)}
              </Text>
              <Text>á ári</Text>
            </Box>
          </Inline>

          <Accordion>
            <AccordionItem id="sundurlidun" label="Sundurliðun">
              <Stack space={3}>
                <Box display="flex" justifyContent="flexEnd">
                  <Button icon="print" variant="utility" onClick={window.print}>
                    Prenta
                  </Button>
                </Box>
                <Table.Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeadData>
                        Greiðslur frá Tryggingastofnun
                      </Table.HeadData>
                      <Table.HeadData>á mánuði</Table.HeadData>
                      <Table.HeadData>á ári</Table.HeadData>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {calculation.items.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Data>{item.name}</Table.Data>
                        <Table.Data>
                          <Text>{formatCurrency(item.monthlyAmount)}</Text>
                        </Table.Data>
                        <Table.Data>
                          <Text>{formatCurrency(item.yearlyAmount)}</Text>
                        </Table.Data>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Table>
              </Stack>
            </AccordionItem>
          </Accordion>
        </Stack>
      </SidebarLayout>
    </PensionCalculatorWrapper>
  )
}

PensionCalculatorResults.getProps = async ({ apolloClient, locale, query }) => {
  const benefitsFromMunicipality = parseAsInteger.parseServerSide(
    query.benefitsFromMunicipality,
  )
  const capitalIncome = parseAsInteger.parseServerSide(query.capitalIncome)
  const childCount = parseAsInteger.parseServerSide(query.childCount)
  const childSupportCount = parseAsInteger.parseServerSide(
    query.childSupportCount,
  )
  const dateOfCalculations = parseAsIsoDateTime.parseServerSide(
    query.dateOfCalculations,
  )
  const foreignBasicPension = parseAsInteger.parseServerSide(
    query.foreignBasicPension,
  )
  const hasSpouse = parseAsBoolean.parseServerSide(query.hasSpouse)
  const income = parseAsInteger.parseServerSide(query.income)
  const otherIncome = parseAsInteger.parseServerSide(query.otherIncome)
  const livingCondition = parseAsStringEnum(
    Object.values(SocialInsurancePensionCalculationLivingCondition),
  ).parseServerSide(query.livingCondition)
  const livingConditionAbroadInYears = parseAsInteger.parseServerSide(
    query.livingConditionAbroadInYears,
  )
  const taxCard = parseAsInteger.parseServerSide(query.taxCard)
  const mobilityImpairment = parseAsBoolean.parseServerSide(
    query.mobilityImpairment,
  )
  const ageOfFirst75DisabilityAssessment = parseAsInteger.parseServerSide(
    query.ageOfFirst75DisabilityAssessment,
  )
  const pensionPayments = parseAsInteger.parseServerSide(query.pensionPayments)
  const premium = parseAsInteger.parseServerSide(query.premium)
  const privatePensionPayments = parseAsInteger.parseServerSide(
    query.privatePensionPayments,
  )
  const typeOfPeriodIncome = parseAsStringEnum(
    Object.values(SocialInsurancePensionCalculationPeriodIncomeType),
  ).parseServerSide(query.typeOfPeriodIncome)
  const typeOfBasePension = parseAsStringEnum(
    Object.values(SocialInsurancePensionCalculationBasePensionType),
  ).parseServerSide(query.typeOfBasePension)
  const birthdate = parseAsIsoDateTime.parseServerSide(query.birthdate)
  const startDate = parseAsIsoDateTime.parseServerSide(query.startDate)

  const slug =
    locale === 'is' ? 'tryggingastofnun' : 'social-insurance-administration'

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    {
      data: { getPensionCalculation },
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
    apolloClient.query<Query, QueryGetPensionCalculationArgs>({
      query: GET_PENSION_CALCULATION,
      variables: {
        input: {
          capitalIncome,
          benefitsFromMunicipality,
          childCount,
          childSupportCount,
          dateOfCalculations,
          foreignBasicPension,
          hasSpouse,
          income,
          livingCondition,
          livingConditionAbroadInYears,
          otherIncome,
          mobilityImpairment,
          pensionPayments,
          premium,
          privatePensionPayments,
          taxCard,
          typeOfPeriodIncome,
          typeOfBasePension,
          ageOfFirst75DisabilityAssessment,
          birthdate: birthdate as Date, // TODO: validate that this is not null
          startDate: startDate as Date, // TODO: validate that this is not null
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
    calculation: getPensionCalculation,
    calculationYear: dateOfCalculations?.getFullYear(),
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(PensionCalculatorResults)
