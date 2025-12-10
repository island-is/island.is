import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Stack, Text } from '@island.is/island-ui/core'
import {
  HeadWithSocialSharing,
  OrganizationWrapper,
  Webreader,
} from '@island.is/web/components'
import {
  BloodDonationRestrictionDetails as BloodDonationRestrictionDetailsItem,
  CustomPageUniqueIdentifier,
  OrganizationPage,
  Query,
  QueryGetBloodDonationRestrictionDetailsArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { GET_BLOOD_DONATION_RESTRICTION_DETAILS_QUERY } from '../../queries/BloodDonationRestrictions'
import { getSubpageNavList } from '../SubPage'
import { m } from './messages.strings'

interface BloodDonationRestrictionDetailsProps {
  item: BloodDonationRestrictionDetailsItem
  namespace: Record<string, string>
  organizationPage: OrganizationPage
}

const BloodDonationRestrictionDetails: CustomScreen<
  BloodDonationRestrictionDetailsProps
> = ({ item, organizationPage, namespace }) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()

  useLocalLinkTypeResolver()

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      navigationData={{
        items: getSubpageNavList(organizationPage, router),
        title: n('navigationTitle', 'Efnisyfirlit'),
      }}
      pageTitle={`${item.title} | ${organizationPage.title}`}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title ?? '',
          href: linkResolver('organizationpage', [organizationPage?.slug ?? ''])
            .href,
        },
        {
          title: formatMessage(m.listPage.mainHeading),
          href:
            activeLocale === 'is'
              ? '/s/blodbankinn/ahrif-a-blodgjof'
              : '/en/o/icelandic-blood-bank/affecting-factors',
        },
      ]}
    >
      <HeadWithSocialSharing
        title={`${item.title} | ${organizationPage.title}`}
      >
        <meta name="robots" content="noindex, nofollow" />
      </HeadWithSocialSharing>
      <Box className="rs_read">
        <Stack space={5}>
          <Stack space={2}>
            <Text variant="h1" as="h1">
              {item.title}
            </Text>
            <Webreader readClass="rs_read" marginBottom={0} marginTop={0} />
          </Stack>
          {Boolean(item.description) && <Text>{item.description}</Text>}
          {item.hasCardText && (
            <Box
              background="dark100"
              paddingX={3}
              paddingY={2}
              borderRadius="standard"
              width="full"
            >
              <Text variant="h2" as="h2">
                {formatMessage(m.detailsPage.cardSubheading)}
              </Text>
              <Text as="div">{webRichText(item.cardText)}</Text>
            </Box>
          )}
          {item.hasDetailedText && (
            <Stack space={0}>
              <Text variant="h2" as="h2">
                {formatMessage(m.detailsPage.detailTextHeading)}
              </Text>
              <Text as="div">{webRichText(item.detailedText)}</Text>
            </Stack>
          )}
          {Boolean(item.keywordsText) && (
            <Text variant="small">
              {formatMessage(m.listPage.keywordsTextPrefix)}
              {item.keywordsText}
            </Text>
          )}
        </Stack>
      </Box>
    </OrganizationWrapper>
  )
}

BloodDonationRestrictionDetails.getProps = async ({
  query,
  apolloClient,
  customPageData,
  locale,
}) => {
  if (!customPageData?.configJson?.showDetailsPage) {
    throw new CustomNextError(
      404,
      'Blood donation restriction details pages have been turned off in the CMS',
    )
  }

  const organizationPageSlug =
    locale === 'is' ? 'blodbankinn' : 'icelandic-blood-bank'

  const [
    bloodDonationRestrictionDetailsResponse,
    organizationPageResponse,
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetBloodDonationRestrictionDetailsArgs>({
      query: GET_BLOOD_DONATION_RESTRICTION_DETAILS_QUERY,
      variables: {
        input: {
          id: query.id as string,
          lang: locale,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationPageSlug,
          lang: locale,
          subpageSlugs: [
            locale === 'is' ? 'ahrif-a-blodgjof' : 'affecting-factors',
          ],
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
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (
    !bloodDonationRestrictionDetailsResponse.data
      .getBloodDonationRestrictionDetails
  ) {
    throw new CustomNextError(
      404,
      'Blood donation restriction details not found',
    )
  }

  if (!organizationPageResponse.data.getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: "${organizationPageSlug}" was not found`,
    )
  }

  return {
    item: bloodDonationRestrictionDetailsResponse.data
      .getBloodDonationRestrictionDetails,
    namespace,
    organizationPage: organizationPageResponse.data.getOrganizationPage,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.BloodDonationRestrictions,
    BloodDonationRestrictionDetails,
  ),
  {
    footerVersion: 'organization',
  },
)
