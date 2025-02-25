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
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  OfficialJournalOfIcelandAdvert,
  OfficialJournalOfIcelandAdvertMainCategory,
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
  adverts,
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
      title: formatMessage(m.breadcrumb.frontpage),
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organization?.title ?? '',
      href: baseUrl,
    },
  ]

  return (
    <OJOIWrapper
      pageTitle={organization?.title ?? ''}
      pageDescription={formatMessage(m.home.description)}
      organization={organization ?? undefined}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
      isHomePage
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
              title: 'Lög',
              href: searchUrl + '?tegund=a-deild-log',
              variant: 'purple',
            },
            {
              title: 'Reglugerðir',
              href: searchUrl + '?tegund=b-deild-reglugerd',
              variant: 'purple',
            },
            {
              title: 'Gjaldskrár',
              href: searchUrl + '?tegund=b-deild-gjaldskra',
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
                <Stack space={2}>
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
                </Stack>
              </GridColumn>
            </GridRow>

            <GridRow>
              {mainCategories?.map((category, i) => {
                const subCategories = category.categories
                  .slice(0, 3)
                  .map((subCategory) => ({
                    label: subCategory.title,
                    href: `${searchUrl}?malaflokkur=${subCategory.slug}`,
                  }))

                return (
                  <GridColumn
                    paddingBottom={4}
                    span={['12/12', '6/12', '4/12', '3/12']}
                    key={category.slug}
                  >
                    <CategoryCard
                      key={category.slug}
                      href={`${categoriesUrl}?yfirflokkur=${category.slug}`}
                      heading={category.title}
                      text={category.description}
                      tags={subCategories}
                    />
                  </GridColumn>
                )
              })}
            </GridRow>

            <GridRow>
              <GridColumn span="12/12">
                <Text marginBottom={3} variant="h3">
                  {formatMessage(m.home.latestAdverts)}
                </Text>

                <Stack space={3}>
                  {adverts && (
                    <OJOIAdvertCards adverts={adverts} locale={locale} />
                  )}
                </Stack>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Stack>
    </OJOIWrapper>
  )
}

interface OJOIHomeProps {
  adverts: OfficialJournalOfIcelandAdvert[]
  mainCategories?: OfficialJournalOfIcelandAdvertMainCategory[]
  organization?: Query['getOrganization']
  locale: Locale
}

const OJOIHome: CustomScreen<OJOIHomeProps> = ({
  adverts,
  mainCategories,
  organization,
  customPageData,
  locale,
}) => {
  return (
    <OJOIHomePage
      adverts={adverts}
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
      data: { officialJournalOfIcelandAdverts },
    },
    {
      data: { officialJournalOfIcelandMainCategories },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryOfficialJournalOfIcelandAdvertsArgs>({
      query: ADVERTS_QUERY,
      variables: {
        input: {
          page: 1,
          pageSize: 5,
        },
      },
    }),

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
    adverts: officialJournalOfIcelandAdverts.adverts,
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
