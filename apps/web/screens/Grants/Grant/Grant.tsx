import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  ActionCard,
  Box,
  Breadcrumbs,
  Divider,
  Hidden,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { GrantWrapper, InstitutionPanel } from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  Grant,
  Query,
  QueryGetSingleGrantArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_GRANT_QUERY } from '../../queries'
import { m } from '../messages'
import { generateStatusTag, parseStatus } from '../utils'
import DetailPanel from './GrantSidebar/DetailPanel'
import ExtraPanel from './GrantSidebar/ExtraPanel'
import { GrantSidebar } from './GrantSidebar/GrantSidebar'

const GrantSinglePage: CustomScreen<GrantSingleProps> = ({
  grant,
  locale,
  customPageData,
}) => {
  useContentfulId(customPageData?.id, grant?.id)
  useLocalLinkTypeResolver()

  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()
  const router = useRouter()

  const baseUrl = linkResolver('grantsplaza', [], locale).href
  const searchUrl = linkResolver('grantsplazasearch', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.home.title),
      href: baseUrl,
    },
    {
      title: formatMessage(m.search.results),
      href: searchUrl,
    },
  ]

  const status = useMemo(
    () => (grant ? parseStatus(grant, formatMessage, locale) : null),
    [grant, formatMessage, locale],
  )

  if (!grant) {
    return null
  }

  const applicationStatusLabel = status?.applicationStatus
    ? generateStatusTag(status.applicationStatus, formatMessage)?.label
    : undefined

  return (
    <GrantWrapper
      pageTitle={grant.name}
      pageDescription={grant?.description ?? ''}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <SidebarLayout
        sidebarContent={<GrantSidebar locale={locale} grant={grant} />}
      >
        <Stack space={4}>
          <Box>
            <Breadcrumbs
              items={breadcrumbItems ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href} legacyBehavior>
                    {link}
                  </NextLink>
                ) : (
                  link
                )
              }}
            />

            <Text as="h1" variant="h1" marginTop={2} marginBottom={2}>
              {grant.name}
            </Text>
            <Text variant="default">{grant.description}</Text>
          </Box>
          <Hidden above="sm">
            <DetailPanel grant={grant} locale={locale} button />
          </Hidden>
          <Hidden below="md">
            <ActionCard
              heading={grant.name}
              text={
                applicationStatusLabel
                  ? `${applicationStatusLabel}${
                      status?.deadlineStatus
                        ? ' / ' + status.deadlineStatus
                        : ''
                    }`
                  : undefined
              }
              backgroundColor="blue"
              cta={{
                disabled:
                  status?.applicationStatus === 'closed' ||
                  status?.applicationStatus === 'unknown',
                size: 'small',
                label:
                  grant.applicationButtonLabel ?? formatMessage(m.single.apply),
                onClick: () => router.push(grant.applicationUrl?.slug ?? ''),
                icon: 'open',
                iconType: 'outline',
              }}
            />
          </Hidden>
          {grant.specialEmphasis?.length ? (
            <>
              <Box className="rs_read">
                {status?.note && <Text fontWeight="medium">{status.note}</Text>}
                {webRichText(
                  grant.specialEmphasis as SliceType[],
                  undefined,
                  locale,
                )}
              </Box>
              <Divider />
            </>
          ) : undefined}
          {grant.whoCanApply?.length ? (
            <>
              <Box>
                <Text variant="h3">{formatMessage(m.single.whoCanApply)}</Text>
                <Box className="rs_read">
                  {webRichText(
                    grant.whoCanApply as SliceType[],
                    undefined,
                    locale,
                  )}
                </Box>
              </Box>
              <Divider />
            </>
          ) : undefined}
          {grant.howToApply?.length ? (
            <>
              <Box>
                <Text variant="h3">{formatMessage(m.single.howToApply)}</Text>
                <Box className="rs_read">
                  {webRichText(
                    grant.howToApply as SliceType[],
                    undefined,
                    locale,
                  )}
                </Box>
              </Box>
              <Divider />
            </>
          ) : undefined}

          {grant.answeringQuestions?.length ? (
            <>
              <Box>
                <Text variant="h3">
                  {formatMessage(m.single.answeringQuestions)}
                </Text>
                <Box className="rs_read">
                  {webRichText(
                    grant.answeringQuestions as SliceType[],
                    undefined,
                    locale,
                  )}
                </Box>
              </Box>
              <Divider />
            </>
          ) : undefined}

          {grant.applicationHints?.length ? (
            <Box className="rs_read">
              {webRichText(
                grant.applicationHints as SliceType[],
                undefined,
                locale,
              )}
            </Box>
          ) : undefined}
          {(grant.files || grant.supportLinks) && (
            <Hidden above="md">
              <ExtraPanel grant={grant} />
            </Hidden>
          )}
          <Hidden above="md">
            <InstitutionPanel
              institutionTitle={formatMessage(m.single.provider)}
              institution={
                grant.fund?.parentOrganization.title ??
                formatMessage(m.single.unknownInstitution)
              }
              img={grant.fund?.parentOrganization.logo?.url}
              locale={locale}
            />
          </Hidden>
        </Stack>
      </SidebarLayout>
    </GrantWrapper>
  )
}

interface GrantSingleProps {
  grant?: Grant
  locale: Locale
}

const GrantSingle: CustomScreen<GrantSingleProps> = ({
  grant,
  customPageData,
  locale,
}) => {
  return (
    <GrantSinglePage
      grant={grant}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantSingle.getProps = async ({ apolloClient, locale, query }) => {
  const {
    data: { getSingleGrant: grant },
  } = await apolloClient.query<Query, QueryGetSingleGrantArgs>({
    query: GET_GRANT_QUERY,
    variables: {
      input: {
        lang: locale as ContentLanguage,
        id: String(query.id),
      },
    },
  })

  if (!grant) {
    throw new CustomNextError(404, 'Grant not found')
  }

  return {
    grant: grant ?? undefined,
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Grants, GrantSingle),
)
