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
import format from 'date-fns/format'
import { useRouter } from 'next/router'
import { useGetPetitionList, useGetPetitionListEndorsements } from './queries'
import { LinkType, linkResolver, useNamespace } from '@island.is/web/hooks'
import { SidebarLayout } from '@island.is/web/screens/Layouts/SidebarLayout'
import NextLink from 'next/link'
import { InstitutionPanel } from '@island.is/web/components'

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

const PetitionView = ({ namespace }: PetitionViewProps) => {
  const n = useNamespace(namespace)
  const router = useRouter()

  const { list } = useGetPetitionList(router.query.slug as string)
  const listEndorsements = useGetPetitionListEndorsements(
    router.query.slug as string,
  )

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pagePetitions, setPetitions] = useState(listEndorsements.data ?? [])

  const relatedContentKey = 'undirskriftalistar-stofna-nyjan-lista'

  const getBaseUrl = () => {
    const baseUrl =
      window.location.origin === 'http://localhost:4200'
        ? 'http://localhost:4242'
        : window.location.origin

    return `${baseUrl}/umsoknir/undirskriftalisti/`
  }

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
              <Box
                background="purple100"
                borderRadius="large"
                padding={[3, 3, 4]}
              >
                <Stack space={[1, 1, 2]}>
                  <Text variant="eyebrow" as="h2">
                    {n('relatedContent', 'Tengt efni')}
                  </Text>
                  <Link
                    key={relatedContentKey}
                    href={`/${relatedContentKey}`}
                    underline="normal"
                  >
                    <Text key={relatedContentKey} as="span">
                      {n(
                        'relatedContentTitle',
                        'Undirskriftalistar – stofna nýjan lista',
                      )}
                    </Text>
                  </Link>
                </Stack>
              </Box>
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
                title: 'Undirskriftalistar',
                typename: 'undirskriftalistar',
                href: '/undirskriftalistar',
              },
            ]}
            renderLink={(link, { typename, slug }) => {
              return (
                <NextLink
                  {...linkResolver(typename as LinkType, slug)}
                  passHref
                >
                  {link}
                </NextLink>
              )
            }}
          />
        </Box>
        <Stack space={2}>
          <Text variant="h1" as="h1">
            {list.title}
          </Text>
          <Text variant="default" marginBottom={3}>
            {list.description}
          </Text>
        </Stack>
        <GridRow>
          <GridColumn span="5/12">
            <Text variant="h4" marginBottom={0}>
              {n('listOpenFromTil', 'Tímabil lista:')}
            </Text>
            <Text variant="default">
              {formatDate(list.openedDate) +
                ' - ' +
                formatDate(list.closedDate)}
            </Text>
          </GridColumn>
          <GridColumn span="7/12">
            <Text variant="h4">{n('listOwner', 'Ábyrgðarmaður:')}</Text>
            <Text variant="default">{list.ownerName}</Text>
          </GridColumn>
        </GridRow>
        <GridRow marginTop={2}>
          <GridColumn span="6/12">
            <Text variant="h4">{n('signedPetitions', 'Fjöldi skráðir:')}</Text>
            <Text variant="default">{listEndorsements.totalCount}</Text>
          </GridColumn>
        </GridRow>
        <Box marginTop={6} marginBottom={8}>
          <Button
            variant="primary"
            icon="arrowForward"
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
            {pagePetitions?.map((petition) => {
              return (
                <T.Row key={petition.id}>
                  <T.Data>{formatDate(list.created)}</T.Data>
                  <T.Data>
                    {petition.meta.fullName
                      ? petition.meta.fullName
                      : n('noName', 'Nafn ótilgreint')}
                  </T.Data>
                </T.Row>
              )
            })}
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
      </SidebarLayout>
    </Box>
  )
}

export default withMainLayout(PetitionView)
