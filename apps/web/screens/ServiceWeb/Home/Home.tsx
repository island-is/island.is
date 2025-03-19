import { useRouter } from 'next/router'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  TopicCard,
} from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { Locale } from '@island.is/shared/types'
import { sortAlpha } from '@island.is/shared/utils'
import {
  Card,
  ServiceWebContext,
  ServiceWebWrapper,
  SimpleStackedSlider,
  SliceMachine,
} from '@island.is/web/components'
import {
  ContentLanguage,
  Organization,
  Query,
  QueryGetFeaturedSupportQnAsArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetServiceWebPageArgs,
  QueryGetSupportCategoriesInOrganizationArgs,
  QueryGetSupportQnAsArgs,
  SupportCategory,
} from '@island.is/web/graphql/schema'
import {
  LinkResolverResponse,
  useLinkResolver,
  useNamespace,
} from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import { Screen } from '../../../types'
import {
  GET_FEATURED_SUPPORT_QNAS,
  GET_NAMESPACE_QUERY,
  GET_SERVICE_WEB_ORGANIZATION,
  GET_SERVICE_WEB_PAGE_QUERY,
  GET_SUPPORT_CATEGORIES,
  GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
} from '../../queries'
import ContactBanner from '../ContactBanner/ContactBanner'
import { getSlugPart, shouldShowInstitutionContactBanner } from '../utils'
import * as styles from './Home.css'

interface HomeProps {
  organization?: Organization
  namespace: Query['getNamespace']
  organizationNamespace: Record<string, string>
  supportCategories:
    | Query['getSupportCategories']
    | Query['getSupportCategoriesInOrganization']
  featuredQNAs: Query['getFeaturedSupportQNAs']
  serviceWebPage?: Query['getServiceWebPage']
  locale: Locale
}

const Home: Screen<HomeProps> = ({
  organization,
  supportCategories,
  namespace,
  organizationNamespace,
  featuredQNAs,
  serviceWebPage,
  locale,
}) => {
  const Router = useRouter()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const o = useNamespace(organizationNamespace)
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()

  useContentfulId(organization?.id)
  useLocalLinkTypeResolver()

  const institutionSlug = getSlugPart(Router.asPath, locale === 'is' ? 2 : 3)

  const institutionSlugBelongsToMannaudstorg =
    institutionSlug.includes('mannaudstorg')

  const showContactBanner = shouldShowInstitutionContactBanner(institutionSlug)

  const organizationTitle = (organization && organization.title) || 'Ísland.is'
  const headerTitle = institutionSlugBelongsToMannaudstorg
    ? o(
        'serviceWebHeaderTitle',
        n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is'),
      )
    : ''
  const logoUrl = organization?.logo?.url ?? ''
  const searchTitle = o(
    'serviceWebSearchTitle',
    n('canWeAssist', 'Getum við aðstoðað?'),
  )

  const pageTitle = o(
    'serviceWebPageTitle',
    `${
      institutionSlug && organization && organization.title
        ? institutionSlugBelongsToMannaudstorg
          ? organization.title + ' | '
          : organization.title
        : ''
    }`,
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organization={organization}
      organizationTitle={organizationTitle}
      searchTitle={searchTitle}
      searchPlaceholder={o(
        'serviceWebSearchPlaceholder',
        activeLocale === 'is'
          ? 'Leitaðu á þjónustuvefnum'
          : 'Search the service web',
      )}
      showLogoTitle={!institutionSlugBelongsToMannaudstorg}
      indexableBySearchEngine={institutionSlugBelongsToMannaudstorg}
      showLogoOnMobileDisplays={!institutionSlugBelongsToMannaudstorg}
      pageData={serviceWebPage}
    >
      {hasContent && (
        <ServiceWebContext.Consumer>
          {({ textMode }) => {
            const textProps: { color?: Colors } =
              textMode === 'dark'
                ? {}
                : { color: textMode === 'blueberry' ? 'blueberry600' : 'white' }
            return (
              <>
                <Box className={styles.categories}>
                  <GridContainer>
                    <GridRow
                      {...(!institutionSlugBelongsToMannaudstorg
                        ? {}
                        : { direction: 'column', alignItems: 'center' })}
                    >
                      <GridColumn span="12/12" paddingBottom={[2, 2, 3]}>
                        <Text variant="h3" {...textProps}>
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
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore make web strict
                            title={title}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore make web strict
                            description={description}
                            link={
                              {
                                href: linkResolver('supportcategory', [
                                  organization?.slug ?? '',
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore make web strict
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

                <Box marginY={[4, 4, 8]}>
                  <GridContainer>
                    <GridRow>
                      <GridColumn
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        offset={[null, null, null, '1/12']}
                        span={['12/12', '12/12', '12/12', '10/12']}
                      >
                        <Box
                          marginTop={[4, 4, 4]}
                          marginBottom={[4, 4, 8]}
                          paddingX={[4, 4, 14]}
                        >
                          {serviceWebPage?.slices?.map((slice) => {
                            return (
                              <SliceMachine
                                key={slice.id}
                                slice={slice}
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore make web strict
                                namespace={namespace}
                                fullWidth={true}
                              />
                            )
                          })}
                        </Box>

                        {featuredQNAs.length > 0 && (
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
                              {featuredQNAs
                                .filter(
                                  (item) =>
                                    !!item.title &&
                                    !!item.slug &&
                                    !!item.category,
                                )
                                .map(({ title, slug, category }, index) => {
                                  return (
                                    <Box key={index}>
                                      <TopicCard
                                        href={
                                          linkResolver('supportqna', [
                                            organization?.slug
                                              ? organization.slug
                                              : '',
                                            category?.slug ? category.slug : '',
                                            slug,
                                          ]).href
                                        }
                                      >
                                        {title}
                                      </TopicCard>
                                    </Box>
                                  )
                                })}
                            </Stack>
                          </Box>
                        )}
                      </GridColumn>
                    </GridRow>
                  </GridContainer>
                </Box>
                {showContactBanner && (
                  <Box marginY={[7, 10, 10]}>
                    <GridContainer>
                      <GridRow>
                        <GridColumn
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
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
            )
          }}
        </ServiceWebContext.Consumer>
      )}
    </ServiceWebWrapper>
  )
}

Home.getProps = async ({ apolloClient, locale, query }) => {
  const defaultSlug = locale === 'en' ? 'digital-iceland' : 'stafraent-island'
  const slug = query.slug ? (query.slug as string) : defaultSlug

  const [
    organization,
    namespace,
    supportCategories,
    {
      data: { getServiceWebPage },
    },
  ] = await Promise.all([
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
        variables.data.getNamespace?.fields
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
    apolloClient.query<Query, QueryGetServiceWebPageArgs>({
      query: GET_SERVICE_WEB_PAGE_QUERY,
      variables: {
        input: {
          slug: slug,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  const popularQuestionCount =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
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
    serviceWebPage: getServiceWebPage,
    locale: locale as Locale,
    customAlertBanner: getServiceWebPage?.alertBanner,
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
