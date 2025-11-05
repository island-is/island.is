import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import NextLink from 'next/link'
import { parseAsInteger, useQueryState } from 'next-usequerystate'

import {
  Box,
  Breadcrumbs,
  Filter,
  FilterInput,
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
import { MOCK_TABLE_DATA } from '../Home/mocks/table'
import { m } from '../messages'
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

  const [totalHits, setTotalHits] = useState<number | undefined>(MOCK_TABLE_DATA.rows.length)

  const totalPages = useMemo(() => {
    if (!totalHits) {
      return
    }
    return totalHits > PAGE_SIZE ? Math.ceil(totalHits / PAGE_SIZE) : 1
  }, [totalHits])

  return (
    <CustomPageLayoutWrapper
      pageTitle={formatMessage(m.overview.title)}
      pageDescription={formatMessage(m.overview.description)}
      pageFeaturedImage={formatMessage(m.overview.featuredImage)}
    >
      <CustomPageLayoutHeader
        title={formatMessage(m.home.title)}
        description={formatMessage(m.home.description)}
        featuredImage={formatMessage(m.home.featuredImage)}
        featuredImageAlt={formatMessage(m.home.featuredImageAlt)}
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

      <Box background="blue100">
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
                  variant={'dialog'}
                  align={'right'}
                  usePopoverDiscloureButtonStyling
                />
              </Box>
            </Stack>
          }
        >
          <Box background="white">
            <SortableTable
              labels={{
                seller: MOCK_TABLE_DATA.headers.seller,
                buyer: MOCK_TABLE_DATA.headers.buyer,
                amount: MOCK_TABLE_DATA.headers.amount,
              }}
              expandable
              align="left"
              defaultSortByKey="amount"
              items={MOCK_TABLE_DATA.rows.map((row, i) => {
                return ({
                  id:`${row.buyer}-${i}`,
                  seller: row.seller,
                  buyer: row.buyer,
                  amount: formatCurrency(row.amount),
                  children: row.subrows && row.subrows.length > 0 ? (
                    <Box>
                      {row?.subrows?.map((item, j) => (
                        <Box key={item.id} background='blue100'>
                          <Text>{item.date.toLocaleDateString('IS')}</Text>
                          <Text>{item.id}</Text>
                          <T.Table>
                            <T.Body>
                              {item.items?.map((invoiceItem, jj) => {
                                const background = jj % 2 === 0 ? 'white' : undefined;
                                console.log(background)
                                return <T.Row key={jj}>
                                  <T.Data
                                 box={{
                                   textAlign: 'left',
                                   background,
                                   className: styles.noBorder,
                                 }}
                               >
                                 <Text variant="small">{invoiceItem.label}</Text>
                               </T.Data>
                               <T.Data
                                 box={{
                                   textAlign: 'right',
                                   background,
                                   className: styles.noBorder,
                                 }}
                               >
                                 <Text variant="small">{formatCurrency(invoiceItem.value)}</Text>
                               </T.Data>
                             </T.Row>
                           })}
                          </T.Body>
                        </T.Table>
                      </Box>
                    ))}</Box>) : undefined
                })
              })

              }
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
