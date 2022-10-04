import React from 'react'
import { useRouter } from 'next/router'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Organization,
  Query,
  QueryGetFeaturedSupportQnAsArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetSupportCategoriesInOrganizationArgs,
  QueryGetSupportQnAsArgs,
  SearchableTags,
  SupportCategory,
} from '@island.is/web/graphql/schema'
import {
  GET_FEATURED_SUPPORT_QNAS,
  GET_NAMESPACE_QUERY,
  GET_SERVICE_WEB_ORGANIZATION,
  GET_SUPPORT_CATEGORIES,
  GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
} from '../../queries'
import { Screen } from '../../../types'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  TopicCard,
} from '@island.is/island-ui/core'

import { CustomNextError } from '@island.is/web/units/errors'
import {
  Card,
  SimpleStackedSlider,
  ServiceWebWrapper,
  ServiceWebContext,
} from '@island.is/web/components'
import {
  useNamespace,
  LinkResolverResponse,
  useLinkResolver,
} from '@island.is/web/hooks'
import ContactBanner from '../ContactBanner/ContactBanner'
import { getSlugPart } from '../utils'
import sortAlpha from '@island.is/web/utils/sortAlpha'
import { Locale } from 'locale'

import * as styles from './Home.css'

interface HomeProps {
  organization?: Organization
  namespace: Query['getNamespace']
  organizationNamespace: Record<string, string>
  supportCategories:
    | Query['getSupportCategories']
    | Query['getSupportCategoriesInOrganization']
  featuredQNAs: Query['getFeaturedSupportQNAs']
  locale: Locale
}

const Home: Screen<HomeProps> = ({
  organization,
  supportCategories,
  namespace,
  organizationNamespace,
  featuredQNAs,
  locale,
}) => {
  const Router = useRouter()
  const n = useNamespace(namespace)
  const o = useNamespace(organizationNamespace)
  const { linkResolver } = useLinkResolver()

  const institutionSlug = getSlugPart(Router.asPath, locale === 'is' ? 2 : 3)

  const institutionSlugBelongsToMannaudstorg = institutionSlug.includes(
    'mannaudstorg',
  )

  const organizationTitle = (organization && organization.title) || 'Ísland.is'
  const headerTitle = o(
    'serviceWebHeaderTitle',
    n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is'),
  )
  const logoUrl = organization?.logo?.url ?? ''
  const searchTitle = o(
    'serviceWebSearchTitle',
    n('canWeAssist', 'Getum við aðstoðað?'),
  )

  const pageTitle = o(
    'serviceWebPageTitle',
    `${
      institutionSlug && organization && organization.title
        ? organization.title + ' | '
        : ''
    }${o('serviceWebPageTitleSuffix', headerTitle)}`,
  )

  const hasContent = !!supportCategories?.length

  const sortedSupportCategories = sortSupportCategories(supportCategories)

  return (
    <ServiceWebWrapper
      pageTitle={pageTitle}
      pageDescription={o('serviceWebFeaturedDescription', '')}
      headerTitle={headerTitle}
      institutionSlug={institutionSlug}
      logoUrl={logoUrl}
      organization={organization}
      organizationTitle={organizationTitle}
      searchTitle={searchTitle}
      searchPlaceholder={o(
        'serviceWebSearchPlaceholder',
        'Leitaðu á þjónustuvefnum',
      )}
      showLogoTitle={!institutionSlugBelongsToMannaudstorg}
      indexableBySearchEngine={institutionSlugBelongsToMannaudstorg}
    >
      {hasContent && (
        <ServiceWebContext.Consumer>
          {({ textMode }) => (
            <>
              <Box className={styles.categories}>
                <GridContainer>
                  <GridRow
                    {...(!institutionSlugBelongsToMannaudstorg
                      ? {}
                      : { direction: 'column', alignItems: 'center' })}
                  >
                    <GridColumn span="12/12" paddingBottom={[2, 2, 3]}>
                      <Text
                        variant="h3"
                        {...(textMode === 'dark' ? {} : { color: 'white' })}
                      >
                        {o(
                          'serviceWebCategoryTitle',
                          n('answersByCategory', 'Svör eftir flokkum'),
                        )}
                      </Text>
                    </GridColumn>
                  </GridRow>
                </GridContainer>
                <SimpleStackedSlider
                  itemWidth={280}
                  span={['12/12', '6/12', '6/12', '4/12']}
                >
                  {sortedSupportCategories.map(
                    ({ title, slug, description, organization }, index) => {
                      return (
                        <Card
                          key={index}
                          title={title}
                          description={description}
                          link={
                            {
                              href: linkResolver('servicewebcategory', [
                                organization.slug,
                                slug,
                              ]).href,
                            } as LinkResolverResponse
                          }
                        />
                      )
                    },
                  )}
                </SimpleStackedSlider>
              </Box>
              {featuredQNAs.length > 0 && (
                <Box marginY={[4, 4, 8]}>
                  <GridContainer>
                    <GridRow>
                      <GridColumn
                        offset={[null, null, null, '1/12']}
                        span={['12/12', '12/12', '12/12', '10/12']}
                      >
                        <Box
                          borderRadius="large"
                          border="standard"
                          borderColor="blue200"
                          paddingX={[4, 4, 14]}
                          paddingY={[4, 4, 8]}
                        >
                          <Text variant="h3" as="h3" marginBottom={[4, 4, 8]}>
                            {n('popularQuestions', 'Algengar spurningar')}
                          </Text>
                          <Stack space={2}>
                            {featuredQNAs.map(
                              ({ title, slug, category }, index) => {
                                return (
                                  <Box key={index}>
                                    <TopicCard
                                      href={
                                        linkResolver('servicewebanswer', [
                                          organization.slug,
                                          category.slug,
                                          slug,
                                        ]).href
                                      }
                                    >
                                      {title}
                                    </TopicCard>
                                  </Box>
                                )
                              },
                            )}
                          </Stack>
                        </Box>
                      </GridColumn>
                    </GridRow>
                  </GridContainer>
                </Box>
              )}
              {!institutionSlugBelongsToMannaudstorg && (
                <Box marginY={[7, 10, 10]}>
                  <GridContainer>
                    <GridRow>
                      <GridColumn
                        offset={[null, null, null, '1/12']}
                        span={['12/12', '12/12', '12/12', '10/12']}
                      >
                        <Box marginY={[2, 2, 4]}>
                          <ContactBanner
                            slug={institutionSlug}
                            cantFindWhatYouAreLookingForText={o(
                              'cantFindWhatYouAreLookingForText',
                              n(
                                'cantFindWhatYouAreLookingForText',
                                'Finnurðu ekki það sem þig vantar?',
                              ),
                            )}
                            contactUsText={o(
                              'contactUsText',
                              n('contactUsText', 'Hafa samband'),
                            )}
                            howCanWeHelpText={o(
                              'howCanWeHelpText',
                              n(
                                'howCanWeHelpText',
                                'Hvernig getum við aðstoðað?',
                              ),
                            )}
                          />
                        </Box>
                      </GridColumn>
                    </GridRow>
                  </GridContainer>
                </Box>
              )}
            </>
          )}
        </ServiceWebContext.Consumer>
      )}
    </ServiceWebWrapper>
  )
}

