/* eslint-disable jsx-a11y/anchor-is-valid */
import { NavigationItem } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { Screen } from '../../../types'
import { LinkType, useNamespace } from '@island.is/web/hooks'
import {
  getThemeConfig,
  SliceMachine,
  OrganizationWrapper,
  SearchBox,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { getCustomAlertBanners } from './utils'

interface HomeProps {
  organizationPage: Query['getOrganizationPage']
  namespace: Query['getNamespace']
}

const WITH_SEARCH = [
  'syslumenn',
  'district-commissioner',

  'sjukratryggingar',
  'health-insurance-in-iceland',

  'utlendingastofnun',
  'directorate-of-immigration',
]

const Home: Screen<HomeProps> = ({ organizationPage, namespace }) => {
  const n = useNamespace(namespace)
  useContentfulId(organizationPage.id)

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active: false,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      showExternalLinks={true}
      pageTitle={organizationPage.title}
      pageDescription={organizationPage.description}
      organizationPage={organizationPage}
      pageFeaturedImage={organizationPage.featuredImage}
      fullWidthContent={true}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      mainContent={organizationPage.slices.map((slice, index) => {
        const digitalIcelandDetailPageLinkType: LinkType =
          'digitalicelandservicesdetailpage'
        return (
          <SliceMachine
            key={slice.id}
            slice={slice}
            namespace={namespace}
            slug={organizationPage.slug}
            marginBottom={index === organizationPage.slices.length - 1 ? 5 : 0}
            params={{
              anchorPageLinkType:
                organizationPage.theme === 'digital_iceland'
                  ? digitalIcelandDetailPageLinkType
                  : undefined,
            }}
            renderedOnOrganizationSubpage={false}
            paddingTop={!organizationPage.description && index === 0 ? 0 : 6}
          />
        )
      })}
      sidebarContent={
        WITH_SEARCH.includes(organizationPage.slug) && (
          <SearchBox
            id="sidebar"
            organizationPage={organizationPage}
            placeholder={n('searchServices', 'Leitaðu að þjónustu')}
            noResultsText={n(
              'noServicesFound',
              'Engar niðurstöður í þjónustu sýslumanna',
            )}
            searchAllText={n(
              'searchAllServices',
              'Leita í öllu efni Ísland.is',
            )}
          />
        )
      }
    >
      {organizationPage.bottomSlices.map((slice) => (
        <SliceMachine
          key={slice.id}
          slice={slice}
          namespace={namespace}
          slug={organizationPage.slug}
          fullWidth={true}
        />
      ))}
    </OrganizationWrapper>
  )
}

Home.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
    customAlertBanners,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
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
    getCustomAlertBanners(query, apolloClient, locale),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization not found')
  }

  return {
    organizationPage: getOrganizationPage,
    namespace,
    showSearchInHeader: false,
    customAlertBanners,
    ...getThemeConfig(getOrganizationPage.theme, getOrganizationPage.slug),
  }
}

export default withMainLayout(Home)
