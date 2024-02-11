import { Fragment, useMemo } from 'react'

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
  Option,
  Stack,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { getThemeConfig } from '@island.is/web/components'
import {
  CustomPage,
  Organization,
  OrganizationPage,
  Query,
  QueryGetCustomPageArgs,
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
import { GET_CUSTOM_PAGE_QUERY } from '../../queries/CustomPage'
import { GET_PENSION_CALCULATION } from '../../queries/PensionCalculator'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'
import {
  convertQueryParametersToCalculationInput,
  convertToQueryParams,
  getDateOfCalculationsOptions,
} from './utils'
import * as styles from './PensionCalculatorResults.css'

interface PensionCalculatorResultsProps {
  organizationPage: OrganizationPage
  organization: Organization
  calculation: SocialInsurancePensionCalculationResponse
  calculationYear?: number
  calculationInput: SocialInsurancePensionCalculationInput
  queryParamString: string
  pageData?: CustomPage | null
}

const PensionCalculatorResults: Screen<PensionCalculatorResultsProps> = ({
  organizationPage,
  organization,
  calculation,
  calculationInput,
  pageData,
  queryParamString,
}) => {
  const { linkResolver } = useLinkResolver()
  const dateOfCalculationsOptions = useMemo<Option<string>[]>(() => {
    return getDateOfCalculationsOptions(pageData)
  }, [pageData])

  const highlightedItem = calculation.highlightedItem

  const perMonthText = 'á mánuði'
  const perYearText = 'á ári'
  const title = `Reiknivél lífeyris ${
    dateOfCalculationsOptions.find(
      (o) => o.value === calculationInput.dateOfCalculations,
    )?.label ?? ''
  }`

  const calculationIsPresent = calculation.groups.length > 0

  return (
    <PensionCalculatorWrapper
      organizationPage={organizationPage}
      organization={organization}
      ogTitle={title}
      ogImageUrl={organizationPage.featuredImage?.url}
      indexableBySearchEngine={false}
    >
      <GridContainer>
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '1/9']}
            className={styles.fullWidth}
          >
            <Box paddingY={6}>
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
                  {highlightedItem && (
                    <Text variant="h2" as="h2">
                      Samtals greiðslur frá TR eftir skatt
                    </Text>
                  )}
                  {!highlightedItem && <Box />}
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
                {highlightedItem && (
                  <Box display="flex" paddingLeft={5}>
                    <Box textAlign="right" paddingTop={2} paddingRight={4}>
                      <Text variant="h3">
                        {formatCurrency(highlightedItem?.monthlyAmount)}
                      </Text>
                      <Text>{perMonthText}</Text>
                    </Box>
                    <Box>
                      <Box className={styles.line} />
                    </Box>
                    <Box textAlign="right" paddingTop={2} paddingLeft={5}>
                      <Text variant="h3">
                        {formatCurrency(highlightedItem?.yearlyAmount)}
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
                      startExpanded={!highlightedItem}
                      id="sundurlidun"
                      label="Sundurliðun"
                    >
                      <Box paddingBottom={3}>
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
                            {calculation.groups.map((group, groupIndex) => (
                              <Fragment key={groupIndex}>
                                <Table.Body>
                                  {group.name && (
                                    <Table.Row>
                                      <Table.HeadData>
                                        {group.name}
                                      </Table.HeadData>
                                      <Table.HeadData>
                                        {perMonthText}
                                      </Table.HeadData>
                                      <Table.HeadData>
                                        {perYearText}
                                      </Table.HeadData>
                                    </Table.Row>
                                  )}
                                  {group.items.map((item, itemIndex) => {
                                    const isLastItem =
                                      itemIndex === group.items.length - 1
                                    const fontWeight = isLastItem
                                      ? 'semiBold'
                                      : undefined
                                    return (
                                      <Table.Row key={itemIndex}>
                                        <Table.Data>
                                          <Text fontWeight={fontWeight}>
                                            {item.name}
                                          </Text>
                                        </Table.Data>
                                        <Table.Data>
                                          <Text fontWeight={fontWeight}>
                                            {formatCurrency(item.monthlyAmount)}
                                          </Text>
                                        </Table.Data>
                                        <Table.Data>
                                          <Text fontWeight={fontWeight}>
                                            {formatCurrency(item.yearlyAmount)}
                                          </Text>
                                        </Table.Data>
                                      </Table.Row>
                                    )
                                  })}
                                </Table.Body>
                              </Fragment>
                            ))}
                          </Table.Table>
                        </Stack>
                      </Box>
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
    {
      data: { getCustomPage },
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
    apolloClient.query<Query, QueryGetCustomPageArgs>({
      query: GET_CUSTOM_PAGE_QUERY,
      variables: {
        input: {
          uniqueIdentifier: 'PensionCalculator', // TODO: perhaps this value can be typesafe?
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

  const queryParams = convertToQueryParams(calculationInput)

  return {
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    calculation: getPensionCalculation,
    calculationInput,
    queryParamString: queryParams.toString(),
    pageData: getCustomPage,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(PensionCalculatorResults)
