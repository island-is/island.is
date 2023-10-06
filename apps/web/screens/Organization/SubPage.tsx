/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useMemo } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  NavigationItem,
  Stack,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
  Slice,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import {
  getThemeConfig,
  SliceMachine,
  OrganizationWrapper,
  SliceDropdown,
  Form,
  Webreader,
  SignLanguageButton,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { SliceType } from '@island.is/island-ui/contentful'
import { ParsedUrlQuery } from 'querystring'
import { useRouter } from 'next/router'
import { scrollTo } from '@island.is/web/hooks/useScrollSpy'
import { webRichText } from '@island.is/web/utils/richText'
import { useI18n } from '@island.is/web/i18n'
import { Locale } from 'locale'
import { safelyExtractPathnameFromUrl } from '@island.is/web/utils/safelyExtractPathnameFromUrl'

interface SubPageProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  namespace: Record<string, string>
  locale: Locale
}

const TOC: FC<React.PropsWithChildren<{ slices: Slice[]; title: string }>> = ({
  slices,
  title,
}) => {
  const navigation = useMemo(
    () =>
      slices
        .map((slice) => ({
          id: slice.id,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          text: slice['title'] ?? slice['leftTitle'] ?? '',
        }))
        .filter((item) => !!item.text),
    [slices],
  )
  if (navigation.length === 0) {
    return null
  }
  return (
    <Box marginY={2}>
      <TableOfContents
        tableOfContentsTitle={title}
        headings={navigation.map(({ id, text }) => ({
          headingTitle: text,
          headingId: id,
        }))}
        onClick={(id) => scrollTo(id, { smooth: true })}
      />
    </Box>
  )
}

const SubPage: Screen<SubPageProps> = ({
  organizationPage,
  subpage,
  namespace,
  locale,
}) => {
  const router = useRouter()
  const { activeLocale } = useI18n()

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  useContentfulId(organizationPage?.id, subpage?.id)

  const pathWithoutHash = router.asPath.split('#')[0]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] = organizationPage?.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active:
        primaryLink?.url === pathWithoutHash ||
        childrenLinks.some((link) => link.url === pathWithoutHash),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === pathWithoutHash,
      })),
    }),
  )

  const content = (
    <>
      {subpage?.showTableOfContents && (
        <TOC
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          slices={subpage.slices}
          title={n('navigationTitle', 'Efnisyfirlit')}
        />
      )}
      <GridRow className="rs_read">
        <GridColumn
          span={['12/12', '12/12', subpage?.links?.length ? '7/12' : '12/12']}
        >
          {webRichText(
            subpage?.description as SliceType[],
            {
              renderComponent: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                Form: (slice) => <Form form={slice} namespace={namespace} />,
              },
            },
            activeLocale,
          )}
        </GridColumn>
        {subpage?.links && subpage.links.length > 0 && (
          <GridColumn
            span={['12/12', '12/12', '4/12']}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            offset={[null, null, '1/12']}
          >
            <Stack space={2}>
              {subpage?.links?.map((link) => (
                <Link href={link.url} underline="small">
                  <Text fontWeight="light" color="blue400">
                    {link.text}
                  </Text>
                </Link>
              ))}
            </Stack>
          </GridColumn>
        )}
      </GridRow>
    </>
  )

  return (
    <OrganizationWrapper
      showExternalLinks={true}
      showReadSpeaker={false}
      pageTitle={subpage?.title ?? ''}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      fullWidthContent={true}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageFeaturedImage={
        subpage?.featuredImage ?? organizationPage?.featuredImage
      }
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage', [], locale).href,
        },
        {
          title: organizationPage?.title ?? '',
          href: linkResolver(
            'organizationpage',
            [organizationPage?.slug ?? ''],
            locale,
          ).href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <GridContainer>
        <Box paddingY={4}>
          <GridRow>
            <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
              <GridContainer>
                <GridRow>
                  <GridColumn
                    span={[
                      '12/12',
                      '12/12',
                      subpage?.links?.length ? '7/12' : '12/12',
                    ]}
                  >
                    <Box className="rs_read" marginBottom={2}>
                      <Text variant="h1" as="h1">
                        {subpage?.title}
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      columnGap={2}
                      rowGap={2}
                      marginBottom={3}
                      flexWrap="wrap"
                    >
                      <Webreader
                        marginTop={0}
                        marginBottom={0}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        readId={null}
                        readClass="rs_read"
                      />
                      {subpage?.signLanguageVideo?.url && (
                        <SignLanguageButton
                          videoUrl={subpage.signLanguageVideo.url}
                          content={
                            <>
                              <Box className="rs_read" marginBottom={2}>
                                <Text variant="h2">{subpage.title}</Text>
                              </Box>
                              {content}
                              {renderSlices(
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore make web strict
                                subpage.slices,
                                subpage.sliceCustomRenderer,
                                subpage.sliceExtraText,
                                namespace,
                                organizationPage?.slug,
                              )}
                            </>
                          }
                        />
                      )}
                    </Box>
                  </GridColumn>
                </GridRow>
                {content}
              </GridContainer>
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
      {renderSlices(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        subpage.slices,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        subpage.sliceCustomRenderer,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        subpage.sliceExtraText,
        namespace,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        organizationPage.slug,
      )}
    </OrganizationWrapper>
  )
}

const renderSlices = (
  slices: Slice[],
  renderType: string,
  extraText: string,
  namespace: Record<string, string>,
  slug: string,
) => {
  switch (renderType) {
    case 'SliceDropdown':
      return <SliceDropdown slices={slices} sliceExtraText={extraText} />
    default:
      return slices.map((slice, index) => {
        if (slice.__typename === 'LifeEventPageListSlice') {
          return (
            <SliceMachine
              key={slice.id}
              slice={slice}
              namespace={namespace}
              slug={slug}
              marginBottom={index === slices.length - 1 ? 5 : 0}
              params={{
                renderLifeEventPagesAsProfileCards: true,

                latestNewsSliceBackground: 'white',
                forceTitleSectionHorizontalPadding: 'true',
              }}
              fullWidth={true}
            />
          )
        }

        return (
          <SliceMachine
            key={slice.id}
            slice={slice}
            namespace={namespace}
            slug={slug}
            marginBottom={index === slices.length - 1 ? 5 : 0}
            params={{
              renderLifeEventPagesAsProfileCards: true,
              latestNewsSliceBackground: 'white',
              forceTitleSectionHorizontalPadding: 'true',
            }}
          />
        )
      })
  }
}

SubPage.getProps = async ({ apolloClient, locale, query, req }) => {
  const pathname = safelyExtractPathnameFromUrl(req.url)

  const { slug, subSlug } = getSlugAndSubSlug(query, pathname)
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: slug as string,
          slug: subSlug as string,
          lang: locale as ContentLanguage,
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

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  if (!getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: ${slug} was not found`,
    )
  }

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    namespace,
    showSearchInHeader: false,
    locale: locale as Locale,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

const getSlugAndSubSlug = (query: ParsedUrlQuery, pathname: string) => {
  const path = pathname?.split('/') ?? []
  let { slug, subSlug } = query

  if (!slug && path.length >= 2) {
    // The slug is the next-last index in the path, i.e. "syslumenn" in the case of "/s/syslumenn/utgefid-efni"
    slug = path[path.length - 2]
  }
  if (!subSlug && path.length > 0) {
    // The subslug is the last index in the path, i.e. "utgefid-efni" in the case of "/s/syslumenn/utgefid-efni"
    subSlug = path.pop()
  }

  return { slug, subSlug }
}

export default withMainLayout(SubPage)
