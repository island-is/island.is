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
} from '@island.is/web/components'
import { Query } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'

import { CustomScreen, withCustomPageWrapper } from '../../CustomPage'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { m } from '../messages'

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

  const [totalHits, setTotalHits] = useState<number | undefined>(0)

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
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData scope="col" cellPadding={'16px'}>
                    <Text variant="medium" fontWeight="semiBold">
                      Seljandi
                    </Text>
                  </T.HeadData>
                  <T.HeadData scope="col" cellPadding={'16px'}>
                    <Text variant="medium" fontWeight="semiBold">
                      Kaupandi
                    </Text>
                  </T.HeadData>
                  <T.HeadData scope="col" cellPadding={'16px'}>
                    <Text variant="medium" fontWeight="semiBold">
                      Upphæð
                    </Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                <T.Row>
                  <T.Data>
                    <Text>Kennitölur einstaklinga</Text>
                  </T.Data>
                  <T.Data>
                    <Text>Landspítali</Text>
                  </T.Data>
                  <T.Data>
                    <Text>{formatCurrency(34812240)}</Text>
                  </T.Data>
                </T.Row>
              </T.Body>
            </T.Table>
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
