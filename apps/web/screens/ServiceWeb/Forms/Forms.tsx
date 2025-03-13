import { ReactNode, useEffect, useMemo } from 'react'
import NextLink from 'next/link'
import { useMutation } from '@apollo/client'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'

import {
  AlertBanner,
  Box,
  Breadcrumbs,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  LinkContext,
  LinkV2,
  Text,
  toast,
  ToastContainer,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  ServiceWebStandardForm,
  ServiceWebWrapper,
} from '@island.is/web/components'
import {
  ContentLanguage,
  Organization,
  Organizations,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetOrganizationsArgs,
  QueryGetServiceWebPageArgs,
  QueryGetSupportCategoriesInOrganizationArgs,
  ServiceWebFormsMutation,
  ServiceWebFormsMutationVariables,
  SupportCategory,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATIONS_QUERY,
  GET_SERVICE_WEB_ORGANIZATION,
  GET_SERVICE_WEB_PAGE_QUERY,
  GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
  SERVICE_WEB_FORMS_MUTATION,
} from '../../queries'
import { shouldShowInstitutionContactBanner } from '../utils'
import { filterSupportCategories } from './utils'

type FormNamespace = Record<
  string,
  Record<'label' | 'placeholder' | 'requiredMessage' | 'patternMessage', string>
>

interface ServiceWebFormsPageProps {
  syslumenn?: Organizations['items']
  organization?: Organization
  supportCategories?: SupportCategory[]
  namespace: Record<string, string>
  institutionSlug: string
  stateEntities: string[]
  formNamespace: FormNamespace
  locale: Locale
  serviceWebPage?: Query['getServiceWebPage']
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const ServiceWebFormsPage: Screen<ServiceWebFormsPageProps> = ({
  syslumenn,
  supportCategories,
  institutionSlug,
  organization,
  namespace,
  stateEntities,
  formNamespace,
  locale,
  serviceWebPage,
}) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const [submit, { data, loading, error }] = useMutation<
    ServiceWebFormsMutation,
    ServiceWebFormsMutationVariables
  >(SERVICE_WEB_FORMS_MUTATION)
  const { activeLocale } = useI18n()

  useContentfulId(organization?.id)
  useLocalLinkTypeResolver()

  const organizationNamespace = useMemo(
    () => JSON.parse(organization?.namespace?.fields || '{}'),
    [organization?.namespace],
  )
  const o = useNamespace(organizationNamespace)

  const errorMessage = n(
    'serviceWebFormErrorMessage',
    'Villa kom upp við að senda fyrirspurn.',
  )

  const successfullySent = data?.serviceWebForms?.sent

  useEffect(() => {
    const sent = data?.serviceWebForms?.sent

    if (sent !== undefined) {
      sent
        ? toast.success(
            n(
              'serviceWebFormSuccessDescription',
              'Erindi þínu hefur verið komið áleiðis til okkar.',
            ),
          )
        : toast.error(errorMessage)

      window.scrollTo(0, 0)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(errorMessage)
    }
  }, [error])

  const institutionSlugBelongsToMannaudstorg =
    institutionSlug.includes('mannaudstorg')

  const headerTitle = institutionSlugBelongsToMannaudstorg
    ? o(
        'serviceWebHeaderTitle',
        n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is'),
      )
    : ''

  const organizationTitle = (organization && organization.title) || 'Ísland.is'
  const pageTitle = `${organization?.title ? organization.title : ''}`

  const breadcrumbItems = useMemo(() => {
    const items = []

    if (!institutionSlugBelongsToMannaudstorg) {
      items.push({
        title: n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is'),
        typename: 'serviceweb',
        href: linkResolver('serviceweb').href,
      })
    }

    items.push({
      title: organization?.title,
      typename: 'serviceweb',
      href: `${linkResolver('serviceweb').href}/${institutionSlug}`,
    })
    items.push({
      title: o(
        'serviceWebContactUs',
        n('serviceWebContactUs', 'Hafðu samband'),
      ),
      isTag: true,
    })

    return items
  }, [institutionSlug, organization?.title, linkResolver])

