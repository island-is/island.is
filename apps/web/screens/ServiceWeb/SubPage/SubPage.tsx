import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Organization,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetSingleSupportQnaArgs,
  QueryGetSupportCategoryArgs,
  QueryGetSupportQnAsInCategoryArgs,
  SupportQna,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_SERVICE_WEB_ORGANIZATION,
  GET_SINGLE_SUPPORT_QNA,
  GET_SUPPORT_CATEGORY,
  GET_SUPPORT_QNAS_IN_CATEGORY,
} from '../../queries'
import { Screen } from '../../../types'
import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  TopicCard,
  ContentBlock,
  AccordionCard,
  Link,
  LinkContext,
  Button,
} from '@island.is/island-ui/core'
import { ServiceWebWrapper } from '@island.is/web/components'
import {
  linkResolver,
  useLinkResolver,
  useNamespace,
} from '@island.is/web/hooks'
import { getSlugPart } from '../utils'

import ContactBanner from '../ContactBanner/ContactBanner'
import groupBy from 'lodash/groupBy'
import { SliceType } from '@island.is/island-ui/contentful'
import OrganizationContactBanner from '../ContactBanner/OrganizationContactBanner'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { Locale } from 'locale'
import { webRichText } from '@island.is/web/utils/richText'

export interface Dictionary<T> {
  [index: string]: T
}

interface SubPageProps {
  organization?: Organization
  namespace: Query['getNamespace']
  supportQNAs: Query['getSupportQNAsInCategory']
  singleSupportQNA: Query['getSingleSupportQNA']
  questionSlug: string
  organizationNamespace: Record<string, string>
  singleSupportCategory: Query['getSupportCategory']
  locale: Locale
}

