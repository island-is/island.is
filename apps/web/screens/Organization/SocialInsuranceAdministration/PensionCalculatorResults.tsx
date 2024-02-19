import { Fragment } from 'react'
import { useIntl } from 'react-intl'

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
  CustomPageUniqueIdentifier as UniqueIdentifier,
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
import { CustomNextError } from '@island.is/web/units/errors'
import { formatCurrency } from '@island.is/web/utils/currency'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { GET_PENSION_CALCULATION } from '../../queries/PensionCalculator'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'
import { translationStrings } from './translationStrings'
import {
  convertQueryParametersToCalculationInput,
  convertToQueryParams,
  extractSlug,
  getDateOfCalculationsOptions,
} from './utils'
import * as styles from './PensionCalculatorResults.css'

interface PensionCalculatorResultsProps {
  organizationPage: OrganizationPage
  organization: Organization
  calculation: SocialInsurancePensionCalculationResponse
  calculationInput: SocialInsurancePensionCalculationInput
  queryParamString: string
  dateOfCalculationsOptions: Option<string>[]
}

const PensionCalculatorResults: CustomScreen<PensionCalculatorResultsProps> = ({
  organizationPage,
  organization,
  calculation,
  calculationInput,
  queryParamString,
  dateOfCalculationsOptions,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const highlightedItem = calculation.highlightedItem

  const perMonthText = formatMessage(translationStrings.perMonth)
  const perYearText = formatMessage(translationStrings.perYear)
  const title = `${formatMessage(translationStrings.mainTitle)} ${
    dateOfCalculationsOptions.find(
      (o) => o.value === calculationInput.dateOfCalculations,
    )?.label ?? ''
  }`

  const calculationIsPresent =
    typeof calculation.groups?.length === 'number' &&
    calculation.groups.length > 0

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
                      {formatMessage(translationStrings.resultDisclaimer)}
                    </Text>
                  </Box>
                </Stack>
                <Inline alignY="center" justifyContent="spaceBetween" space={5}>
                  {highlightedItem && (
                    <Text variant="h2" as="h2">
                      {formatMessage(
                        translationStrings.highlightedResultItemHeading,
                      )}
                    </Text>
                  )}
                  {!highlightedItem && <Box />}
                  <LinkV2
                    href={`${
                      linkResolver('pensioncalculator').href
                    }?${queryParamString}`}
                  >
                    <Button unfocusable={true} size="small">
                      {formatMessage(translationStrings.changeAssumptions)}
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
                    message={formatMessage(
                      translationStrings.noResultsCanBeShown,
                    )}
                  />
                )}

                {calculationIsPresent && (
                  <Accordion dividerOnTop={false}>
                    <AccordionItem
                      startExpanded={!highlightedItem}
                      id="resultDetails"
                      label={formatMessage(
                        translationStrings.resultDetailsLabel,
                      )}
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
                              {formatMessage(translationStrings.print)}
                            </Button>
                          </Box>
                          <Table.Table>
                            {calculation.groups?.map((group, groupIndex) => (
                              <Fragment key={groupIndex}>
                                <Table.Body>
                                  {group.name && (
                                    <Table.Row>
                                      <Table.HeadData>
                                        {group.name in translationStrings
                                          ? formatMessage(
                                              translationStrings[
                                                group.name as keyof typeof translationStrings
                                              ],
                                            )
                                          : group.name}
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
                                    let itemName = item?.name
                                    if (
                                      itemName &&
                                      itemName in translationStrings
                                    ) {
                                      itemName = formatMessage(
                                        translationStrings[
                                          itemName as keyof typeof translationStrings
                                        ],
                                      )
                                    }
                                    return (
                                      <Table.Row key={itemIndex}>
                                        <Table.Data>
                                          <Text fontWeight={fontWeight}>
                                            {itemName}
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

PensionCalculatorResults.getProps = async ({
  apolloClient,
  locale,
  query,
  customPageData,
}) => {
  const calculationInput = convertQueryParametersToCalculationInput(query)
  const slug = extractSlug(locale, customPageData)

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
    dateOfCalculationsOptions: getDateOfCalculationsOptions(customPageData),
    queryParamString: queryParams.toString(),
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    UniqueIdentifier.PensionCalculator,
    PensionCalculatorResults,
  ),
)
