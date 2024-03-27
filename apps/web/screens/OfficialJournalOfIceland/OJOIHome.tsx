import { useMemo } from 'react'
import { Locale } from 'locale'
import NextLink from 'next/link'

import {
  MinistryOfJusticeAdvertMainCategory,
  QueryMinistryOfJusticeMainCategoriesArgs,
} from '@island.is/api/schema'
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
import { getThemeConfig, SliceMachine } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  categoriesUrl,
  OJOIHomeIntro,
  OJOIWrapper,
  searchUrl,
} from '../../components/OfficialJournalOfIceland'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../queries'
import { MAIN_CATEGORIES_QUERY } from '../queries/OfficialJournalOfIceland'

const OJOIHomePage: Screen<OJOIHomeProps> = ({
  mainCategories,
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  useContentfulId(organizationPage?.id)

  const organizationNamespace = useMemo(() => {
    return JSON.parse(organization?.namespace?.fields || '{}')
  }, [organization?.namespace?.fields])

  const o = useNamespace(organizationNamespace)

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organizationPage?.title ?? '',
      href: linkResolver(
        'organizationpage',
        [organizationPage?.slug ?? ''],
        locale,
      ).href,
    },
  ]

  return (
    <OJOIWrapper
      pageTitle={organizationPage?.title ?? ''}
      pageDescription={organizationPage?.description}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      organizationPage={organizationPage!}
      pageFeaturedImage={organizationPage?.featuredImage ?? undefined}
    >
      <Stack space={SLICE_SPACING}>
        <OJOIHomeIntro
          organizationPage={organizationPage ?? undefined}
          organization={organization ?? undefined}
          namespace={namespace}
          searchPlaceholder={n(
            'searchinputPlaceholder',
            'Leitaðu í stjórnartíðindum',
          )}
          searchUrl={searchUrl}
          shortcutsTitle={n('shortcuts', 'Flýtileiðir')}
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
              title: 'Auglýsendur',
              href: searchUrl + '?deild=auglysendur',
            },
            {
              title: 'Gjaldskrár',
              href: searchUrl + '?malefni=gjaldskrar',
              variant: 'purple',
            },
            {
              title: 'Covid 19',
              href: searchUrl + '?malefni=covid-19',
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
            <Box display={'flex'} justifyContent={'spaceBetween'}>
              <Text variant="h3">{n('mainCategories', 'Yfirflokkar')}</Text>
              <ArrowLink href={categoriesUrl}>
                {n('allCategories', 'Málaflokkar A-Ö')}
              </ArrowLink>
            </Box>

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

        {organizationPage?.bottomSlices.map((slice, index) => (
          <SliceMachine
            key={slice.id}
            slice={slice}
            namespace={namespace}
            slug={organizationPage.slug}
            marginBottom={index === organizationPage.slices.length - 1 ? 5 : 0}
          />
        ))}
      </Stack>
    </OJOIWrapper>
  )
}

interface OJOIHomeProps {
  mainCategories?: MinistryOfJusticeAdvertMainCategory[]
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  locale: Locale
}

const OJOIHome: Screen<OJOIHomeProps> = ({
  mainCategories,
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  return (
    <OJOIHomePage
      mainCategories={mainCategories}
      namespace={namespace}
      organizationPage={organizationPage}
      organization={organization}
      locale={locale}
    />
  )
}

OJOIHome.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { ministryOfJusticeMainCategories },
    },
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryMinistryOfJusticeMainCategoriesArgs>({
      query: MAIN_CATEGORIES_QUERY,
      variables: {
        params: {
          search: '',
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage && !getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    mainCategories: ministryOfJusticeMainCategories.mainCategories,
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    namespace,
    locale: locale as Locale,
    showSearchInHeader: false,
    ...getThemeConfig(
      getOrganizationPage?.theme ?? 'landing_page',
      getOrganization ?? getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(OJOIHome)
