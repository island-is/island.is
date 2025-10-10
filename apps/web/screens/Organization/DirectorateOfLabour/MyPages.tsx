import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  CategoryCard,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  OrganizationFooter,
  OrganizationWrapper,
} from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  GetNamespaceQuery,
  OrganizationPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'
import { webRichText } from '@island.is/web/utils/richText'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { m } from './MyPages.strings'

interface MyPagesProps {
  organizationPage: OrganizationPage
  namespace: Record<string, string>
}

const MyPages: CustomScreen<MyPagesProps> = ({
  organizationPage,
  namespace,
  customPageData,
}) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { activeLocale } = useI18n()
  const { formatMessage } = useIntl()

  return (
    <OrganizationWrapper
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
      pageTitle={formatMessage(m.mainTitle)}
      minimal
      mainContent={
        <Box paddingBottom={8} paddingTop={[1, 1, 2]}>
          <Stack space={5}>
            <Text variant="h1" as="h1">
              {formatMessage(m.mainTitle)}
            </Text>
            <GridRow
              rowGap={5}
              direction={[
                'columnReverse',
                'columnReverse',
                'columnReverse',
                'row',
              ]}
            >
              <GridColumn span={['1/1', '1/1', '1/1', '4/7', '6/12']}>
                <Stack space={1}>
                  {webRichText(
                    customPageData?.content ?? [],
                    undefined,
                    activeLocale,
                  )}
                </Stack>
              </GridColumn>
              <GridColumn span={['1/1', '1/1', '1/1', '3/7', '6/12']}>
                <Stack space={3}>
                  <CategoryCard
                    heading={formatMessage(m.individualsLabel)}
                    text={formatMessage(m.individualsDescription)}
                    href={formatMessage(m.individualsHref)}
                    src={formatMessage(m.individualsImageSrc)}
                    alt=""
                    autoStack={true}
                  />
                  <CategoryCard
                    heading={formatMessage(m.companyLabel)}
                    text={formatMessage(m.companyDescription)}
                    href={formatMessage(m.companyHref)}
                    src={formatMessage(m.companyImageSrc)}
                    alt=""
                    autoStack={true}
                  />
                </Stack>
              </GridColumn>
            </GridRow>
          </Stack>
        </Box>
      }
    >
      {organizationPage.organization && (
        <OrganizationFooter organizations={[organizationPage.organization]} />
      )}
    </OrganizationWrapper>
  )
}

MyPages.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug =
    locale === 'en' ? 'directorate-of-labour' : 'vinnumalastofnun'

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
          subpageSlugs: [locale === 'is' ? 'minar-sidur' : 'my-pages'],
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

  const organizationNamespace = extractNamespaceFromOrganization(
    getOrganizationPage.organization,
  )

  if (organizationNamespace?.myPagesJumpPageIsDisabled) {
    throw new CustomNextError(404, 'VMST my pages link page has been disabled')
  }

  return {
    organizationPage: getOrganizationPage,
    namespace,
    customTopLoginButtonItem: organizationNamespace?.customTopLoginButtonItem,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.DirectorateOfLabourMyPages,
    MyPages,
  ),
  {
    footerVersion: 'organization',
  },
)
