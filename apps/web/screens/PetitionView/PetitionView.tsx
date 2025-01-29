import React, { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  Breadcrumbs,
  GridColumn,
  GridRow,
  Link,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Box, Button, Pagination, Table as T } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import { InstitutionPanel } from '@island.is/web/components'
import {
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, LinkType, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SidebarLayout } from '@island.is/web/screens/Layouts/SidebarLayout'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

import { Screen } from '../../types'
import PetitionSkeleton from './PetitionSkeleton'
import { useGetPetitionList, useGetPetitionListEndorsements } from './queries'
import { formatDate, getBaseUrl, pageSize } from './utils'

interface PetitionViewProps {
  namespace?: Record<string, string>
}

const PetitionView: Screen<PetitionViewProps> = ({ namespace }) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  const { activeLocale } = useI18n()

  const { list, loading, error } = useGetPetitionList(
    router.query.slug as string,
  )

  const [cursor, setCursor] = useState<string>('')
  const [pageDirection, setPageDirection] = useState<'before' | 'after' | ''>(
    '',
  )

  const { listEndorsements, loadingEndorsements, refetch } =
    useGetPetitionListEndorsements(
      router.query.slug as string,
      cursor,
      pageDirection,
    )

  const [page, setPage] = useState(1)

  useEffect(() => {
    refetch()
  }, [cursor, pageDirection])

  return (
    <Box>
      <SidebarLayout
        sidebarContent={
          <Box marginBottom={10}>
            <Stack space={3}>
              <Stack space={1}>
                <Box display={['none', 'none', 'block']} printHidden>
                  <Link
                    {...linkResolver('article', ['undirskriftalistar'])}
                    skipTab
                  >
                    <Button
                      preTextIcon="arrowBack"
                      preTextIconType="filled"
                      size="small"
                      type="button"
                      variant="text"
                      truncate
                    >
                      {n('goBack', 'Til baka')}
                    </Button>
                  </Link>
                </Box>
              </Stack>
              <InstitutionPanel
                img={
                  'https://images.ctfassets.net/8k0h54kbe6bj/2ETBroMeCKRQptFKNg83rW/2e1799555b5bf0f98b7ed985ce648b99/logo-square-400.png?h=250'
                }
                institutionTitle={n('institutionTitle', 'Þjónustuaðili')}
                institution={n('institution', 'Þjóðskrá')}
                locale={'is'}
                linkProps={{
                  href: 'https://island.is',
                }}
                imgContainerDisplay={['block', 'block', 'none', 'block']}
              />
            </Stack>
          </Box>
        }
      >
        <Box paddingBottom={[2, 2, 4]}>
          <Breadcrumbs
            tagVariant="blue"
            items={[
              {
                title: 'Ísland.is',
                typename: 'homepage',
                href: '/',
              },
              {
                title:
                  activeLocale === 'is'
                    ? 'Undirskriftalistar'
                    : 'Petition lists',
                typename: 'undirskriftalistar',
                href:
                  activeLocale === 'is'
                    ? '/undirskriftalistar'
                    : '/en/petitions',
              },
            ]}
            renderLink={(link, { typename, slug }) => {
              return (
                <NextLink
                  {...linkResolver(typename as LinkType, slug)}
                  passHref
                  legacyBehavior
                >
                  {link}
                </NextLink>
              )
            }}
          />
        </Box>
        {!loading && !error ? (
          <Box>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {list.title}
              </Text>
              <Text variant="default" marginBottom={3}>
                <Markdown>{list.description ?? ''}</Markdown>
              </Text>
            </Stack>
            <GridRow>
              <GridColumn span={['12/12', '4/12']}>
                <Text variant="h4" marginBottom={0}>
                  {n('listOpenFromTil', 'Gildistímabil lista:')}
                </Text>
                <Text variant="default">
                  {formatDate(String(list.openedDate)) +
                    ' - ' +
                    formatDate(String(list.closedDate))}
                </Text>
              </GridColumn>
              <GridColumn span={['12/12', '4/12']}>
                <Text variant="h4" marginTop={[2, 0]}>
                  {n('listOwner', 'Ábyrgðarmaður:')}
                </Text>
                <Text variant="default">{list.ownerName}</Text>
              </GridColumn>
              <GridColumn span={['12/12', '4/12']}>
                <Text variant="h4" marginTop={[2, 0]}>
                  {n('signedPetitions', 'Fjöldi undirskrifta:')}
                </Text>
                <Text variant="default">{listEndorsements.totalCount}</Text>
              </GridColumn>
            </GridRow>
            {list.closedDate && new Date() <= new Date(list.closedDate) && (
              <>
                <Box marginTop={6} marginBottom={8}>
                  <Button
                    variant="primary"
                    iconType="outline"
                    icon="open"
                    onClick={() =>
                      window?.open(`${getBaseUrl()}/${list.meta.applicationId}`)
                    }
                  >
                    {n('putMyNameOnTheList', 'Setja nafn mitt á þennan lista')}
                  </Button>
                </Box>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData>{n('signedDate', 'Dagsetning')}</T.HeadData>
                      <T.HeadData>{n('name', 'Nafn')}</T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {loadingEndorsements &&
                      Array.from({ length: 10 }, (_, i) => (
                        <T.Row key={i}>
                          <T.Data>
                            <SkeletonLoader height={20} />
                          </T.Data>
                          <T.Data>
                            <SkeletonLoader height={20} />
                          </T.Data>
                        </T.Row>
                      ))}
                    {!loadingEndorsements &&
                      listEndorsements.data
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        ?.map((petition) => {
                          return (
                            <T.Row key={petition.id}>
                              <T.Data text={{ variant: 'medium' }}>
                                {formatDate(petition.created)}
                              </T.Data>
                              <T.Data text={{ variant: 'medium' }}>
                                {petition.meta.fullName
                                  ? petition.meta.fullName
                                  : n('noName', 'Nafn ekki skráð')}
                              </T.Data>
                            </T.Row>
                          )
                        })}
                  </T.Body>
                </T.Table>
              </>
            )}
            {list.closedDate && new Date() <= new Date(list.closedDate) ? (
              listEndorsements.data?.length && !loadingEndorsements ? (
                <Box marginY={3}>
                  <Pagination
                    page={page}
                    totalItems={listEndorsements.totalCount}
                    itemsPerPage={pageSize}
                    renderLink={(p, className, children) => (
                      <Box
                        cursor="pointer"
                        className={className}
                        component="button"
                        onClick={() => {
                          setPage(p)
                          if (
                            p > page &&
                            listEndorsements.pageInfo.hasNextPage
                          ) {
                            setPageDirection('after')
                            setCursor(listEndorsements.pageInfo.endCursor ?? '')
                          } else if (
                            p < page &&
                            listEndorsements.pageInfo.hasPreviousPage
                          ) {
                            setPageDirection('before')
                            setCursor(
                              listEndorsements.pageInfo.startCursor ?? '',
                            )
                          }
                        }}
                      >
                        {children}
                      </Box>
                    )}
                  />
                </Box>
              ) : (
                <Text marginTop={2}>
                  {n('noPetitions', 'Engar undirskriftir komnar')}
                </Text>
              )
            ) : (
              <Text marginY={7} variant="h3">
                {n('listIsClosed', 'Undirskriftalistinn er lokaður')}
              </Text>
            )}
          </Box>
        ) : loading ? (
          <PetitionSkeleton />
        ) : (
          <Text marginY={7} variant="h3">
            {n('listDoesntExist', 'Undirskriftalisti er ekki til')}
          </Text>
        )}
      </SidebarLayout>
    </Box>
  )
}

PetitionView.getProps = async ({ apolloClient, locale }) => {
  const [namespace] = await Promise.all([
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'PetitionView',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        return JSON.parse(variables?.data?.getNamespace?.fields || '{}')
      }),
  ])

  return {
    namespace,
  }
}

export default withMainLayout(PetitionView)
