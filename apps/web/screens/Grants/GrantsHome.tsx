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
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  GenericTagGroup,
  Query,
  QueryGetGenericTagsArgs,
  QueryGetOrganizationArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  OJOIHomeIntro,
  OJOIWrapper,
} from '../../components/OfficialJournalOfIceland'
import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import { GET_GENERIC_TAGS_QUERY } from '../queries/GenericTag'
import { m } from './messages'

const GrantsHomePage: CustomScreen<GrantsHomeProps> = ({
  organization,
  category,
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
    >
      <Stack space={SLICE_SPACING}>
        <OJOIHomeIntro
          organization={organization ?? undefined}
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
              {category?.title}

              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2', '1/2', '1/3']}
                paddingTop={3}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${categoriesUrl}?yfirflokkur=veitekki`}
                  heading={'Flokkur'}
                  text={'Flokka lýsing'}
                />
              </GridColumn>

              {/* ))} */}
            </GridRow>
          </GridContainer>
        </Box>
      </Stack>
    </OJOIWrapper>
  )
}

interface GrantsHomeProps {
  organization?: Query['getOrganization']
  category?: GenericTagGroup
  locale: Locale
}

const GrantsHome: CustomScreen<GrantsHomeProps> = ({
  category,
  organization,
  customPageData,
  locale,
}) => {
  return (
    <GrantsHomePage
      category={category}
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantsHome.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'rannsoknamidstoed-islands-rannis'
  const tagGroupCategory = 'grant-category'
  //Todo: add more organizations ??

  const [
    {
      data: { getOrganization },
    },
    {
      data: { getGenericTags: tags },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetGenericTagsArgs>({
      query: GET_GENERIC_TAGS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  console.log('TAGS ARE HERE ------------------_>', tags)
  const category = tags?.find(
    (tag) => tag.genericTagGroup?.slug === tagGroupCategory,
  )?.genericTagGroup
  return {
    organization: getOrganization,
    category: category ?? undefined,
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
