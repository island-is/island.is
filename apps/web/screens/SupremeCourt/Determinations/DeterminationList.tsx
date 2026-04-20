import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { parseAsInteger, useQueryState } from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  LoadingDots,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { CustomPageUniqueIdentifier } from '@island.is/shared/types'
import { OrganizationWrapper, Webreader } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier as GraphQLCustomPageUniqueIdentifier,
  type GetSupremeCourtDeterminationsQuery,
  type GetSupremeCourtDeterminationsQueryVariables,
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
import { GET_SUPREME_COURT_DETERMINATIONS_QUERY } from '../../queries/SupremeCourtDeterminations'
import { InfoCardGrid } from '../../Verdicts/components/InfoCardGrid'
import { m } from './translations.strings'

interface DeterminationsProps {
  initialData: GetSupremeCourtDeterminationsQuery['webSupremeCourtDeterminations']
  organizationPage: OrganizationPage
  namespace: Record<string, string>
}

const Determinations: CustomScreen<DeterminationsProps> = ({
  initialData,
  organizationPage,
  namespace,
  customPageData,
}) => {
  const { format } = useDateUtils()
  const [_page, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({
      clearOnDefault: true,
    }),
  )
  const initialRender = useRef(true)
  const determinationListHeading = useRef<HTMLDivElement>(null)

  const page = _page ?? 1

  const [determinations, setDeterminations] =
    useState<
      GetSupremeCourtDeterminationsQuery['webSupremeCourtDeterminations']
    >(initialData)

  const [fetchDeterminations, { loading, error }] = useLazyQuery<
    GetSupremeCourtDeterminationsQuery,
    GetSupremeCourtDeterminationsQueryVariables
  >(GET_SUPREME_COURT_DETERMINATIONS_QUERY, {
    onCompleted(data) {
      setDeterminations(data.webSupremeCourtDeterminations)
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
    fetchDeterminations({
      variables: {
        input: { page },
      },
    })
  }, [page, fetchDeterminations])

  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()

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
          <Text ref={determinationListHeading} variant="h1" as="h1">
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
              title="Ekki tókst að sækja ákvarðanir"
              message="Villa kom upp við að sækja ákvarðanir"
            />
          )}

          {determinations && (
            <Stack space={3}>
              <Stack space={3}>
                <InfoCardGrid
                  cards={determinations.items.map((item) => {
                    return {
                      description: item.title,
                      eyebrow: format(new Date(item.date), 'd. MMMM yyyy'),
                      id: item.id,
                      link: {
                        href: `/s/haestirettur/akvardanir/${item.id}`,
                        label: '',
                      },
                      title: item.caseNumber,
                      subDescription: item.keywords.join(', '),
                      borderColor: 'blue200',
                      detailLines: [],
                    }
                  })}
                  variant="detailed"
                  columns={1}
                />
              </Stack>
              <Pagination
                page={page}
                totalItems={determinations?.total}
                renderLink={(page, className, children) => (
                  <button
                    className={className}
                    onClick={() => {
                      setPage(page)
                      determinationListHeading.current?.scrollIntoView({
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

Determinations.getProps = async ({ apolloClient, query, locale }) => {
  const page = parseAsInteger.parseServerSide(query.page) ?? 1

  const [{ data }, organizationPage, namespace] = await Promise.all([
    apolloClient.query<
      GetSupremeCourtDeterminationsQuery,
      GetSupremeCourtDeterminationsQueryVariables
    >({
      query: GET_SUPREME_COURT_DETERMINATIONS_QUERY,
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
    initialData: data.webSupremeCourtDeterminations,
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
    CustomPageUniqueIdentifier.SupremeCourtDeterminations as GraphQLCustomPageUniqueIdentifier,
    Determinations,
  ),
  {
    footerVersion: 'organization',
  },
)
