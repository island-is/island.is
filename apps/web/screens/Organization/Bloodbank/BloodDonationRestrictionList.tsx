import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { parseAsInteger, useQueryState } from 'next-usequerystate'

import {
  Box,
  Button,
  FocusableBox,
  GridContainer,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { OrganizationWrapper, Webreader } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  OrganizationPage,
  Query,
  QueryGetBloodDonationRestrictionsArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { GET_BLOOD_DONATION_RESTRICTIONS_QUERY } from '../../queries/BloodDonationRestrictions'
import { getSubpageNavList } from '../SubPage'
import { m } from './messages.strings'

const ITEMS_PER_PAGE = 10

interface BloodDonationRestrictionListProps {
  totalItems: number
  currentPage: number
  items: Query['getBloodDonationRestrictions']['items']
  organizationPage: OrganizationPage
  namespace: Record<string, string>
}

const BloodDonationRestrictionList: CustomScreen<
  BloodDonationRestrictionListProps
> = ({ currentPage, totalItems, items, organizationPage, namespace }) => {
  const { formatMessage } = useIntl()
  const [_, setSelectedPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        clearOnDefault: true,
        shallow: false,
      })
      .withDefault(1),
  )
  const router = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  useLocalLinkTypeResolver()

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      navigationData={{
        items: getSubpageNavList(organizationPage, router),
        title: n('navigationTitle', 'Efnisyfirlit'),
      }}
      pageTitle={formatMessage(m.listPage.mainHeading)}
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
      ]}
    >
      <Box paddingBottom={3} className="rs_read">
        <GridContainer>
          <Stack space={5}>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {formatMessage(m.listPage.mainHeading)}
              </Text>
              <Webreader marginTop={0} marginBottom={0} readClass="rs_read" />
            </Stack>
            <Stack space={4}>
              {items.map((item) => (
                <FocusableBox
                  key={item.id}
                  href={`${
                    new URL(router.asPath, 'https://island.is').pathname
                  }/${item.id}`}
                  borderRadius="standard"
                  borderColor="blue200"
                  borderWidth="standard"
                  paddingX={3}
                  paddingY={2}
                  width="full"
                  display="flex"
                  flexDirection="column"
                  rowGap={2}
                  columnGap={2}
                >
                  <Text variant="h4" color="blue400">
                    {item.title}
                  </Text>
                  {item.hasCardText && (
                    <Box
                      background="dark100"
                      paddingX={3}
                      paddingY={2}
                      borderRadius="standard"
                      width="full"
                    >
                      <Text variant="h5">
                        {formatMessage(m.listPage.cardSubheading)}
                      </Text>
                      <Text as="div">{webRichText(item.cardText)}</Text>
                      {item.hasDetailedText && (
                        <Button
                          size="small"
                          variant="text"
                          icon="arrowForward"
                          unfocusable={true}
                          as="span"
                        >
                          {formatMessage(m.listPage.arrowLinkLabel)}
                        </Button>
                      )}
                    </Box>
                  )}
                  {Boolean(item.description) && (
                    <Text variant="medium">{item.description}</Text>
                  )}
                  {Boolean(item.keywordsText) && (
                    <Text variant="small">
                      {formatMessage(m.listPage.keywordsTextPrefix)}
                      {item.keywordsText}
                    </Text>
                  )}
                </FocusableBox>
              ))}
            </Stack>
            {totalItems > ITEMS_PER_PAGE && (
              <Pagination
                variant="blue"
                page={currentPage}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                renderLink={(page, className, children) => (
                  <button
                    onClick={() => {
                      setSelectedPage(page)
                    }}
                  >
                    <span className={className}>{children}</span>
                  </button>
                )}
              />
            )}
          </Stack>
        </GridContainer>
      </Box>
    </OrganizationWrapper>
  )
}

BloodDonationRestrictionList.getProps = async ({
  query,
  apolloClient,
  customPageData,
  locale,
}) => {
  let page = parseAsInteger.parseServerSide(query.page) ?? 1
  if (page < 1) {
    page = 1
  }

  if (!customPageData?.configJson?.showListPage) {
    throw new CustomNextError(
      404,
      'Blood donation restriction list page has been turned off in the CMS',
    )
  }

  const organizationPageSlug =
    locale === 'is' ? 'blodbankinn' : 'icelandic-blood-bank'

  const [
    bloodDonationRestrictionResponse,
    organizationPageResponse,
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetBloodDonationRestrictionsArgs>({
      query: GET_BLOOD_DONATION_RESTRICTIONS_QUERY,
      variables: {
        input: {
          page,
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

  if (!organizationPageResponse.data.getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: "${organizationPageSlug}" was not found`,
    )
  }

  return {
    totalItems:
      bloodDonationRestrictionResponse.data.getBloodDonationRestrictions.total,
    currentPage: page,
    items:
      bloodDonationRestrictionResponse.data.getBloodDonationRestrictions.items,
    organizationPage: organizationPageResponse.data.getOrganizationPage,
    namespace,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.BloodDonationRestrictions,
    BloodDonationRestrictionList,
  ),
  {
    footerVersion: 'organization',
  },
)
