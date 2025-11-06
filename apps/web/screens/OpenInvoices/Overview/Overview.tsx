import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import NextLink from 'next/link'
import { parseAsInteger, useQueryState } from 'next-usequerystate'

import {
  Accordion,
  AccordionItem,
  Box,
  Breadcrumbs,
  DatePicker,
  Divider,
  Filter,
  FilterInput,
  FilterMultiChoice,
  Pagination,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { CustomPageUniqueIdentifier } from '@island.is/shared/types'
import { Locale } from '@island.is/shared/types'
import { formatCurrency } from '@island.is/shared/utils'
import {
  CustomPageLayoutHeader,
  CustomPageLayoutWrapper,
  SortableTable,
} from '@island.is/web/components'
import { Query } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'

import { CustomScreen, withCustomPageWrapper } from '../../CustomPage'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { m } from '../messages'
import { getPaginatedMockData } from '../mocks/table'
import * as styles from './Overview.css'

const PAGE_SIZE = 12

const OpenInvoicesOverviewPage: CustomScreen<OpenInvoicesOverviewProps> = ({
  locale,
  customPageData,
}) => {
  useLocalLinkTypeResolver()
  useContentfulId(customPageData?.id)
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()
  const isTablet = width <= theme.breakpoints.lg

  const baseUrl = linkResolver('openinvoicesoverview', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.overview.title),
      href: baseUrl,
      isTag: true,
    },
  ]

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [query, setQuery] = useQueryState('query')

  const invoiceData = useMemo(
    () => getPaginatedMockData(page, PAGE_SIZE),
    [page],
  )

  const totalHits = useMemo(
    () => invoiceData?.pagination?.totalItems ?? 0,
    [invoiceData.pagination?.totalItems],
  )
  const totalPages = useMemo(
    () => invoiceData?.pagination?.totalPages ?? 0,
    [invoiceData.pagination?.totalPages],
  )

  return (
    <CustomPageLayoutWrapper
      pageTitle={formatMessage(m.overview.title)}
      pageDescription={formatMessage(m.overview.description)}
      pageFeaturedImage={formatMessage(m.overview.featuredImage)}
    >
      <CustomPageLayoutHeader
        title={formatMessage(m.home.title)}
        description={formatMessage(m.home.description)}
        featuredImage={{
          src:formatMessage(m.home.featuredImage),
          alt: formatMessage(m.home.featuredImageAlt),
        }}
        breadcrumbs={
          breadcrumbItems && (
            <Breadcrumbs
              items={breadcrumbItems ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href} legacyBehavior>
                    {link}
                  </NextLink>
                ) : (
                  link
                )
              }}
            />
          )
        }
      />

      <Box marginTop={12} background="blue100">
        <SidebarLayout
          fullWidthContent={true}
          sidebarContent={
            <Stack space={3}>
              <Text variant="h4" as="h4" paddingY={1}>
                {formatMessage(m.overview.searchTitle)}
              </Text>
              <FilterInput
                name="query"
                placeholder={formatMessage(m.overview.searchInputPlaceholder)}
                value={query ?? ''}
                onChange={(option) => setQuery(option)}
              />
              <Box
                component="form"
                borderRadius="large"
                action={baseUrl}
                onSubmit={(e) => {
                  e.preventDefault()
                }}
              >
                <Filter
                  labelClearAll={'clear all'}
                  labelOpen={'open'}
                  labelClose={'close'}
                  labelClear={'clear'}
                  labelTitle={'filter title'}
                  labelResult={'view results'}
                  resultCount={totalHits}
                  onFilterClear={() => null}
                  align={'right'}
                >
                  <Box borderRadius="large" background="white">
                    <Box paddingTop={1} paddingX={3}>
                      <Accordion
                        space={3}
                        dividerOnBottom={false}
                        dividerOnTop={false}
                        singleExpand
                      >
                        <AccordionItem
                          key="date-from"
                          id="date-from"
                          label="Tímabil"
                          labelUse="h5"
                          labelVariant="h5"
                          iconVariant="small"
                        >
                          <Stack space={2}>
                            <DatePicker
                              name="test"
                              backgroundColor="blue"
                              label="Dagsetning frá"
                              placeholderText={'fej'}
                              size="xs"
                            />
                            <DatePicker
                              backgroundColor="blue"
                              name="test2"
                              label="Dagsetning til"
                              placeholderText={'fej'}
                              size="xs"
                            />
                          </Stack>
                        </AccordionItem>
                      </Accordion>
                      <Divider />
                    </Box>
                    <FilterMultiChoice
                      labelClear={'clear'}
                      onChange={() => null}
                      onClear={() => null}
                      categories={[
                        {
                          id: 'type',
                          label: 'Tegund',
                          singleOption: true,
                          selected: [],
                          filters: [
                            {
                              value: 'test',
                              label: 'Test 1',
                            },
                            {
                              value: 'test2',
                              label: 'Test 2',
                            },
                          ],
                        },
                        {
                          id: 'sellers',
                          label: 'Seljendur',
                          selected: [],
                          filters: [
                            {
                              value: 'test1',
                              label: 'test 1',
                            },
                            {
                              value: 'test2',
                              label: 'test 2',
                            },
                          ],
                        },
                        {
                          id: 'buyers',
                          label: 'Kaupendur',
                          selected: [],
                          filters: [
                            {
                              value: 'test1',
                              label: 'test 1',
                            },
                            {
                              value: 'test2',
                              label: 'test 2',
                            },
                          ],
                        },
                      ]}
                    />
                  </Box>
                </Filter>
              </Box>
            </Stack>
          }
        >
          <Box display="flex">
            <Text fontWeight="semiBold">{totalHits + ' '}</Text>
            <Text> færslur fundust</Text>
          </Box>
          <Box background="white">
            <SortableTable
              labels={{
                seller: invoiceData.headers.seller,
                buyer: invoiceData.headers.buyer,
                amount: invoiceData.headers.amount,
              }}
              expandable
              align="left"
              defaultSortByKey="amount"
              items={invoiceData.rows.map((row, i) => {
                return {
                  id: `${row.buyer}-${i}`,
                  seller: row.seller,
                  buyer: row.buyer,
                  amount: formatCurrency(row.amount),
                  children:
                    row.subrows && row.subrows.length > 0 ? (
                      <Box>
                        {row?.subrows?.map((item, j) => (
                          <Box
                            paddingY={2}
                            paddingLeft={2}
                            key={item.id}
                            background="blue100"
                          >
                            <Box marginBottom={2} display="flex">
                              <Box marginRight={2}>
                                <Text variant="small" fontWeight="semiBold">
                                  {item.date.toLocaleDateString('IS')}
                                </Text>
                              </Box>
                              <Text variant="small">{item.id}</Text>
                            </Box>
                            <T.Table>
                              <T.Body>
                                {item.items?.map((invoiceItem, jj) => {
                                  const background =
                                    jj % 2 === 0 ? 'white' : undefined
                                  const isLastRow = jj === item.items.length - 1
                                  return (
                                    <>
                                      <T.Row key={jj}>
                                        <T.Data
                                          box={{
                                            textAlign: 'left',
                                            background,
                                            className: styles.noBorder,
                                          }}
                                        >
                                          <Text variant="small">
                                            {invoiceItem.label}
                                          </Text>
                                        </T.Data>
                                        <T.Data
                                          box={{
                                            textAlign: 'right',
                                            background,
                                            className: styles.noBorder,
                                          }}
                                        >
                                          <Text variant="small">
                                            {formatCurrency(invoiceItem.value)}
                                          </Text>
                                        </T.Data>
                                      </T.Row>
                                      {isLastRow && (
                                        <T.Row>
                                          <T.Data
                                            box={{
                                              background:
                                                background === 'white'
                                                  ? undefined
                                                  : 'white',
                                              className: styles.noBorder,
                                            }}
                                          />
                                          <T.Data
                                            box={{
                                              textAlign: 'right',
                                              background:
                                                background === 'white'
                                                  ? undefined
                                                  : 'white',
                                              className: styles.noBorder,
                                            }}
                                          >
                                            <Text
                                              fontWeight="semiBold"
                                              variant="small"
                                            >
                                              {formatCurrency(item.total)}
                                            </Text>
                                          </T.Data>
                                        </T.Row>
                                      )}
                                    </>
                                  )
                                })}
                              </T.Body>
                            </T.Table>
                          </Box>
                        ))}
                      </Box>
                    ) : undefined,
                }
              })}
            />
          </Box>

          <Box marginTop={2} marginBottom={0} hidden={(totalPages ?? 0) < 1}>
            <Pagination
              variant="purple"
              page={page}
              itemsPerPage={PAGE_SIZE}
              totalItems={totalHits}
              totalPages={totalPages}
              renderLink={(page, className, children) => (
                <Box
                  cursor="pointer"
                  className={className}
                  onClick={() => {
                    setPage(page)
                  }}
                >
                  {children}
                </Box>
              )}
            />
          </Box>
        </SidebarLayout>
      </Box>

    </CustomPageLayoutWrapper>
  )
}

interface OpenInvoicesOverviewProps {
  organization?: Query['getOrganization']
  locale: Locale
}

const OpenInvoicesOverview: CustomScreen<OpenInvoicesOverviewProps> = ({
  organization,
  locale,
  customPageData,
}) => {
  return (
    <OpenInvoicesOverviewPage
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

OpenInvoicesOverview.getProps = async ({ locale }) => {
  return {
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OpenInvoices,
    OpenInvoicesOverview,
  ),
)
