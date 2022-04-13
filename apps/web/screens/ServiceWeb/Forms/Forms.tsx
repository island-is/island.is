import React, { useEffect } from 'react'
import NextLink from 'next/link'
import { useMutation } from '@apollo/client'

import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  ToastContainer,
  toast,
  AlertBanner,
  LinkContext,
  Link,
  Button,
} from '@island.is/island-ui/core'
import { useNamespace, useLinkResolver } from '@island.is/web/hooks'
import {
  ServiceWebStandardForm,
  ServiceWebWrapper,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Query,
  Organizations,
  ContentLanguage,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetSupportCategoriesInOrganizationArgs,
  ServiceWebFormsMutation,
  ServiceWebFormsMutationVariables,
  SupportCategory,
  Organization,
  QueryGetOrganizationsArgs,
  SearchableTags,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATIONS_QUERY,
  GET_SERVICE_WEB_ORGANIZATION,
  GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
  SERVICE_WEB_FORMS_MUTATION,
} from '../../queries'
import { Screen } from '../../../types'
import { CustomNextError } from '@island.is/web/units/errors'

interface ServiceWebFormsPageProps {
  syslumenn?: Organizations['items']
  organization?: Organization
  supportCategories?: SupportCategory[]
  namespace: Query['getNamespace']
  institutionSlug: string
}

const ServiceWebFormsPage: Screen<ServiceWebFormsPageProps> = ({
  syslumenn,
  supportCategories,
  institutionSlug,
  organization,
  namespace,
}) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const [submit, { data, loading, error }] = useMutation<
    ServiceWebFormsMutation,
    ServiceWebFormsMutationVariables
  >(SERVICE_WEB_FORMS_MUTATION)

  const errorMessage = 'Villa kom upp við að senda fyrirspurn.'

  const successfullySent = data?.serviceWebForms?.sent

  useEffect(() => {
    const sent = data?.serviceWebForms?.sent

    if (sent !== undefined) {
      sent
        ? toast.success('Erindi þínu hefur verið komið áleiðis til okkar.')
        : toast.error(errorMessage)

      window.scrollTo(0, 0)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(errorMessage)
    }
  }, [error])

  const headerTitle = n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is')
  const organizationTitle = (organization && organization.title) || 'Ísland.is'
  const pageTitle = `${
    institutionSlug && organization && organization.title
      ? organization.title + ' | '
      : ''
  }${headerTitle}`

  const breadcrumbItems = [
    {
      title: n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is'),
      typename: 'serviceweb',
      href: linkResolver('serviceweb').href,
    },
    {
      title: organization.title,
      typename: 'serviceweb',
      href: `${linkResolver('serviceweb').href}/${institutionSlug}`,
    },
    {
      title: 'Hafðu samband',
      isTag: true,
    },
  ]

  return (
    <ServiceWebWrapper
      pageTitle={pageTitle}
      headerTitle={headerTitle}
      institutionSlug={institutionSlug}
      organization={organization}
      organizationTitle={organizationTitle}
      smallBackground
    >
      <Box marginY={[3, 3, 10]} marginBottom={10}>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={[null, null, null, '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <GridContainer>
                <GridRow>
                  <GridColumn span="12/12" paddingBottom={[2, 2, 4]}>
                    <Box display={['none', 'none', 'block']} printHidden>
                      <Breadcrumbs
                        items={breadcrumbItems}
                        renderLink={(link, { href }) => {
                          return (
                            <NextLink href={href} passHref>
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
                      Hvers efnis er erindið?
                    </Text>
                    <Text marginTop={2} variant="intro">
                      Veldu viðeigandi flokk svo að spurningin rati á réttan
                      stað.
                    </Text>
                  </GridColumn>
                </GridRow>
                {successfullySent ? (
                  <Box marginTop={6}>
                    <AlertBanner
                      title="Takk fyrir"
                      description="Erindi þínu hefur verið komið áleiðis til okkar."
                      variant="success"
                    />
                  </Box>
                ) : (
                  <ServiceWebStandardForm
                    institutionSlug={institutionSlug}
                    supportCategories={supportCategories}
                    syslumenn={syslumenn}
                    loading={loading}
                    onSubmit={async (formState) => {
                      await submit({
                        variables: {
                          input: formState,
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

ServiceWebFormsPage.getInitialProps = async ({
  apolloClient,
  locale,
  query,
}) => {
  const slug = query.slug ? (query.slug as string) : 'stafraent-island'

  const [
    organizations,
    organization,
    supportCategories,
    namespace,
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
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (slug === 'mannaudstorg') {
    throw new CustomNextError(404, 'Mannaudstorg does not have a contact page')
  }

  return {
    syslumenn: organizations?.data?.getOrganizations?.items?.filter((x) =>
      x.slug.startsWith('syslumadurinn'),
    ),
    organization: organization?.data?.getOrganization,
    supportCategories:
      supportCategories?.data?.getSupportCategoriesInOrganization,
    institutionSlug: slug,
    namespace,
  }
}

export default withMainLayout(ServiceWebFormsPage, {
  showHeader: false,
  showFooter: false,
})
