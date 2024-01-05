import React, { useState, useEffect } from 'react'
import {
  Breadcrumbs,
  GridColumn,
  GridRow,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Box, Button, Table as T, Pagination } from '@island.is/island-ui/core'
import { PAGE_SIZE, pages, paginate } from './pagination'
import { Screen } from '../../types'
import format from 'date-fns/format'
import { useRouter } from 'next/router'
import { useGetPetitionList, useGetPetitionListEndorsements } from './queries'
import { LinkType, linkResolver, useNamespace } from '@island.is/web/hooks'
import { SidebarLayout } from '@island.is/web/screens/Layouts/SidebarLayout'
import NextLink from 'next/link'
import { InstitutionPanel } from '@island.is/web/components'
import {
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'
import { useI18n } from '@island.is/web/i18n'
import PetitionSkeleton from './PetitionSkeleton'

interface PetitionViewProps {
  namespace?: Record<string, string>
}

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

const PetitionView: Screen<PetitionViewProps> = ({ namespace }) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  const { activeLocale } = useI18n()

  const { list, loading, error } = useGetPetitionList(
    router.query.slug as string,
  )

  const listEndorsements = useGetPetitionListEndorsements(
    router.query.slug as string,
  )

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pagePetitions, setPetitions] = useState(listEndorsements.data ?? [])

  const getBaseUrl = () => {
    const baseUrl =
      window.location.origin === 'http://localhost:4200'
        ? 'http://localhost:4242'
        : window.location.origin

    return `${baseUrl}/umsoknir/undirskriftalisti`
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const handlePagination = (page, petitions) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    setPetitions(listEndorsements.data ?? [])
    handlePagination(1, listEndorsements.data ?? [])
  }, [listEndorsements.data])

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
                {list.description}
              </Text>
            </Stack>
            <GridRow>
              <GridColumn span={['12/12', '4/12']}>
                <Text variant="h4" marginBottom={0}>
                  {n('listOpenFromTil', 'Gildistímabil lista:')}
                </Text>
                <Text variant="default">
                  {formatDate(list.openedDate) +
                    ' - ' +
                    formatDate(list.closedDate)}
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
                {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  pagePetitions?.map((petition) => {
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
                  })
                }
              </T.Body>
            </T.Table>
            {list.closedDate && new Date() <= new Date(list.closedDate) ? (
              pagePetitions && pagePetitions.length ? (
                <Box marginY={3}>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    renderLink={(page, className, children) => (
                      <Box
                        cursor="pointer"
                        className={className}
                        onClick={() =>
                          handlePagination(page, listEndorsements.data)
                        }
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
