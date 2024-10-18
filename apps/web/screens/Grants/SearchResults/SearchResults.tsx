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
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { GrantSearchSection, GrantWrapper } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  GenericTag,
  Query,
  QueryGetGenericTagsInTagGroupArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { GET_GENERIC_TAG_IN_TAG_GROUP_QUERY } from '../../queries/GenericTag'
import { m } from '../messages'

const GrantsSearchResultsPage: CustomScreen<GrantsHomeProps> = ({
  categories,
  locale,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('styrkjatorg', [], locale).href
  const searchUrl = linkResolver('styrkjatorgsearch', [], locale).href
  const categoriesUrl = linkResolver('ojoicategories', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: 'Styrkjatorg',
      href: baseUrl,
    },
  ]

  return (
    <GrantWrapper
      pageTitle={'Styrkjatorg'}
      pageDescription={formatMessage(m.home.description)}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <Stack space={SLICE_SPACING}>
        <GrantSearchSection
          title={'Styrkjatorg'}
          description={
            'Non scelerisque risus amet tincidunt. Sit sed quis cursus hendrerit nulla egestas interdum. In varius quisque.'
          }
          searchPlaceholder={formatMessage(m.home.inputPlaceholder)}
          searchUrl={searchUrl}
          shortcutsTitle={formatMessage(m.home.mostVisited)}
          featuredImage={formatMessage(m.home.featuredImage)}
          quickLinks={[
            {
              title: 'Listamannalaun',
              href: searchUrl + '?deild=a-deild',
            },
            {
              title: 'Barnamenningarsjóður',
              href: searchUrl + '?deild=b-deild',
            },
            {
              title: 'Tónlistarsjóður',
              href: searchUrl + '?deild=c-deild',
            },
            {
              title: 'Rannís',
              href: searchUrl + '?malaflokkur=grindavik',
              variant: 'purple',
            },
            {
              title: 'Erasmus',
              href: searchUrl + '?malaflokkur=gjaldskra',
              variant: 'purple',
            },
          ]}
          breadCrumbs={
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

        <Box background="blue100" paddingTop={8} paddingBottom={8}>
          <GridContainer>
            <Box
              display={'flex'}
              justifyContent={'spaceBetween'}
              alignItems="flexEnd"
            >
              <Text variant="h3">
                {formatMessage(m.home.popularCategories)}
              </Text>
              <ArrowLink href={categoriesUrl}>
                {formatMessage(m.home.allGrants)}
              </ArrowLink>
            </Box>

            <GridRow>
              {categories?.map((c) => (
                <GridColumn
                  span={['1/1', '1/2', '1/2', '1/3']}
                  paddingTop={3}
                  paddingBottom={3}
                >
                  <CategoryCard
                    href={`${categoriesUrl}?yfirflokkur=${c.slug}`}
                    heading={c.title}
                    text={'Flokka lýsing'}
                  />
                </GridColumn>
              ))}
            </GridRow>
          </GridContainer>
        </Box>
      </Stack>
    </GrantWrapper>
  )
}

interface GrantsHomeProps {
  organization?: Query['getOrganization']
  categories?: Array<GenericTag>
  locale: Locale
}

const GrantsSearchResults: CustomScreen<GrantsHomeProps> = ({
  categories,
  organization,
  customPageData,
  locale,
}) => {
  return (
    <GrantsSearchResultsPage
      categories={categories}
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantsSearchResults.getProps = async ({ apolloClient, locale }) => {
  const tagGroupCategory = 'grant-category'
  //Todo: add more organizations ??

  const {
    data: { getGenericTagsInTagGroup: tags },
  } = await apolloClient.query<Query, QueryGetGenericTagsInTagGroupArgs>({
    query: GET_GENERIC_TAG_IN_TAG_GROUP_QUERY,
    variables: {
      input: {
        lang: locale as ContentLanguage,
        tagGroupSlug: tagGroupCategory,
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
  withCustomPageWrapper(CustomPageUniqueIdentifier.Grants, GrantsSearchResults),
)