  return (
    <ServiceWebWrapper
      pageTitle={pageTitle}
      headerTitle={headerTitle}
      institutionSlug={institutionSlug}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organization={organization}
      organizationTitle={organizationTitle}
      smallBackground
      searchPlaceholder={o(
        'serviceWebSearchPlaceholder',
        activeLocale === 'is'
          ? 'Leitaðu á þjónustuvefnum'
          : 'Search the service web',
      )}
      pageData={serviceWebPage}
    >
      <Box marginY={[3, 3, 10]} marginBottom={10}>
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
                        items={breadcrumbItems}
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
                            <a href={linkResolver('serviceweb').href}>
                              <Button
                                preTextIcon="arrowBack"
                                preTextIconType="filled"
                                size="small"
                                type="button"
                                variant="text"
                              >
                                {n(
                                  'assistanceForIslandIs',
                                  'Aðstoð fyrir Ísland.is',
                                )}
                              </Button>
                            </a>
                          </Text>
                        </LinkContext.Provider>
                      </Box>
                    </Box>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn span="12/12">
                    <Text variant="h1" as="h1">
                      {o(
                        'serviceWebFormTitle',
                        n('serviceWebFormTitle', 'Hvers efnis er erindið?'),
                      )}
                    </Text>
                    <Text marginTop={2} variant="intro">
                      {o(
                        'serviceWebFormIntro',
                        n(
                          'serviceWebFormIntro',
                          'Veldu viðeigandi flokk svo að spurningin rati á réttan stað.',
                        ),
                      )}
                    </Text>
                  </GridColumn>

                  {typeof serviceWebPage?.contactFormDisclaimer?.length ===
                    'number' &&
                    serviceWebPage.contactFormDisclaimer.length > 0 && (
                      <GridColumn paddingTop={2}>
                        {webRichText(serviceWebPage.contactFormDisclaimer, {
                          renderNode: {
                            [BLOCKS.PARAGRAPH]: (
                              _node: unknown,
                              children: ReactNode,
                            ) => {
                              return (
                                <GridRow>
                                  <GridColumn span="12/12">
                                    <Text as="div" variant="intro">
                                      {children}
                                    </Text>
                                  </GridColumn>
                                </GridRow>
                              )
                            },
                            [INLINES.HYPERLINK]: (
                              node: { data?: { uri?: string } },
                              children: ReactNode,
                            ) => {
                              return (
                                <Box display="inlineBlock">
                                  <LinkV2
                                    underlineVisibility="always"
                                    underline="small"
                                    color="blue400"
                                    href={node?.data?.uri ?? ''}
                                  >
                                    {children}
                                  </LinkV2>
                                </Box>
                              )
                            },
                          },
                        })}
                      </GridColumn>
                    )}
                </GridRow>
                {successfullySent ? (
                  <Box marginTop={6}>
                    <AlertBanner
                      title={o(
                        'serviceWebFormSuccessTitle',
                        n('serviceWebFormSuccessTitle', 'Takk fyrir'),
                      )}
                      description={o(
                        'serviceWebFormSuccessDescription',
                        n(
                          'serviceWebFormSuccessDescription',
                          'Erindi þínu hefur verið komið áleiðis til okkar.',
                        ),
                      )}
                      variant="success"
                    />
                  </Box>
                ) : (
                  <ServiceWebStandardForm
                    namespace={organizationNamespace}
                    formNamespace={formNamespace}
                    institutionSlug={institutionSlug}
                    supportCategories={supportCategories}
                    syslumenn={syslumenn}
                    stateEntities={stateEntities}
                    loading={loading}
                    onSubmit={async (formState) => {
                      await submit({
                        variables: {
                          input: { ...formState, lang: locale },
                        },
                      })
                    }}
                  />
                )}
              </GridContainer>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <ToastContainer closeButton={true} useKeyframeStyles={false} />
    </ServiceWebWrapper>
  )
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
ServiceWebFormsPage.getProps = async ({ apolloClient, locale, query }) => {
  const defaultSlug = locale === 'is' ? 'stafraent-island' : 'digital-iceland'
  const slug = query.slug ? (query.slug as string) : defaultSlug

  const [
    organizations,
    organization,
    supportCategories,
    namespace,
    stateEntities,
    formNamespace,
    {
      data: { getServiceWebPage },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationsArgs>({
      query: GET_ORGANIZATIONS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_SERVICE_WEB_ORGANIZATION,
      variables: {
        input: {
          slug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetSupportCategoriesInOrganizationArgs>({
      query: GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
      variables: {
        input: {
          slug: slug,
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
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Rikisadili',
            lang: locale,
          },
        },
      })
      .then(
        (variables) =>
          JSON.parse(variables?.data?.getNamespace?.fields || '{}')?.entities ??
          [],
      ),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Service Web - Forms',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        JSON.parse(variables?.data?.getNamespace?.fields || '{}'),
      ),
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

  if (!shouldShowInstitutionContactBanner(slug)) {
    throw new CustomNextError(
      404,
      `Service web contact form has been disabled for slug: ${slug}`,
    )
  }

  const filteredSupportCategories = filterSupportCategories(
    supportCategories?.data?.getSupportCategoriesInOrganization,
    slug,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    organization?.data?.getOrganization,
    locale,
    namespace,
  )

  return {
    syslumenn: organizations?.data?.getOrganizations?.items?.filter(
      (x) =>
        x.slug.startsWith('syslumadurinn') ||
        x.slug.startsWith('district-commissioner-of'),
    ),
    organization: organization?.data?.getOrganization,
    supportCategories: filteredSupportCategories,
    institutionSlug: slug,
    namespace,
    stateEntities,
    formNamespace,
    serviceWebPage: getServiceWebPage,
    locale: locale as Locale,
    customAlertBanner: getServiceWebPage?.alertBanner,
  }
}

export default withMainLayout(ServiceWebFormsPage, {
  showHeader: false,
  footerVersion: 'organization',
})
