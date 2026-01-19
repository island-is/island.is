import { Fragment, useMemo, useState } from 'react'
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
  SocialInsurancePensionCalculationBasePensionType,
  SocialInsurancePensionCalculationInput,
  SocialInsurancePensionCalculationResponse,
  SocialInsurancePensionCalculationResponseItem,
  SocialInsurancePensionCalculationResponseItemGroup,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { formatCurrency } from '@island.is/web/utils/currency'
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { GET_PENSION_CALCULATION } from '../../queries/PensionCalculator'
import { PensionCalculatorTitle } from './PensionCalculatorTitle'
import { PensionCalculatorWrapper } from './PensionCalculatorWrapper'
import { translationStrings } from './translationStrings'
import {
  convertQueryParametersToCalculationInput,
  convertToQueryParams,
  extractSlug,
  getDateOfCalculationsOptions,
  is2025FormPreviewActive,
  is2025PreviewActive,
  NEW_SYSTEM_TAKES_PLACE_DATE,
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
  topHeadingText?: string
  topHeadingLevel?: 2 | 3
}

const HighlightedItems = ({
  highlightedItems,
  customPageData,
  topHeadingText,
  topHeadingLevel = 3,
}: HighlightedItemsProps) => {
  const { formatMessage } = useIntl()

  const highlightedItemPresent = highlightedItems.length > 0
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

        const titleAs: TextProps['as'] = (index === 0
          ? `h${topHeadingLevel}`
          : `h${topHeadingLevel + 1}`) as unknown as TextProps['as']

        const titleVariant: TextProps['variant'] = (index === 0
          ? `h${topHeadingLevel + 1}`
          : `h${topHeadingLevel + 2}`) as unknown as TextProps['variant']

        const numericVariant: TextProps['variant'] =
          index === 0 ? 'h5' : 'medium'

        if (index === 0 && topHeadingText) {
          highlightedItemName = topHeadingText
        }

        return (
          <Stack key={index} space={2}>
            <Inline alignY="center" justifyContent="spaceBetween" space={5}>
              {highlightedItemPresent && (
                <Text variant={titleVariant} as={titleAs}>
                  {highlightedItemName}
                </Text>
              )}
              {!highlightedItemPresent && <Box />}
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
  calculation2025: SocialInsurancePensionCalculationResponse
  calculationInput: SocialInsurancePensionCalculationInput
  queryParamString: string
  dateOfCalculationsOptions: Option<string>[]
}

const PensionCalculatorResults: CustomScreen<PensionCalculatorResultsProps> = ({
  organizationPage,
  organization,
  calculation,
  calculation2025,
  calculationInput,
  queryParamString,
  dateOfCalculationsOptions,
  customPageData,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const highlightedItems = calculation.highlightedItems ?? []

  const highlightedItems2025 = calculation2025.highlightedItems ?? []

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
    calculationInput.dateOfCalculations ===
      NEW_SYSTEM_TAKES_PLACE_DATE.toISOString()

  const title = `${formatMessage(
    isNewSystemActive
      ? translationStrings.form2025PreviewMainTitle
      : translationStrings.mainTitle,
  )}`
  const titlePostfix = `${(
    allCalculatorsOptions.find(
      (o) => o.value === calculationInput.dateOfCalculations,
    )?.label ?? dateOfCalculationsOptions[0].label
  ).toLowerCase()}`

  const titleVariant = isNewSystemActive ? 'h2' : 'h1'

  const calculationIsPresent =
    typeof calculation.groups?.length === 'number' &&
    calculation.groups.length > 0

  const calculation2025IsPresent =
    typeof calculation2025.groups?.length === 'number' &&
    calculation2025.groups.length > 0

  const highlightedItemPresent = highlightedItems.length > 0
  const highlighted2025ItemIsPresent =
    highlightedItems2025.length > 0 &&
    is2025PreviewActive(customPageData) &&
    calculationInput.dateOfCalculations &&
    new Date(calculationInput.dateOfCalculations).getFullYear() >= 2024

  const isTurnedOff = customPageData?.configJson?.isTurnedOff ?? false

  const changeAssumtionsHref = `${
    linkResolver('pensioncalculator').href
  }?${queryParamString}`

  const [showDisabilityChangesIn2025, setShowDisabilityChangesIn2025] =
    useState(false)

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
                      <PensionCalculatorTitle
                        isNewSystemActive={isNewSystemActive}
                        title={title}
                        titlePostfix={titlePostfix}
                        titleVariant={titleVariant}
                      />
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
                        <PensionCalculatorTitle
                          isNewSystemActive={isNewSystemActive}
                          title={title}
                          titlePostfix={titlePostfix}
                          titleVariant={titleVariant}
                        />
                        <Box className={styles.textMaxWidth}>
                          <Text>
                            {formatMessage(
                              highlighted2025ItemIsPresent
                                ? translationStrings.result2025Disclaimer
                                : translationStrings.resultDisclaimer,
                            )}
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
                      {highlightedItemPresent && (
                        <Stack space={2}>
                          {highlighted2025ItemIsPresent &&
                            calculationInput.typeOfBasePension ===
                              SocialInsurancePensionCalculationBasePensionType.Disability && (
                              <Text as="h2" variant="h3">
                                {formatMessage(
                                  translationStrings.highlightedResult2025ItemHeading,
                                )}
                              </Text>
                            )}
                          <Box className={styles.highlightedItemsContainer}>
                            <HighlightedItems
                              customPageData={customPageData}
                              highlightedItems={highlightedItems}
                              topHeadingLevel={
                                highlighted2025ItemIsPresent &&
                                calculationInput.typeOfBasePension ===
                                  SocialInsurancePensionCalculationBasePensionType.Disability
                                  ? 3
                                  : 2
                              }
                              topHeadingText={
                                highlighted2025ItemIsPresent &&
                                calculationInput.typeOfBasePension ===
                                  SocialInsurancePensionCalculationBasePensionType.Disability
                                  ? String(
                                      new Date(
                                        calculationInput.dateOfCalculations ||
                                          new Date().toISOString(),
                                      ).getFullYear(),
                                    )
                                  : ''
                              }
                            />

                            {calculationInput.typeOfBasePension ===
                              SocialInsurancePensionCalculationBasePensionType.Disability &&
                              highlighted2025ItemIsPresent && (
                                <Box className={styles.longLine} />
                              )}

                            {showDisabilityChangesIn2025 &&
                              highlighted2025ItemIsPresent && (
                                <HighlightedItems
                                  customPageData={customPageData}
                                  highlightedItems={highlightedItems2025}
                                  topHeadingText={formatMessage(
                                    translationStrings.after1stSeptember2025,
                                  )}
                                  topHeadingLevel={
                                    calculationInput.typeOfBasePension ===
                                    SocialInsurancePensionCalculationBasePensionType.Disability
                                      ? 3
                                      : 2
                                  }
                                />
                              )}

                            {calculationInput.typeOfBasePension ===
                              SocialInsurancePensionCalculationBasePensionType.Disability &&
                              !showDisabilityChangesIn2025 &&
                              highlighted2025ItemIsPresent && (
                                <Stack space={3}>
                                  <Text variant="h4" as="h3">
                                    {formatMessage(
                                      translationStrings.after1stSeptember2025,
                                    )}
                                  </Text>
                                  <Inline space={3} alignY="center">
                                    <img
                                      width="80px"
                                      height="80px"
                                      src={formatMessage(
                                        translationStrings.results2025ImageUrl,
                                      )}
                                      alt=""
                                    />
                                    {
                                      <Box className={styles.text2025Container}>
                                        <Text>
                                          {formatMessage(
                                            translationStrings.after1stSeptember2025Description,
                                          )}
                                        </Text>
                                      </Box>
                                    }
                                  </Inline>
                                  <Button
                                    onClick={() => {
                                      setShowDisabilityChangesIn2025(true)
                                    }}
                                    variant="ghost"
                                    size="small"
                                  >
                                    {formatMessage(
                                      translationStrings.after1stSeptember2025Calculate,
                                    )}
                                  </Button>
                                </Stack>
                              )}
                          </Box>
                        </Stack>
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
                            startExpanded={!highlightedItemPresent}
                            id="resultDetails"
                            labelVariant="h3"
                            labelUse="h3"
                            label={formatMessage(
                              highlighted2025ItemIsPresent &&
                                calculationInput.typeOfBasePension ===
                                  SocialInsurancePensionCalculationBasePensionType.Disability
                                ? translationStrings.resultDetails2024Label
                                : translationStrings.resultDetailsLabel,
                            )}
                          >
                            <Box>
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
                          {calculation2025IsPresent &&
                            showDisabilityChangesIn2025 && (
                              <AccordionItem
                                startExpanded={false}
                                id="resultDetails"
                                labelVariant="h3"
                                labelUse="h3"
                                label={formatMessage(
                                  translationStrings.result2025DetailsLabel,
                                )}
                              >
                                <ResultTable groups={calculation2025.groups} />
                              </AccordionItem>
                            )}
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
              <Text>
                {highlighted2025ItemIsPresent
                  ? formatMessage(translationStrings.result2025Disclaimer)
                  : formatMessage(translationStrings.resultDisclaimer)}
              </Text>
            </Box>
          </Stack>
          {highlightedItemPresent && (
            <HighlightedItems
              customPageData={customPageData}
              highlightedItems={highlightedItems}
              topHeadingText={
                highlighted2025ItemIsPresent &&
                calculationInput.typeOfBasePension ===
                  SocialInsurancePensionCalculationBasePensionType.Disability
                  ? String(
                      new Date(
                        calculationInput.dateOfCalculations ||
                          new Date().toISOString(),
                      ).getFullYear(),
                    )
                  : ''
              }
              topHeadingLevel={
                highlighted2025ItemIsPresent &&
                calculationInput.typeOfBasePension ===
                  SocialInsurancePensionCalculationBasePensionType.Disability
                  ? 3
                  : 2
              }
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

const isSameYear = (
  date1: string | null | undefined,
  date2: string | null | undefined,
) => {
  if (!date1 || !date2) return false
  return new Date(date1).getFullYear() === new Date(date2).getFullYear()
}

PensionCalculatorResults.getProps = async ({
  apolloClient,
  locale,
  query,
  customPageData,
}) => {
  const calculationInput = convertQueryParametersToCalculationInput(query)
  const slug = extractSlug(locale, customPageData)
  const dateOfCalculationsOptions = getDateOfCalculationsOptions(customPageData)
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
      data: { getPensionCalculation: getPensionCalculation2025 },
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
    apolloClient.query<Query, QueryGetPensionCalculationArgs>({
      query: GET_PENSION_CALCULATION,
      variables: {
        input: calculationInput,
      },
    }),
    calculationInput.typeOfBasePension ===
      SocialInsurancePensionCalculationBasePensionType.Disability &&
    is2025PreviewActive(customPageData) &&
    isSameYear(
      dateOfCalculationsOptions?.[0]?.value,
      calculationInput.dateOfCalculations,
    )
      ? apolloClient.query<Query, QueryGetPensionCalculationArgs>({
          query: GET_PENSION_CALCULATION,
          variables: {
            input: {
              ...calculationInput,
              dateOfCalculations: new Date(2025, 8, 1).toISOString(),
              typeOfBasePension:
                SocialInsurancePensionCalculationBasePensionType.NewSystem,
            },
          },
        })
      : {
          data: {
            getPensionCalculation: {
              groups: [],
              highlightedItems: [],
            },
          },
        },
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
  const queryParamsObject = Object.fromEntries(queryParams)

  const organizationNamespace =
    extractNamespaceFromOrganization(getOrganization)

  return {
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    calculation: getPensionCalculation,
    calculation2025: getPensionCalculation2025,
    calculationInput,
    dateOfCalculationsOptions,
    queryParamString: queryParams.toString(),
    customTopLoginButtonItem: organizationNamespace?.customTopLoginButtonItem,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
    languageToggleQueryParams: {
      is: queryParamsObject,
      en: queryParamsObject,
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    UniqueIdentifier.PensionCalculator,
    PensionCalculatorResults,
  ),
)
