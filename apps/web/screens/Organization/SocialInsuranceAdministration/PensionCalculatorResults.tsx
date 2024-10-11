import { Fragment, ReactNode } from 'react'
import { useIntl } from 'react-intl'

import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  BoxProps,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Inline,
  LinkV2,
  Option,
  Stack,
  Table,
  Text,
  TextProps,
} from '@island.is/island-ui/core'
import { getThemeConfig } from '@island.is/web/components'
import {
  CustomPage,
  CustomPageUniqueIdentifier as UniqueIdentifier,
  Organization,
  OrganizationPage,
  Query,
  QueryGetOrganizationArgs,
  QueryGetOrganizationPageArgs,
  QueryGetPensionCalculationArgs,
  SocialInsurancePensionCalculationInput,
  SocialInsurancePensionCalculationResponse,
  SocialInsurancePensionCalculationResponseItem,
  SocialInsurancePensionCalculationResponseItemGroup,
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

const ChangeAssumptionsButton = ({ href }: { href: string }) => {
  const { formatMessage } = useIntl()
  return (
    <LinkV2 href={href}>
      <Button unfocusable={true} variant="text" preTextIcon="arrowBack">
        {formatMessage(translationStrings.changeAssumptions)}
      </Button>
    </LinkV2>
  )
}

interface HighlightedItemsProps {
  highlightedItems: SocialInsurancePensionCalculationResponseItem[]
  customPageData: CustomPage | null | undefined
}

const HighlightedItems = ({
  highlightedItems,
  customPageData,
}: HighlightedItemsProps) => {
  const { formatMessage } = useIntl()

  const higlightedItemIsPresent = highlightedItems.length > 0
  const perMonthText = formatMessage(translationStrings.perMonth)
  const perYearText = formatMessage(translationStrings.perYear)

  return (
    <Stack space={5}>
      {highlightedItems.map((highlightedItem, index) => {
        let highlightedItemName =
          highlightedItem?.name && highlightedItem?.name in translationStrings
            ? formatMessage(
                translationStrings[
                  highlightedItem?.name as keyof typeof translationStrings
                ],
              )
            : highlightedItem?.name

        if (
          index > 0 &&
          highlightedItem?.name ===
            (customPageData?.configJson?.totalFromTrAfterTaxKey ??
              'REIKNH.SAMTALSTREFTIRSK')
        ) {
          highlightedItemName = formatMessage(
            translationStrings.highlighedResultItemHeadingForTotalAfterTaxFromTR,
          )
        }

        const titleVariant: TextProps['variant'] = index === 0 ? 'h3' : 'h4'

        const numericVariant: TextProps['variant'] =
          index === 0 ? 'h5' : 'medium'

        return (
          <Stack key={index} space={2}>
            <Inline alignY="center" justifyContent="spaceBetween" space={5}>
              {higlightedItemIsPresent && (
                <Text variant={titleVariant} as="h2">
                  {highlightedItemName}
                </Text>
              )}
              {!higlightedItemIsPresent && <Box />}
            </Inline>

            <Box className={styles.grid}>
              <Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  rowGap={1}
                  className={styles.fitContent}
                >
                  <Box>
                    <Text variant={numericVariant}>
                      {formatCurrency(highlightedItem?.monthlyAmount)}
                    </Text>
                  </Box>
                  <Box className={styles.alignSelfToFlexEnd}>
                    <Text variant="small">{perMonthText}</Text>
                  </Box>
                </Box>
              </Box>

              <Box className={styles.line} />

              <Box paddingLeft={4}>
                <Box
                  display="flex"
                  flexDirection="column"
                  rowGap={1}
                  className={styles.fitContent}
                >
                  <Box>
                    <Text variant={numericVariant}>
                      {formatCurrency(highlightedItem?.yearlyAmount)}
                    </Text>
                  </Box>
                  <Box className={styles.alignSelfToFlexEnd}>
                    <Text variant="small">{perYearText}</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        )
      })}
    </Stack>
  )
}

interface ResultTableProps {
  groups?: SocialInsurancePensionCalculationResponseItemGroup[] | null
  /** Set this to true for less padding in the table cells */
  dense?: boolean
}

const ResultTable = ({ groups, dense = false }: ResultTableProps) => {
  const { formatMessage } = useIntl()
  const perMonthText = formatMessage(translationStrings.perMonth)
  const perYearText = formatMessage(translationStrings.perYear)

  const cellProps: BoxProps | undefined = dense
    ? { paddingBottom: 0, paddingTop: 0 }
    : undefined

  return (
    <Table.Table>
      {groups?.map((group, groupIndex) => (
        <Fragment key={groupIndex}>
          <Table.Body>
            {group.name && (
              <Table.Row>
                <Table.HeadData box={cellProps}>
                  {group.name in translationStrings
                    ? formatMessage(
                        translationStrings[
                          group.name as keyof typeof translationStrings
                        ],
                      )
                    : group.name}
                </Table.HeadData>
                <Table.HeadData box={cellProps}>{perMonthText}</Table.HeadData>
                <Table.HeadData box={cellProps}>{perYearText}</Table.HeadData>
              </Table.Row>
            )}
            {group.items.map((item, itemIndex) => {
              const isLastItem = itemIndex === group.items.length - 1
              const fontWeight = isLastItem ? 'semiBold' : undefined
              let itemName = item?.name
              if (itemName && itemName in translationStrings) {
                itemName = formatMessage(
                  translationStrings[
                    itemName as keyof typeof translationStrings
                  ],
                )
              }
              return (
                <Table.Row key={itemIndex}>
                  <Table.Data box={cellProps}>
                    <Text fontWeight={fontWeight}>{itemName}</Text>
                  </Table.Data>
                  <Table.Data box={cellProps}>
                    <Text fontWeight={fontWeight} whiteSpace="nowrap">
                      {formatCurrency(item.monthlyAmount)}
                    </Text>
                  </Table.Data>
                  <Table.Data box={cellProps}>
                    <Text fontWeight={fontWeight} whiteSpace="nowrap">
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
  )
}

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
  customPageData,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const highlightedItems = calculation.highlightedItems ?? []

  const title = `${formatMessage(translationStrings.mainTitle)} ${
    dateOfCalculationsOptions.find(
      (o) => o.value === calculationInput.dateOfCalculations,
    )?.label ?? ''
  }`

  const calculationIsPresent =
    typeof calculation.groups?.length === 'number' &&
    calculation.groups.length > 0

  const higlightedItemIsPresent = highlightedItems.length > 0

  const isTurnedOff = customPageData?.configJson?.isTurnedOff ?? false

  const changeAssumtionsHref = `${
    linkResolver('pensioncalculator').href
  }?${queryParamString}`

  return (
    <>
      <Box printHidden>
        <PensionCalculatorWrapper
          organizationPage={organizationPage}
          organization={organization}
          ogTitle={title}
          ogImageUrl={organizationPage.featuredImage?.url}
          indexableBySearchEngine={false}
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
                      <Text variant="h1" as="h1">
                        {title}
                      </Text>
                      <Text>
                        {formatMessage(translationStrings.isTurnedOff)}
                      </Text>
                    </Stack>
                  </Box>
                </GridColumn>
              </GridRow>
            </GridContainer>
          )}

          {!isTurnedOff && (
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
                      <Hidden print>
                        <Box
                          display="flex"
                          justifyContent={['flexStart', 'flexStart', 'flexEnd']}
                        >
                          <ChangeAssumptionsButton
                            href={changeAssumtionsHref}
                          />
                        </Box>
                      </Hidden>
                      {higlightedItemIsPresent && (
                        <HighlightedItems
                          customPageData={customPageData}
                          highlightedItems={highlightedItems}
                        />
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
                            startExpanded={!higlightedItemIsPresent}
                            id="resultDetails"
                            labelVariant="h3"
                            labelUse="h3"
                            label={formatMessage(
                              translationStrings.resultDetailsLabel,
                            )}
                          >
                            <Box paddingBottom={3}>
                              <Stack space={3}>
                                <Box display="flex" justifyContent="flexEnd">
                                  <Hidden print>
                                    <Button
                                      icon="print"
                                      variant="utility"
                                      onClick={() => {
                                        window.print()
                                      }}
                                    >
                                      {formatMessage(translationStrings.print)}
                                    </Button>
                                  </Hidden>
                                </Box>
                                <ResultTable groups={calculation.groups} />
                              </Stack>

                              <Hidden print>
                                <ChangeAssumptionsButton
                                  href={changeAssumtionsHref}
                                />
                              </Hidden>
                            </Box>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </Stack>
                  </Box>
                </GridColumn>
              </GridRow>
            </GridContainer>
          )}
        </PensionCalculatorWrapper>
      </Box>

      <Box paddingTop={3} className={styles.hiddenOnScreen}>
        <Stack space={3}>
          <Stack space={2}>
            <Text variant="h1" as="h1">
              {title}
            </Text>
            <Box className={styles.textMaxWidth}>
              <Text>{formatMessage(translationStrings.resultDisclaimer)}</Text>
            </Box>
          </Stack>
          {higlightedItemIsPresent && (
            <HighlightedItems
              customPageData={customPageData}
              highlightedItems={highlightedItems}
            />
          )}
          <Box paddingTop={2}>
            <ResultTable groups={calculation.groups} dense={true} />
          </Box>
        </Stack>
      </Box>
    </>
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
