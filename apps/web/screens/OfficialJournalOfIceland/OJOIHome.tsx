import { useIntl } from 'react-intl'
import NextLink from 'next/link'
import { useQuery } from '@apollo/client'

import {
  AlertMessage,
  ArrowLink,
  Box,
  Breadcrumbs,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  OfficialJournalOfIcelandAdvertMainCategory,
  OfficialJournalOfIcelandAdvertsResponse,
  Query,
  QueryGetOrganizationArgs,
  QueryOfficialJournalOfIcelandAdvertsArgs,
  QueryOfficialJournalOfIcelandMainCategoriesArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  OJOIAdvertCards,
  OJOIHomeIntro,
  OJOIWrapper,
} from '../../components/OfficialJournalOfIceland'
import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import {
  ADVERTS_QUERY,
  MAIN_CATEGORIES_QUERY,
} from '../queries/OfficialJournalOfIceland'
import { m } from './messages'

const OJOIHomePage: CustomScreen<OJOIHomeProps> = ({
  mainCategories,
  organization,
  locale,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('ojoihome', [], locale).href
  const searchUrl = linkResolver('ojoisearch', [], locale).href
  const categoriesUrl = linkResolver('ojoicategories', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organization?.title ?? '',
      href: baseUrl,
    },
  ]

  const { data, loading, error } = useQuery<
    {
      officialJournalOfIcelandAdverts: OfficialJournalOfIcelandAdvertsResponse
    },
    QueryOfficialJournalOfIcelandAdvertsArgs
  >(ADVERTS_QUERY, {
    variables: {
      input: {
        page: 1,
        pageSize: 5,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const adverts = data?.officialJournalOfIcelandAdverts.adverts

  return (
    <OJOIWrapper
      pageTitle={organization?.title ?? ''}
      pageDescription={formatMessage(m.home.description)}
      organization={organization ?? undefined}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <Stack space={SLICE_SPACING}>
        <OJOIHomeIntro
          organization={organization ?? undefined}
          searchPlaceholder={formatMessage(m.home.inputPlaceholder)}
          searchUrl={searchUrl}
          shortcutsTitle={formatMessage(m.home.shortcuts)}
          featuredImage={formatMessage(m.home.featuredImage)}
          quickLinks={[
            {
              title: 'A deild',
              href: searchUrl + '?deild=a-deild',
            },
            {
              title: 'B deild',
              href: searchUrl + '?deild=b-deild',
            },
            {
              title: 'C deild',
              href: searchUrl + '?deild=c-deild',
            },
            {
              title: 'Grindavík',
              href: searchUrl + '?malaflokkur=grindavik',
              variant: 'purple',
            },
            {
              title: 'Gjaldskrár',
              href: searchUrl + '?malaflokkur=gjaldskra',
              variant: 'purple',
            },
            {
              title: 'Covid 19',
              href: searchUrl + '?malaflokkur=covid-19',
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
            <GridRow>
              <GridColumn span="12/12">
                <Box
                  display={'flex'}
                  justifyContent={'spaceBetween'}
                  alignItems="flexEnd"
                  marginBottom={3}
                >
                  <Text variant="h3">
                    {formatMessage(m.home.mainCategories)}
                  </Text>
                  <ArrowLink href={categoriesUrl}>
                    {formatMessage(m.home.allCategories)}
                  </ArrowLink>
                </Box>
              </GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn span="12/12">
                <Text marginBottom={3} variant="h3">
                  {formatMessage(m.home.latestAdverts)}
                </Text>

                <Stack space={3}>
                  {loading && <SkeletonLoader repeat={4} height={200} />}
                  {error && (
                    <AlertMessage
                      type="warning"
                      message={formatMessage(
                        m.search.errorFetchingAdvertsMessage,
                      )}
                      title={formatMessage(m.search.errorFetchingAdvertsTitle)}
                    />
                  )}
                  {!error && !adverts?.length && (
                    <AlertMessage
                      type="info"
                      message={formatMessage(m.search.emptySearchResult)}
                    />
                  )}

                  {adverts && (
                    <OJOIAdvertCards adverts={adverts} locale={locale} />
                  )}
                </Stack>
              </GridColumn>
            </GridRow>

            <GridRow>
              {mainCategories?.map((y, i) => (
                <GridColumn
                  key={i}
                  span={['1/1', '1/2', '1/2', '1/3', '1/4']}
                  paddingTop={3}
                  paddingBottom={4}
                >
                  <CategoryCard
                    href={`${categoriesUrl}?yfirflokkur=${y.slug}`}
                    heading={y.title}
                    text={y.description ?? ''}
                  />
                </GridColumn>
              ))}
            </GridRow>
          </GridContainer>
        </Box>
      </Stack>
    </OJOIWrapper>
  )
}

interface OJOIHomeProps {
  mainCategories?: OfficialJournalOfIcelandAdvertMainCategory[]
  organization?: Query['getOrganization']
  locale: Locale
}

const OJOIHome: CustomScreen<OJOIHomeProps> = ({
  mainCategories,
  organization,
  customPageData,
  locale,
}) => {
  return (
    <OJOIHomePage
      mainCategories={mainCategories}
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

OJOIHome.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { officialJournalOfIcelandMainCategories },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryOfficialJournalOfIcelandMainCategoriesArgs>({
      query: MAIN_CATEGORIES_QUERY,
      variables: {
        params: {},
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    mainCategories: officialJournalOfIcelandMainCategories.mainCategories,
    organization: getOrganization,
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OfficialJournalOfIceland,
    OJOIHome,
  ),
)
