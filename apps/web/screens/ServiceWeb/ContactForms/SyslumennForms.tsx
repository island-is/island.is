import React, { useEffect } from 'react'
import NextLink from 'next/link'
import cn from 'classnames'
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
} from '@island.is/island-ui/core'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { ServiceWebHeader, SyslumennForms } from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Organizations, Query, SupportCategory } from '@island.is/api/schema'
import {
  ContentLanguage,
  QueryGetNamespaceArgs,
  QueryGetOrganizationsArgs,
  QueryGetSupportCategoriesInOrganizationArgs,
  SyslumennFormsMutation,
  SyslumennFormsMutationVariables,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATIONS_QUERY,
  GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
  SYSLUMENN_FORMS_MUTATION,
} from '../../queries'
import { Screen } from '../../../types'

import * as sharedStyles from '../shared/styles.treat'

interface SyslumennFormsPageProps {
  syslumenn?: Organizations['items']
  supportCategories?: SupportCategory[]
  namespace: Query['getNamespace']
  slug: string | string[]
}

const SyslumennFormsPage: Screen<SyslumennFormsPageProps> = ({
  syslumenn,
  supportCategories,
}) => {
  const { linkResolver } = useLinkResolver()
  const [submit, { data, loading, error }] = useMutation<
    SyslumennFormsMutation,
    SyslumennFormsMutationVariables
  >(SYSLUMENN_FORMS_MUTATION)

  const logoTitle = 'Þjónustuvefur Sýslumanna'
  const errorMessage = 'Villa kom upp við að senda fyrirspurn.'

  const successfullySent = data?.syslumennForms?.sent

  useEffect(() => {
    const sent = data?.syslumennForms?.sent

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

  return (
    <>
      <ServiceWebHeader logoTitle={logoTitle} />
      <div className={cn(sharedStyles.bg, sharedStyles.bgSmall)} />
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
                    <Box printHidden>
                      <Breadcrumbs
                        items={[
                          {
                            title: logoTitle,
                            typename: 'helpdesk',
                            href: '/',
                          },
                          {
                            title: 'Hafðu samband',
                          },
                        ]}
                        renderLink={(link, { typename, slug }) => {
                          return (
                            <NextLink
                              {...linkResolver(typename as LinkType, slug)}
                              passHref
                            >
                              {link}
                            </NextLink>
                          )
                        }}
                      />
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
                  <SyslumennForms
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
    </>
  )
}

SyslumennFormsPage.getInitialProps = async ({
  apolloClient,
  locale,
  query,
}) => {
  const slug = query.slug ? (query.slug as string) : 'stafraent-island'

  const [organizations, supportCategories, namespace] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationsArgs>({
      query: GET_ORGANIZATIONS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetSupportCategoriesInOrganizationArgs>({
      query: GET_SUPPORT_CATEGORIES_IN_ORGANIZATION,
      variables: {
        input: {
          slug: 'syslumenn',
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

  return {
    syslumenn: organizations?.data?.getOrganizations?.items?.filter((x) =>
      x.slug.startsWith('syslumadurinn'),
    ),
    supportCategories:
      supportCategories?.data?.getSupportCategoriesInOrganization,
    namespace,
    slug,
  }
}

export default withMainLayout(SyslumennFormsPage, {
  showHeader: false,
  showFooter: false,
})
