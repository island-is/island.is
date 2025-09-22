import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import NextLink from 'next/link'

import {
  ArrowLink,
  Box,
  Breadcrumbs,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { GrantsHeader } from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  GenericTag,
  Query,
  QueryGetGenericTagsInTagGroupsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { GET_GENERIC_TAGS_IN_TAG_GROUPS_QUERY } from '../../queries/GenericTag'
import { m } from '../messages'
import {
  CATEGORY_TAG_SLUGS,
  CategorySlug,
  mapTagToMessageId,
} from './mapTagToMessageId'

const GrantsHomePage: CustomScreen<GrantsHomeProps> = ({
  categories,
  locale,
  customPageData,
}) => {
  useLocalLinkTypeResolver()
  useContentfulId(customPageData?.id)
  const intl = useIntl()
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()
  const isTablet = theme.breakpoints.sm < width && width < theme.breakpoints.md

  const { formatMessage } = intl

  const baseUrl = linkResolver('grantsplaza', [], locale).href
  const searchUrl = linkResolver('grantsplazasearch', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.home.title),
      href: baseUrl,
      isTag: true,
    },
  ]

  const categorySlugs: Array<CategorySlug> = useMemo(() => {
    const ordering: Array<string> | null =
      customPageData?.configJson?.categoryOrdering ?? null
    if (!ordering) {
      return [...CATEGORY_TAG_SLUGS]
    }

    return ordering
      .map((slug) => {
        if (CATEGORY_TAG_SLUGS.includes(slug as CategorySlug)) {
          return slug as CategorySlug
        }
      })
      .filter(isDefined)
  }, [customPageData?.configJson?.categoryOrdering])

  return (
    <Box>
      <GrantsHeader
        title={customPageData?.ogTitle ?? formatMessage(m.home.title)}
        description={
          customPageData?.ogDescription ?? formatMessage(m.home.description)
        }
        searchPlaceholder={formatMessage(m.home.inputPlaceholder)}
        searchUrl={searchUrl}
        shortcutsTitle={formatMessage(m.home.mostVisited)}
        featuredImage={formatMessage(m.home.featuredImage)}
        featuredImageAlt={formatMessage(m.home.featuredImageAlt)}
        offset
        quickLinks={[
          {
            title: formatMessage(m.bullets.open),
            href: searchUrl + '?status=open',
          },
          {
            title: formatMessage(m.bullets.nativeFunds),
            href: searchUrl + '?category=grant-category-native',
          },
          {
            title: formatMessage(m.bullets.technologyDevelopmentFund),
            href: searchUrl + '?query=tækniþróunar',
          },
          {
            title: formatMessage(m.bullets.financing),
            href: searchUrl + '?type=grant-type-financing',
          },
          {
            title: formatMessage(m.bullets.companies),
            href: searchUrl + '?query=fyrirtæki',
          },
        ]}
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

      <Box background="blue100" marginY={6} paddingY={6}>
        <GridContainer>
          <Box
            display={'flex'}
            justifyContent={'spaceBetween'}
            alignItems="flexEnd"
          >
            <Text variant="h3">{formatMessage(m.home.popularCategories)}</Text>
            <ArrowLink href={searchUrl}>
              {formatMessage(m.home.allGrants)}
            </ArrowLink>
          </Box>

          <GridRow marginTop={3} rowGap={isTablet ? 2 : 3}>
            {categorySlugs
              ?.map((c) => {
                const category = categories?.find((ct) => c === ct.slug)

                if (!category) {
                  return undefined
                }

                return (
                  <GridColumn key={c} span={['1/1', '1/2', '1/2', '1/3']}>
                    <CategoryCard
                      href={`${searchUrl}?category=${c}`}
                      heading={category.title}
                      text={
                        CATEGORY_TAG_SLUGS.includes(c)
                          ? formatMessage(mapTagToMessageId(c))
                          : ''
                      }
                    />
                  </GridColumn>
                )
              })
              .filter(isDefined)}
          </GridRow>
        </GridContainer>
      </Box>
    </Box>
  )
}

interface GrantsHomeProps {
  organization?: Query['getOrganization']
  categories?: Array<GenericTag>
  locale: Locale
}

const GrantsHome: CustomScreen<GrantsHomeProps> = ({
  categories,
  organization,
  customPageData,
  locale,
}) => {
  return (
    <GrantsHomePage
      categories={categories}
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantsHome.getProps = async ({ apolloClient, locale }) => {
  const tagGroupCategory = 'grant-category'
  //Todo: add more organizations ??

  const {
    data: { getGenericTagsInTagGroups: tags },
  } = await apolloClient.query<Query, QueryGetGenericTagsInTagGroupsArgs>({
    query: GET_GENERIC_TAGS_IN_TAG_GROUPS_QUERY,
    variables: {
      input: {
        lang: locale as ContentLanguage,
        tagGroupSlugs: [tagGroupCategory],
      },
    },
  })

  return {
    categories: tags ?? [],
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Grants, GrantsHome),
)