Home.getInitialProps = async ({ apolloClient, locale, query }) => {
  const defaultSlug = locale === 'en' ? 'digital-iceland' : 'stafraent-island'
  const slug = query.slug ? (query.slug as string) : defaultSlug

  const [organization, namespace, supportCategories] = await Promise.all([
    !!slug &&
      apolloClient.query<Query, QueryGetOrganizationArgs>({
        query: GET_SERVICE_WEB_ORGANIZATION,
        variables: {
          input: {
            slug,
            lang: locale as ContentLanguage,
          },
        },
      }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Global',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    slug
      ? apolloClient.query<Query, QueryGetSupportCategoriesInOrganizationArgs>({
          query: GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
          variables: {
            input: {
              lang: locale,
              slug: slug,
            },
          },
        })
      : apolloClient.query<Query, QueryGetSupportQnAsArgs>({
          query: GET_SUPPORT_CATEGORIES,
          variables: {
            input: {
              lang: locale,
            },
          },
        }),
  ])

  const popularQuestionCount =
    organization?.data?.getOrganization?.serviceWebPopularQuestionCount
  const featuredQNAs = popularQuestionCount
    ? await apolloClient.query<Query, QueryGetFeaturedSupportQnAsArgs>({
        query: GET_FEATURED_SUPPORT_QNAS,
        variables: {
          input: {
            organization: slug,
            lang: locale as ContentLanguage,
            size: popularQuestionCount ?? 10,
          },
        },
      })
    : undefined

  let processedCategories = slug
    ? supportCategories?.data?.getSupportCategoriesInOrganization
    : supportCategories?.data?.getSupportCategories

  // filter out categories that don't belong to an organization
  processedCategories = processedCategories.filter(
    (item) => !!item.organization,
  )

  if (
    !organization ||
    !organization?.data?.getOrganization?.serviceWebEnabled
  ) {
    throw new CustomNextError(
      404,
      'Service web not active for this organization',
    )
  }

  const organizationNamespace = JSON.parse(
    organization?.data?.getOrganization?.namespace?.fields ?? '{}',
  )

  return {
    organization: organization?.data?.getOrganization,
    namespace,
    organizationNamespace,
    supportCategories: processedCategories,
    featuredQNAs: featuredQNAs
      ? featuredQNAs?.data?.getFeaturedSupportQNAs
      : [],
    locale: locale as Locale,
  }
}

const sortSupportCategories = (items: SupportCategory[]) =>
  items
    .sort(sortAlpha('title'))
    .sort((a, b) =>
      a.importance > b.importance ? -1 : a.importance === b.importance ? 0 : 1,
    )

export default withMainLayout(Home, {
  showHeader: false,
  footerVersion: 'organization',
})
