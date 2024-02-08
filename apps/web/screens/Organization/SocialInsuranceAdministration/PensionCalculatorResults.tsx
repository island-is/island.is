import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
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
  SocialInsurancePensionCalculationInput,
  SocialInsurancePensionCalculationResponse,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { formatCurrency } from '@island.is/web/utils/currency'

import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { GET_PENSION_CALCULATION } from '../../queries/PensionCalculator'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'
import {
  convertQueryParametersToCalculationInput,
  convertToQueryParams,
} from './utils'
import * as styles from './PensionCalculatorResults.css'

interface PensionCalculatorResultsProps {
  organizationPage: OrganizationPage
  organization: Organization
  calculation: SocialInsurancePensionCalculationResponse
  calculationYear?: number
  calculationInput: SocialInsurancePensionCalculationInput
  queryParamString: string
}

const PensionCalculatorResults: Screen<PensionCalculatorResultsProps> = ({
  organizationPage,
  organization,
  calculation,
  calculationInput,
  queryParamString,
}) => {
  const { linkResolver } = useLinkResolver() // TODO: add query params to pensioncalculator button

  const totalAfterTax = calculation.items.find((item) =>
    item.name?.includes('Samtals frá TR eftir skatt'),
  )

  const perMonthText = 'á mánuði'
  const perYearText = 'á ári'
  const title = `Reiknivél lífeyris`

  const calculationIsPresent = calculation.items.length > 0

  return (
    <PensionCalculatorWrapper
      organizationPage={organizationPage}
      organization={organization}
      ogTitle={title}
      ogImageUrl={organizationPage.featuredImage?.url}
    >
      <GridContainer>
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '1/9']}
            className={styles.fullWidth}
          >
            <Box paddingY={5}>
              <Stack space={5}>
                <Stack space={2}>
                  <Text variant="h1" as="h1">
                    {title}
                  </Text>
                  <Box className={styles.textMaxWidth}>
                    <Text>
                      Vinsamlega hafðu í huga að reiknivélin reiknar greiðslur
                      miðað við þær forsendur sem þú gefur upp. Líkanið er
                      einungis til leiðbeiningar en veitir ekki bindandi
                      upplýsingar um endanlega afgreiðslu máls eða
                      greiðslufjárhæðir
                    </Text>
                  </Box>
                </Stack>
                <Inline alignY="center" justifyContent="spaceBetween" space={5}>
                  {totalAfterTax && (
                    <Text variant="h2" as="h2">
                      Samtals greiðslur frá TR eftir skatt
                    </Text>
                  )}
                  {!totalAfterTax && <Box />}
                  <LinkV2
                    href={`${
                      linkResolver('pensioncalculator').href
                    }?${queryParamString}`}
                  >
                    <Button unfocusable={true} size="small">
                      Breyta forsendum
                    </Button>
                  </LinkV2>
                </Inline>
                {totalAfterTax && (
                  <Box display="flex" paddingLeft={5}>
                    <Box textAlign="right" paddingTop={2} paddingRight={4}>
                      <Text variant="h3">
                        {formatCurrency(totalAfterTax?.monthlyAmount)}
                      </Text>
                      <Text>{perMonthText}</Text>
                    </Box>
                    <Box>
                      <Box className={styles.line} />
                    </Box>
                    <Box textAlign="right" paddingTop={2} paddingLeft={5}>
                      <Text variant="h3">
                        {formatCurrency(totalAfterTax?.yearlyAmount)}
                      </Text>
                      <Text>{perYearText}</Text>
                    </Box>
                  </Box>
                )}

                {!calculationIsPresent && (
                  <AlertMessage
                    type="warning"
                    message="Ekki tókst sækja útreikning miðað við gefnar forsendur"
                  />
                )}

                {calculationIsPresent && (
                  <Accordion dividerOnTop={false}>
                    <AccordionItem
                      startExpanded={!totalAfterTax}
                      id="sundurlidun"
                      label="Sundurliðun"
                    >
                      <Stack space={3}>
                        <Box display="flex" justifyContent="flexEnd">
                          <Button
                            icon="print"
                            variant="utility"
                            onClick={() => {
                              window.print()
                            }}
                          >
                            Prenta
                          </Button>
                        </Box>
                        <Table.Table>
                          <Table.Head>
                            <Table.Row>
                              <Table.HeadData>
                                Greiðslur frá Tryggingastofnun
                              </Table.HeadData>
                              <Table.HeadData>{perMonthText}</Table.HeadData>
                              <Table.HeadData>{perYearText}</Table.HeadData>
                            </Table.Row>
                          </Table.Head>
                          <Table.Body>
                            {calculation.items.map((item, index) => (
                              <Table.Row key={index}>
                                <Table.Data>
                                  <Text>{item.name}</Text>
                                </Table.Data>
                                <Table.Data>
                                  <Text>
                                    {formatCurrency(item.monthlyAmount)}
                                  </Text>
                                </Table.Data>
                                <Table.Data>
                                  <Text>
                                    {formatCurrency(item.yearlyAmount)}
                                  </Text>
                                </Table.Data>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Table>
                      </Stack>
                    </AccordionItem>
                  </Accordion>
                )}
              </Stack>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </PensionCalculatorWrapper>
  )
}

PensionCalculatorResults.getProps = async ({ apolloClient, locale, query }) => {
  const calculationInput = convertQueryParametersToCalculationInput(query)

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
        input: calculationInput,
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

  const queryParams = convertToQueryParams(calculationInput)

  return {
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    calculation: getPensionCalculation,
    calculationInput,
    queryParamString: queryParams.toString(),
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(PensionCalculatorResults)
