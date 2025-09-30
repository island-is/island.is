import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  AlertMessage,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  getThemeConfig,
  HeadWithSocialSharing,
  OrganizationWrapper,
} from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  type Query,
  type QueryGetNamespaceArgs,
  type QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'
import { webRichText } from '@island.is/web/utils/richText'

import { type CustomScreen, withCustomPageWrapper } from '../../CustomPage'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { getSubpageNavList } from '../SubPage'
import { m } from './PaymentSuccessful.strings'

interface PaymentSuccessfulProps {
  organizationPage: Query['getOrganizationPage']
  namespace: Record<string, string>
}

const Wrapper = ({
  organizationPage,
  children,
  namespace,
}: React.PropsWithChildren<{
  organizationPage: Query['getOrganizationPage']
  namespace: Record<string, string>
}>) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  const { activeLocale } = useI18n()
  if (!organizationPage) {
    return (
      <GridContainer>
        <GridRow align="center">
          <GridColumn offset={['0', '0', '1/9']} span={['9/9', '9/9', '7/9']}>
            {children}
          </GridColumn>
        </GridRow>
      </GridContainer>
    )
  }

  return (
    <OrganizationWrapper
      showReadSpeaker={false}
      organizationPage={organizationPage}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: getSubpageNavList(
          organizationPage,
          router,
          activeLocale === 'is' ? 3 : 4,
        ),
      }}
      pageTitle={n(
        'pageTitle',
        activeLocale === 'is' ? 'Greiðsla tókst' : 'Payment successful',
      )}
      isSubpage={true}
    >
      {children}
    </OrganizationWrapper>
  )
}

const PaymentSuccessful: CustomScreen<PaymentSuccessfulProps> = ({
  customPageData,
  organizationPage,
  namespace,
}) => {
  const { activeLocale } = useI18n()
  const { formatMessage } = useIntl()

  useContentfulId(customPageData?.id)

  return (
    <Wrapper organizationPage={organizationPage} namespace={namespace}>
      <HeadWithSocialSharing
        title={
          customPageData?.ogTitle ??
          (activeLocale === 'is'
            ? 'Greiðsla tókst | Landspítali'
            : 'Payment successful | Landspítali')
        }
      >
        <meta name="robots" content="noindex, nofollow" />
      </HeadWithSocialSharing>
      <Stack space={3}>
        <AlertMessage
          type="success"
          title={formatMessage(m.mainTitle)}
          message={formatMessage(m.subTitle)}
        />
        <Text as="div">{webRichText(customPageData?.content ?? [])}</Text>
      </Stack>
    </Wrapper>
  )
}

PaymentSuccessful.getProps = async ({ apolloClient, locale }) => {
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
          slug: 'landspitali',
          lang: locale,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: { namespace: 'OrganizationPages', lang: locale },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  const organizationNamespace = extractNamespaceFromOrganization(
    getOrganizationPage?.organization,
  )

  return {
    organizationPage: getOrganizationPage,
    namespace,
    customTopLoginButtonItem: organizationNamespace?.customTopLoginButtonItem,
    locale,
    showSearchInHeader: false,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.LandspitaliWebPaymentSuccessful,
    PaymentSuccessful,
  ),
)
