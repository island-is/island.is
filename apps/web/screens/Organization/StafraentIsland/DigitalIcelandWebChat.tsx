import Head from 'next/head'
import { useRouter } from 'next/router'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  HeadWithSocialSharing,
  OrganizationWrapper,
  WatsonChatPanel,
  Webreader,
} from '@island.is/web/components'
import {
  ContentLanguage,
  GetNamespaceQuery,
  OrganizationPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { nlToBr } from '@island.is/web/utils/nlToBr'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'

import { Screen } from '../../../types'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'

interface DigitalIcelandWebChatPageProps {
  organizationPage: OrganizationPage
  namespace: Record<string, string>
}

const DigitalIcelandWebChatPage: Screen<DigitalIcelandWebChatPageProps> = ({
  organizationPage,
  namespace,
}) => {
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]

  const pageTitle = n(
    'digitalIcelandWebChatPageTitle',
    activeLocale === 'is'
      ? 'Netspjall fyrir stofnanir'
      : 'Web chat for organizations',
  ) as string

  return (
    <>
      <OrganizationWrapper
        fullWidthContent={true}
        breadcrumbItems={[
          {
            title: 'Ísland.is',
            href: linkResolver('homepage', []).href,
          },
          {
            title: organizationPage?.title ?? '',
            href: linkResolver('organizationpage', [
              organizationPage?.slug ?? '',
            ]).href,
          },
        ]}
        showReadSpeaker={false}
        navigationData={{
          title: n(
            'navigationTitle',
            activeLocale === 'is' ? 'Efnisyfirlit' : 'Menu',
          ),
          items: getOrganizationSidebarNavigationItems(
            organizationPage,
            baseRouterPath,
          ),
        }}
        organizationPage={organizationPage}
        pageTitle={pageTitle}
      >
        <Box paddingTop={4}>
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['9/9', '9/9', '7/9']}
                offset={['0', '0', '1/9']}
              >
                <Stack space={2}>
                  <Box className="rs_read">
                    <Text variant="h1" as="h1">
                      {pageTitle}
                    </Text>
                  </Box>
                  <Webreader
                    marginTop={0}
                    marginBottom={0}
                    readId={undefined}
                    readClass="rs_read"
                  />
                  <Box className="rs_read">
                    <Text>
                      {nlToBr(
                        n(
                          'digitalIcelandWebChatPageDescription',
                          'Hér geta stofnanir sem vantar upplýsingar hafið netspjall við Stafrænt Ísland.',
                        ),
                      )}
                    </Text>
                  </Box>
                </Stack>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </OrganizationWrapper>

      <WatsonChatPanel
        integrationID="9aed32e0-8009-49ef-8c26-1220ed86e250"
        region="eu-gb"
        serviceInstanceID="bc3d8312-d862-4750-b8bf-529db282050a"
        showLauncher={false}
        carbonTheme="g10"
        namespaceKey="default"
        onLoad={() => {
          if (sessionStorage.getItem('b1a80e76-da12-4333-8872-936b08246eaa')) {
            sessionStorage.clear()
          }
        }}
      />

      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    </>
  )
}

DigitalIcelandWebChatPage.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug =
    locale === 'en' ? 'digital-iceland' : 'stafraent-island'

  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale as ContentLanguage,
          },
        },
      })
      .then((res) =>
        res.data.getNamespace?.fields
          ? JSON.parse(res.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    namespace,
  }
}

export default withMainLayout(DigitalIcelandWebChatPage)
