import { useIntl } from 'react-intl'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  ActionCard,
  Box,
  Breadcrumbs,
  Divider,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { GrantWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  Grant,
  Query,
  QueryGetSingleGrantArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { webRichText } from '@island.is/web/utils/richText'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_GRANT_QUERY } from '../../queries'
import { m } from '../messages'
import { GrantSidebar } from './GrantSidebar'

const GrantSinglePage: CustomScreen<GrantSingleProps> = ({ grant, locale }) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()
  const router = useRouter()

  const baseUrl = linkResolver('styrkjatorg', [], locale).href
  const currentUrl = linkResolver(
    'styrkjatorggrant',
    [grant?.applicationId ?? ''],
    locale,
  ).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: 'Styrkjatorg',
      href: baseUrl,
    },
    {
      title: grant?.name ?? 'Styrkur',
      href: currentUrl,
      isTag: true,
    },
  ]

  if (!grant) {
    return null
  }

  return (
    <GrantWrapper
      pageTitle={'Styrkur'}
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
          <ActionCard
            heading={grant.name}
            backgroundColor="blue"
            cta={{
              disabled: !grant.applicationUrl?.slug,
              label: 'Sækja um',
              onClick: () => router.push(grant.applicationUrl?.slug ?? ''),
              icon: 'open',
              iconType: 'outline',
            }}
          />
          {grant.whatIsGranted.length ? (
            <Box>
              <Text variant="h3">{formatMessage(m.single.whatIsGranted)}</Text>
              <Box className="rs_read">
                {webRichText(
                  grant.whatIsGranted as SliceType[],
                  undefined,
                  locale,
                )}
              </Box>
            </Box>
          ) : undefined}
          {grant.specialEmphasis.length ? (
            <>
              <Box>
                <Text variant="h3">
                  {formatMessage(m.single.specialEmphasis)}
                </Text>
                <Box className="rs_read">
                  {webRichText(
                    grant.specialEmphasis as SliceType[],
                    undefined,
                    locale,
                  )}
                </Box>
              </Box>
              <Divider />
            </>
          ) : undefined}
          {grant.whoCanApply.length ? (
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
          {grant.howToApply.length ? (
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
          ) : undefined}
          {grant.applicationDeadline.length ? (
            <Box>
              <Text variant="h4">{formatMessage(m.single.deadline)}</Text>
              <Box className="rs_read">
                {webRichText(
                  grant.applicationDeadline as SliceType[],
                  undefined,
                  locale,
                )}
              </Box>
            </Box>
          ) : undefined}
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
