import { useEffect, useState } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Link,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  Form,
  OrganizationWrapper,
  SignLanguageButton,
  SliceDropdown,
  SliceMachine,
  TOC,
} from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  GetUniversityGatewayUniversitiesQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
  Slice,
  UniversityGatewayUniversity,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'
import { safelyExtractPathnameFromUrl } from '@island.is/web/utils/safelyExtractPathnameFromUrl'

import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../queries'
import { GET_UNIVERSITY_GATEWAY_UNIVERSITIES } from '../queries/UniversityGateway'
import * as styles from './UniversitySearch.css'

interface UniversitySubPageProps {
  organizationPage?: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  universities: Array<UniversityGatewayUniversity>
  namespace: Record<string, string>
  locale: string
}
const UniversitySubPage: Screen<UniversitySubPageProps> = ({
  organizationPage,
  subpage,
  universities,
  namespace,
  locale,
}) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  const { activeLocale } = useI18n()
  const [sortedUniversities, setSortedUniversities] = useState<
    UniversityGatewayUniversity[]
  >([])

  useEffect(() => {
    const newArray = [...universities]
    newArray.sort((x, y) => {
      const titleX = x.contentfulTitle || ''
      const titleY = y.contentfulTitle || ''
      return titleX.localeCompare(titleY)
    })

    setSortedUniversities(newArray)
  }, [universities])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] =
    organizationPage?.menuLinks.map(({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active: router.asPath === primaryLink?.url,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    })) ?? []

  const content = (
    <>
      {subpage?.showTableOfContents && (
        <Box marginY={2}>
          <TOC
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            slices={subpage.slices}
            title={n('navigationTitle', 'Efnisyfirlit')}
          />
        </Box>
      )}
      <GridRow className="rs_read">
        {subpage?.description && subpage.description.length > 0 && (
          <GridColumn
            span={['12/12', '12/12', subpage?.links?.length ? '7/12' : '12/12']}
            paddingBottom={3}
          >
            {webRichText(
              subpage?.description as SliceType[],
              undefined,
              activeLocale,
            )}
          </GridColumn>
        )}
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
      pageTitle={organizationPage?.title ?? ''}
      pageDescription={organizationPage?.description}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageFeaturedImage={organizationPage?.featuredImage}
      fullWidthContent={true}
      minimal={false}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      sidebarContent={
        <>
          <Hidden above="sm">
            <Box marginBottom={4}>
              <Accordion>
                <AccordionItem id="uni_dropdown" label="Háskólar">
                  <Box width="full" className={cn(styles.courseListContainer)}>
                    <Box className={cn(styles.courseListContentContainer)}>
                      <Text variant="eyebrow" color="blueberry600">
                        {n('universities', 'Háskólar')}
                      </Text>
                      {sortedUniversities.map((university) => {
                        return (
                          <Box
                            className={cn(styles.courseListItems)}
                            key={university.contentfulTitle}
                          >
                            <Box style={{ width: '1.5rem', height: '1.5rem' }}>
                              <img
                                src={university.contentfulLogoUrl?.toString()}
                                alt={''}
                              />
                            </Box>
                            <LinkV2
                              href={
                                university.contentfulLink?.toString() || '/'
                              }
                            >
                              <Text color="blueberry600">
                                {university.contentfulTitle}
                              </Text>
                            </LinkV2>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                </AccordionItem>
              </Accordion>
            </Box>
          </Hidden>
          <Hidden below="md">
            <Box width="full" className={cn(styles.courseListContainer)}>
              <Box
                width="full"
                className={cn(styles.courseListContentContainer)}
              >
                <Text variant="eyebrow" color="blueberry600">
                  {' '}
                  {n('universities', 'Háskólar')}
                </Text>
                {sortedUniversities.map((university) => {
                  return (
                    <Box
                      className={cn(styles.courseListItems)}
                      key={university.contentfulTitle}
                    >
                      <Box style={{ width: '1.5rem', height: '1.5rem' }}>
                        <img
                          src={university.contentfulLogoUrl?.toString()}
                          alt={''}
                        />
                      </Box>
                      <LinkV2
                        href={university.contentfulLink?.toString() || '/'}
                      >
                        <Text color="blueberry600">
                          {university.contentfulTitle}
                        </Text>
                      </LinkV2>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Hidden>
        </>
      }
      mainContent={
        <>
          <GridContainer>
            <Box paddingTop={4}>
              <GridRow>
                <GridColumn
                  span={['9/9', '9/9', '7/9']}
                  offset={['0', '0', '1/9']}
                >
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
                          {subpage?.signLanguageVideo?.url && (
                            <SignLanguageButton
                              videoUrl={subpage.signLanguageVideo.url}
                              videoThumbnailImageUrl={
                                subpage.signLanguageVideo.thumbnailImageUrl
                              }
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
          <Stack space={SLICE_SPACING}>
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
          </Stack>
        </>
      }
    ></OrganizationWrapper>
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
        if (slice.__typename === 'AnchorPageListSlice') {
          return (
            <SliceMachine
              key={slice.id}
              slice={slice}
              namespace={namespace}
              slug={slug}
              marginBottom={index === slices.length - 1 ? 5 : 0}
              params={{
                renderAnchorPagesAsProfileCards: true,
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
              renderAnchorPagesAsProfileCards: true,
              forceTitleSectionHorizontalPadding: 'true',
            }}
          />
        )
      })
  }
}

UniversitySubPage.getProps = async ({ apolloClient, locale, query, req }) => {
  const { subSlug } = query

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
    },
    namespace,
    universities,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: locale === 'is' ? 'haskolanam' : 'university-studies',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug:
            locale === 'is' ? 'haskolanam' : 'university-studies',
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
            namespace: 'universityGateway',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    apolloClient.query<GetUniversityGatewayUniversitiesQuery>({
      query: GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    universities: universities.data.universityGatewayUniversities,
    namespace,
    locale,
  }
}

export default withMainLayout(UniversitySubPage, {
  showFooter: false,
})
