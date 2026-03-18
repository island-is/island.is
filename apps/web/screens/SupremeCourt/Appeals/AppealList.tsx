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
import { InfoCardGrid } from '../../Verdicts/components/InfoCardGrid'
import { m } from './translations.strings'

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
  const { format } = useDateUtils()
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
                <InfoCardGrid
                  cards={appeals.items.map((item) => {
                    return {
                      description: item.title,
                      eyebrow: '',
                      id: item.id,
                      link: {
                        href: '/s/haestirettur/afryjud-mal',
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