const SubPage: Screen<SubPageProps> = ({
  organization,
  supportQNAs,
  singleSupportQNA,
  questionSlug,
  namespace,
  organizationNamespace,
  singleSupportCategory,
  locale,
}) => {
  const Router = useRouter()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const o = useNamespace(organizationNamespace)
  const { linkResolver } = useLinkResolver()
  useContentfulId(
    organization?.id,
    singleSupportCategory?.id,
    singleSupportQNA?.id,
  )
  useLocalLinkTypeResolver()

  const organizationSlug = organization?.slug
  const question = singleSupportQNA

  const institutionSlug = getSlugPart(Router.asPath, locale === 'is' ? 2 : 3)
  // Already filtered by category, simply
  const categoryDescription = supportQNAs[0]?.category?.description ?? ''
  const categoryTitle = supportQNAs[0]?.category?.title
  const categorySlug = supportQNAs[0]?.category?.slug
  const supportQNAsBySubCategory = groupBy(
    supportQNAs,
    (supportQNA) => supportQNA.subCategory?.title ?? '',
  )

  const sortedSupportSubCategoryTitles = getSortedSupportSubCategoryTitles(
    supportQNAsBySubCategory,
  )

  const organizationTitle = (organization && organization.title) || 'Ísland.is'
  const pageTitle = `${categoryTitle ? categoryTitle + ' | ' : ''}${o(
    'serviceWebSubpageTitleSuffix',
    n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is'),
  )}`

  const mobileBackButtonText = questionSlug
    ? `${organizationTitle}: ${categoryTitle}`
    : `${organizationTitle}`

  const mobileBackButtonLink = `${
    linkResolver('serviceweb').href
  }/${organizationSlug}${questionSlug ? `/${categorySlug}` : ''}`

  const institutionSlugBelongsToMannaudstorg =
    institutionSlug.includes('mannaudstorg')

  const breadcrumbItems = [
    {
      title: n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is'),
      typename: 'serviceweb',
      href: linkResolver('serviceweb').href,
    },
    {
      title: organization?.title,
      typename: 'serviceweb',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      href: linkResolver('serviceweborganization', [organizationSlug]).href,
    },
    {
      title: categoryTitle,
      typename: 'serviceweb',
      isTag: true,
      ...(questionSlug && {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        href: linkResolver('supportcategory', [organizationSlug, categorySlug])
          .href,
      }),
    },
  ]

  return (
    <ServiceWebWrapper
      pageTitle={pageTitle}
      pageDescription={o('serviceWebFeaturedDescription', '')}
      headerTitle={o(
        'serviceWebHeaderTitle',
        n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is'),
      )}
      institutionSlug={institutionSlug}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organization={organization}
      organizationTitle={organizationTitle}
      smallBackground
      searchPlaceholder={o(
        'serviceWebSearchPlaceholder',
        'Leitaðu á þjónustuvefnum',
      )}
    >
      <Box marginY={[3, 3, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              offset={[null, null, null, '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <GridContainer>
                <GridRow>
                  <GridColumn span="12/12" paddingBottom={[2, 2, 4]}>
                    <Box display={['none', 'none', 'block']} printHidden>
                      <Breadcrumbs
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        items={breadcrumbItems.slice(
                          institutionSlugBelongsToMannaudstorg ? 1 : 0,
                        )}
                        renderLink={(link, { href }) => {
                          return (
                            <NextLink
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore make web strict
                              href={href}
                              passHref
                              legacyBehavior
                            >
                              {link}
                            </NextLink>
                          )
                        }}
                      />
                    </Box>
                    <Box
                      paddingBottom={[2, 2, 4]}
                      display={['flex', 'flex', 'none']}
                      justifyContent="spaceBetween"
                      alignItems="center"
                      printHidden
                    >
                      <Box flexGrow={1} marginRight={6} overflow={'hidden'}>
                        <LinkContext.Provider
                          value={{
                            linkRenderer: (href, children) => (
                              <Link href={href} pureChildren skipTab>
                                {children}
                              </Link>
                            ),
                          }}
                        >
                          <Text truncate>
                            <a href={mobileBackButtonLink}>
                              <Button
                                preTextIcon="arrowBack"
                                preTextIconType="filled"
                                size="small"
                                type="button"
                                variant="text"
                              >
                                {mobileBackButtonText}
                              </Button>
                            </a>
                          </Text>
                        </LinkContext.Provider>
                      </Box>
                    </Box>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn span={['12/12', '12/12', '10/12']}>
                    {!question?.title && (
                      <>
                        <Text variant="h1" as="h1">
                          {categoryTitle}
                        </Text>
                        <Text marginTop={2} variant="intro">
                          {categoryDescription}
                        </Text>
                      </>
                    )}

                    {question && (
                      <>
                        <Text variant="h2" as="h2">
                          {question.title}
                        </Text>
                        <Box>{webRichText(question.answer as SliceType[])}</Box>
                        <>
                          {question.relatedLinks?.length > 0 && (
                            <Box
                              background="purple100"
                              borderRadius="large"
                              padding={4}
                              marginTop={6}
                              marginBottom={2}
                            >
                              <Stack space={[1, 1, 2]}>
                                <Text variant="eyebrow" as="h3">
                                  {o(
                                    'serviceWebRelatedMaterialHeaderTitle',
                                    'Tengt efni',
                                  )}
                                </Text>
                                {(question.relatedLinks ?? []).map(
                                  ({ text, url }, index) => (
                                    <Link
                                      key={index}
                                      href={url}
                                      underline="normal"
                                    >
                                      <Text key={url} as="span">
                                        {text}
                                      </Text>
                                    </Link>
                                  ),
                                )}
                              </Stack>
                            </Box>
                          )}
                          {question.contactLink && (
                            <Box
                              marginTop={
                                question.relatedLinks?.length > 0 ? 0 : 4
                              }
                            >
                              <OrganizationContactBanner
                                organizationLogoUrl={organization?.logo?.url}
                                contactLink={question.contactLink}
                                headerText={o(
                                  'serviceWebOrganizationContactBannerHeaderTitle',
                                  'Finnurðu ekki það sem þig vantar?',
                                )}
                                linkText={o(
                                  'serviceWebOrganizationContactBannerLinkTitle',
                                  'Hafa samband',
                                )}
                              />
                            </Box>
                          )}
                        </>
                      </>
                    )}

                    <ContentBlock>
                      <Box paddingY={[1, 2]} marginTop={6}>
                        {sortedSupportSubCategoryTitles.map((subcat, key) => {
                          const subCategoryDescription =
                            supportQNAsBySubCategory[subcat][0].subCategory
                              ?.description ?? ''

                          const subCategorySupportQNAs =
                            supportQNAsBySubCategory[subcat]
                          subCategorySupportQNAs.sort(
                            (a, b) => b?.importance - a?.importance,
                          )

                          return (
                            <Box marginBottom={3} key={key}>
                              <AccordionCard
                                id="id_1"
                                label={subcat}
                                visibleContent={
                                  <Text>{subCategoryDescription}</Text>
                                }
                              >
                                <Box marginTop={3}>
                                  <Stack space={2}>
                                    {subCategorySupportQNAs.map(
                                      ({ title, slug }, index) => {
                                        return (
                                          <Box key={index}>
                                            <TopicCard
                                              href={
                                                linkResolver('supportqna', [
                                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                  // @ts-ignore make web strict
                                                  organizationSlug,
                                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                  // @ts-ignore make web strict
                                                  categorySlug,
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
                              </AccordionCard>
                            </Box>
                          )
                        })}
                      </Box>
                    </ContentBlock>
                  </GridColumn>
                </GridRow>
              </GridContainer>

              <Box marginTop={[10, 10, 20]}>
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
                    n('howCanWeHelpText', 'Hvernig getum við aðstoðað?'),
                  )}
                />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </ServiceWebWrapper>
  )
}

const single = <T,>(x: T | T[]): T => (Array.isArray(x) ? x[0] : x)

SubPage.getProps = async ({ apolloClient, locale, query, res }) => {
  const slugs = query.slugs as string
  const organizationSlug = slugs[0]
  const categorySlug = slugs[1]
  const questionSlug = slugs[2] ?? undefined

  if (single(query.q)) {
    if (res) {
      res.writeHead(302, {
        Location: linkResolver(
          'supportqna',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          [organizationSlug, categorySlug, single(query.q)],
          locale as Locale,
        ).href,
      })
      res.end()
    }
  }

  const [
    organization,
    namespace,
    supportQNAs,
    singleSupportQNA,
    singleSupportCategory,
  ] = await Promise.all([
    !!organizationSlug &&
      apolloClient.query<Query, QueryGetOrganizationArgs>({
        query: GET_SERVICE_WEB_ORGANIZATION,
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
    !!categorySlug &&
      apolloClient.query<Query, QueryGetSupportQnAsInCategoryArgs>({
        query: GET_SUPPORT_QNAS_IN_CATEGORY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            slug: categorySlug,
          },
        },
      }),
    !!questionSlug &&
      apolloClient.query<Query, QueryGetSingleSupportQnaArgs>({
        query: GET_SINGLE_SUPPORT_QNA,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            slug: questionSlug,
          },
        },
      }),
    !!categorySlug &&
      apolloClient.query<Query, QueryGetSupportCategoryArgs>({
        query: GET_SUPPORT_CATEGORY,
        variables: {
          input: { slug: categorySlug, lang: locale as ContentLanguage },
        },
      }),
  ])

  const organizationNamespace = JSON.parse(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    organization?.data?.getOrganization?.namespace?.fields ?? '{}',
  )

  return {
    namespace,
    organizationNamespace,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    organization: organization?.data?.getOrganization,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    supportQNAs: supportQNAs?.data?.getSupportQNAsInCategory,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    singleSupportQNA: singleSupportQNA?.data?.getSingleSupportQNA,
    questionSlug,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    singleSupportCategory: singleSupportCategory?.data?.getSupportCategory,
    locale: locale as Locale,
  }
}

const getSortedSupportSubCategoryTitles = (
  supportQNAsBySubCategory: Dictionary<SupportQna[]>,
) => {
  const titles = Object.keys(supportQNAsBySubCategory)

  titles.sort((a, b) => {
    const subCategoryA = supportQNAsBySubCategory[a]
    const subCategoryB = supportQNAsBySubCategory[b]

    if (subCategoryA.length === 0) return 1
    if (subCategoryB.length === 0) return -1

    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      subCategoryB[0].subCategory?.importance -
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      subCategoryA[0].subCategory?.importance
    )
  })

  return titles
}

export default withMainLayout(SubPage, {
  showHeader: false,
  footerVersion: 'organization',
})
