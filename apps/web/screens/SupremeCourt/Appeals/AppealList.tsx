import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { parseAsInteger, useQueryState } from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Inline,
  LoadingDots,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { CustomPageUniqueIdentifier } from '@island.is/shared/types'
import { OrganizationWrapper, Webreader } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier as GraphQLCustomPageUniqueIdentifier,
  type GetSupremeCourtAppealsQuery,
  type GetSupremeCourtAppealsQueryVariables,
  OrganizationPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { getSubpageNavList } from '../../Organization/SubPage'
import { GET_NAMESPACE_QUERY } from '../../queries/Namespace'
import { GET_ORGANIZATION_PAGE_QUERY } from '../../queries/Organization'
import { GET_SUPREME_COURT_APPEALS_QUERY } from '../../queries/SupremeCourtAppeals'
import { m } from './translations.strings'

const DateField = ({ label, date }: { label: string; date: string }) => {
  return (
    <Inline space={0} flexWrap="wrap" alignY="center">
      <Box style={{ paddingRight: '3px' }}>
        <Text variant="medium" fontWeight="light">
          {label}
        </Text>
      </Box>
      <Text variant="medium" fontWeight="light">
        {date}
      </Text>
    </Inline>
  )
}

interface AppealsProps {
  initialData: GetSupremeCourtAppealsQuery['webSupremeCourtAppeals']
  organizationPage: OrganizationPage
  namespace: Record<string, string>
}

const Appeals: CustomScreen<AppealsProps> = ({
  initialData,
  organizationPage,
  namespace,
  customPageData,
}) => {
  const [_page, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({
      clearOnDefault: true,
    }),
  )
  const initialRender = useRef(true)
  const appealListHeading = useRef<HTMLDivElement>(null)

  const page = _page ?? 1

  const [appeals, setAppeals] =
    useState<GetSupremeCourtAppealsQuery['webSupremeCourtAppeals']>(initialData)

  const [fetchAppeals, { loading, error }] = useLazyQuery<
    GetSupremeCourtAppealsQuery,
    GetSupremeCourtAppealsQueryVariables
  >(GET_SUPREME_COURT_APPEALS_QUERY, {
    onCompleted(data) {
      setAppeals(data.webSupremeCourtAppeals)
    },
  })

  const router = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    fetchAppeals({
      variables: {
        input: { page },
      },
    })
  }, [page, fetchAppeals])

  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()
  const { format } = useDateUtils()

  const renderVerdictDate = useCallback(
    (appeal: typeof appeals['items'][number]) => {
      if (!appeal || !appeal.verdictDate) return null

      const today = new Date()
      const isInFuture = today < new Date(appeal.verdictDate)
      const formattedDate = format(
        new Date(appeal.verdictDate ?? ''),
        'd. MMMM yyyy',
      )
      if (isInFuture)
        return (
          <DateField
            label={formatMessage(m.listPage.verdictDateInFuturePrefix)}
            date={formattedDate}
          />
        )
      return (
        <DateField
          label={formatMessage(m.listPage.verdictDateInPastSuffix)}
          date={formattedDate}
        />
      )
    },
    [format, formatMessage],
  )

  const renderRegistrationDate = useCallback(
    (appeal: typeof appeals['items'][number]) => {
      if (!appeal) return null

      if (appeal.appealPolicyDate)
        return (
          <DateField
            label={formatMessage(m.listPage.appealPolicyDatePrefix)}
            date={format(
              new Date(appeal.appealPolicyDate ?? ''),
              'd. MMMM yyyy',
            )}
          />
        )

      if (appeal.registrationDate)
        return (
          <DateField
            label={formatMessage(m.listPage.registrationDatePrefix)}
            date={format(
              new Date(appeal.registrationDate ?? ''),
              'd. MMMM yyyy',
            )}
          />
        )

      return null
    },
    [format, formatMessage],
  )

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      pageTitle={formatMessage(m.listPage.heading)}
      navigationData={{
        items: getSubpageNavList(organizationPage, router),
        title: n('navigationTitle', 'Efnisyfirlit'),
      }}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
    >
      <Stack space={2}>
        <Stack space={2}>
          <Text ref={appealListHeading} variant="h1" as="h1">
            {formatMessage(m.listPage.heading)}
          </Text>
          <Webreader
            marginTop={0}
            marginBottom={0}
            readId={undefined}
            readClass="rs_read"
          />
        </Stack>

        {customPageData?.content && customPageData.content.length > 0 && (
          <Box>
            {webRichText(customPageData.content, undefined, activeLocale)}
          </Box>
        )}

        <Stack space={3}>
          <Box
            display="flex"
            justifyContent="center"
            style={{ visibility: loading && !error ? 'visible' : 'hidden' }}
          >
            <LoadingDots />
          </Box>

          {error && (
            <AlertMessage
              type="error"
              title="Ekki tókst að sækja áfrýjuð mál"
              message="Villa kom upp við að sækja áfrýjuð mál"
            />
          )}

          {appeals && (
            <Stack space={3}>
              <Stack space={3}>
                {appeals.items.map((item) => {
                  return (
                    <Box
                      key={item.id}
                      background="white"
                      borderColor="blue200"
                      borderWidth="standard"
                      borderRadius="large"
                      padding={2}
                    >
                      <Stack space={2}>
                        <Inline
                          space={1}
                          alignY="center"
                          flexWrap="wrap"
                          justifyContent="spaceBetween"
                        >
                          <Text variant="h3">{item.caseNumber}</Text>
                          {renderVerdictDate(item)}
                        </Inline>
                        <Text variant="medium" fontWeight="light">
                          {item.title}
                        </Text>
                        {renderRegistrationDate(item)}
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
              <Pagination
                page={page}
                totalItems={appeals?.total}
                renderLink={(page, className, children) => (
                  <button
                    className={className}
                    onClick={() => {
                      setPage(page)
                      appealListHeading.current?.scrollIntoView({
                        behavior: 'instant',
                      })
                    }}
                  >
                    {children}
                  </button>
                )}
                itemsPerPage={10}
                variant="purple"
              />
            </Stack>
          )}
        </Stack>
      </Stack>
    </OrganizationWrapper>
  )
}

Appeals.getProps = async ({ apolloClient, query, locale }) => {
  const page = parseAsInteger.parseServerSide(query.page) ?? 1

  const [{ data }, organizationPage, namespace] = await Promise.all([
    apolloClient.query<
      GetSupremeCourtAppealsQuery,
      GetSupremeCourtAppealsQueryVariables
    >({
      query: GET_SUPREME_COURT_APPEALS_QUERY,
      variables: {
        input: {
          page,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: { slug: 'haestirettur', lang: locale },
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

  if (!organizationPage?.data?.getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    initialData: data.webSupremeCourtAppeals,
    organizationPage: organizationPage.data.getOrganizationPage,
    namespace,
    languageToggleHrefOverride: {
      is: '',
      en: '',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.SupremeCourtAppeals as GraphQLCustomPageUniqueIdentifier,
    Appeals,
  ),
  {
    footerVersion: 'organization',
  },
)
