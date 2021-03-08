import React, { FC, ReactNode, useMemo, forwardRef } from 'react'
import NextLink from 'next/link'
import {
  GET_ABOUT_PAGE_QUERY,
  GET_CATEGORIES_QUERY,
  GET_NAMESPACE_QUERY,
} from '../queries'
import { Screen } from '@island.is/web/types'
import {
  Header,
  LinkCardList,
  Heading,
  TimelineSection,
  StoryList,
  AboutLatestNews,
  LogoList,
  BulletList,
  Main,
} from '@island.is/web/components'
import {
  Text,
  Box,
  BoxProps,
  Breadcrumbs,
  Stack,
  ColorSchemeContext,
  GridContainer,
  GridColumn,
  GridRow,
  SpanType,
  Tabs,
  Divider,
  Navigation,
  NavigationItem,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import Sidebar from './Sidebar'
import * as styles from './AboutPage.treat'
import Head from 'next/head'
import { Locale } from '@island.is/shared/types'
import {
  GetAboutPageQuery,
  QueryGetAboutPageArgs,
  AllSlicesFragment,
  AllSlicesEmbeddedVideoFragment,
  AllSlicesImageFragment,
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
  GetGroupedMenuQuery,
  QueryGetGroupedMenuArgs,
  GetArticleCategoriesQuery,
  QueryGetArticleCategoriesArgs,
} from '@island.is/web/graphql/schema'
import {
  renderSlices,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import useScrollSpy from '@island.is/web/hooks/useScrollSpy'
import { createNavigation } from '@island.is/web/utils/navigation'
import { RenderForm } from './RenderForm'
import { SidebarLayout } from '../Layouts/SidebarLayout'
import { GET_GROUPED_MENU_QUERY } from '../queries/Menu'
import {
  formatMegaMenuCategoryLinks,
  formatMegaMenuLinks,
} from '@island.is/web/utils/processMenuData'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

/**
 * TODO: Both fragments Image and EmbeddedVideo aren't used inside
 * queries, so no fields are retrieve, which mean `id` is undefined
 */
type AvailableSlices = Exclude<
  AllSlicesFragment,
  AllSlicesEmbeddedVideoFragment | AllSlicesImageFragment
>

interface SliceItem {
  url: string
  text: string
  id?: string
}

const sidebarContent = (
  navigation: SliceItem[],
  sliceLinks: SliceItem[],
): NavigationItem[] => {
  const [navigationTitle, ...navigationList] = navigation

  const subPages: NavigationItem[] = sliceLinks.map(({ url, text }) => ({
    href: url,
    title: text,
    active: false,
  }))

  const currentPage: NavigationItem = {
    href: `#${navigationTitle.id}`,
    title: navigationTitle.text,
    active: true,
  }

  return [currentPage].concat(subPages)
}

export interface LayoutProps {
  width: SpanType
  indent?: SpanType
  boxProps?: BoxProps
}

interface BackgroundProps {
  theme: string // 'neutral' | 'red' | 'blue' | 'gradient'
  id?: string
  light?: boolean
  children: ReactNode
}

const Background = forwardRef<HTMLDivElement, BackgroundProps>(
  ({ theme, id, light = false, children }, ref) => {
    if (theme === 'gradient') {
      return (
        <div ref={ref} className={styles.gradient} id={id}>
          {children}
        </div>
      )
    }

    let background = null
    if (theme === 'blue') {
      background = light ? 'blueberry100' : 'blueberry400'
    } else if (theme === 'red') {
      background = light ? 'rosetinted100' : 'roseTinted400'
    }

    return (
      <Box ref={ref} id={id} background={background}>
        {children}
      </Box>
    )
  },
)

const decideSidebarType = (
  page: GetAboutPageQuery['getAboutPage'],
  currentSliceId: string,
): string => {
  if (
    currentSliceId === page.pageHeader.id ||
    page.slices.some(
      (slice) =>
        slice.id === currentSliceId &&
        ['MailingListSignupSlice', 'LogoListSlice'].includes(slice.__typename),
    )
  ) {
    return 'gradient'
  }

  return 'standard'
}

interface PageHeaderProps {
  page: GetAboutPageQuery['getAboutPage']
  navigation: SliceItem[]
  namespace?: GetNamespaceQuery['getNamespace']
  megaMenuData
}

const PageHeader: FC<PageHeaderProps> = ({
  page,
  navigation,
  megaMenuData,
}) => {
  const slice = page.pageHeader

  const ids = useMemo(() => navigation.map((x) => x.id), [navigation])
  const { linkResolver } = useLinkResolver()
  const [currentSliceId] = useScrollSpy(ids, { marginTop: 220 })

  return (
    <Background id={slice.id} theme={page.theme}>
      <GridContainer position="none">
        <ColorSchemeContext.Provider value={{ colorScheme: 'white' }}>
          <Header buttonColorScheme="negative" megaMenuData={megaMenuData} />
        </ColorSchemeContext.Provider>
      </GridContainer>
      <SidebarLayout
        isSticky={false}
        addMainLandmark={false}
        addAsideLandmark={false}
        fullWidthContent
        hiddenOnTablet
        sidebarContent={
          <Sidebar>
            <Navigation
              colorScheme={
                decideSidebarType(page, currentSliceId) === 'gradient'
                  ? 'darkBlue'
                  : 'blue'
              }
              baseId="LeftNavigation"
              isMenuDialog={false}
              items={sidebarContent(navigation, slice.links)}
              title={page.title}
            />
          </Sidebar>
        }
      >
        <GridColumn span={'12/12'}>
          <GridRow>
            <GridColumn
              offset={[null, null, null, '1/9']}
              span={['12/12', '12/12', '12/12', '8/9']}
            >
              <Stack space={2}>
                <Breadcrumbs
                  color="white"
                  items={[
                    {
                      title: 'Ísland.is',
                      href: '/',
                    },
                  ]}
                  renderLink={(link) => {
                    return (
                      <NextLink {...linkResolver('homepage')} passHref>
                        {link}
                      </NextLink>
                    )
                  }}
                />
                <Box display={['block', 'block', 'block', 'none']}>
                  <Navigation
                    colorScheme={'darkBlue'}
                    baseId="MobileMenuNavigation"
                    isMenuDialog={true}
                    activeItemTitle={slice.navigationText}
                    items={sidebarContent(navigation, slice.links)}
                    title={page.title}
                  />
                </Box>

                <Text variant="h1" as="h1" color="white">
                  {slice.title}
                </Text>
                <Text color="white">{slice.introduction}</Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </GridColumn>
        <GridColumn span={'12/12'}>
          {(slice.slices as AvailableSlices[]).map((slice) => (
            <Section key={slice.id} slice={slice} />
          ))}
        </GridColumn>
      </SidebarLayout>
    </Background>
  )
}

interface SectionProps {
  slice: AvailableSlices
  namespace?: GetNamespaceQuery['getNamespace']
}

const Section: FC<SectionProps> = ({ slice, namespace }) => {
  switch (slice.__typename) {
    case 'TimelineSlice':
      return (
        <div id={slice.id}>
          <TimelineSection
            {...slice}
            events={slice.events.map((event) => ({
              ...event,
              body: event.body && renderSlices(event.body as SliceType),
            }))}
          />
        </div>
      )
    case 'HeadingSlice':
      return (
        <div key={slice.id} id={slice.id}>
          <SidebarLayout
            hiddenOnTablet={true}
            sidebarContent={null}
            addMainLandmark={false}
            addAsideLandmark={false}
          >
            <Box paddingTop={[8, 6, 15]} paddingBottom={[4, 5, 10]}>
              <Heading {...slice} />
            </Box>
          </SidebarLayout>
        </div>
      )
    case 'LinkCardSlice':
      return (
        <Box key={slice.id} id={slice.id} backgroundPattern="dotted">
          <SidebarLayout
            hiddenOnTablet={true}
            sidebarContent={null}
            addMainLandmark={false}
            addAsideLandmark={false}
          >
            <Box paddingTop={8} paddingBottom={[4, 5, 10]}>
              <LinkCardList {...slice} />
            </Box>
          </SidebarLayout>
        </Box>
      )
    case 'MailingListSignupSlice':
      return (
        <Box key={slice.id} id={slice.id} background="blue100">
          <SidebarLayout
            hiddenOnTablet={true}
            sidebarContent={null}
            addMainLandmark={false}
            addAsideLandmark={false}
          >
            <Box paddingTop={[4, 4, 10]} paddingBottom={[4, 3, 7]}>
              <RenderForm
                namespace={namespace}
                heading={slice.title}
                text={slice.description}
                submitButtonText={slice.buttonText}
                inputLabel={slice.inputLabel}
              />
            </Box>
          </SidebarLayout>
        </Box>
      )
    case 'StorySlice':
      return (
        <div key={slice.id} id={slice.id} className={styles.gradient}>
          <SidebarLayout
            hiddenOnTablet={true}
            sidebarContent={null}
            addMainLandmark={false}
            addAsideLandmark={false}
          >
            <Box paddingTop={[8, 8, 12]} paddingBottom={[12, 8, 10]}>
              <StoryList
                {...slice}
                stories={(slice.stories as any[]).map((story) => ({
                  ...story,
                  logoUrl: story.logo.url,
                }))}
              />
            </Box>
          </SidebarLayout>
        </div>
      )
    case 'LatestNewsSlice':
      return (
        <div key={slice.id} id={slice.id}>
          <SidebarLayout
            hiddenOnTablet={true}
            sidebarContent={null}
            addMainLandmark={false}
            addAsideLandmark={false}
          >
            <Box paddingTop={[8, 8, 15]} paddingBottom={[4, 6, 12]}>
              <AboutLatestNews {...slice} namespace={namespace} />
            </Box>
          </SidebarLayout>
        </div>
      )
    case 'LogoListSlice':
      return (
        <div key={slice.id} id={slice.id} className={styles.gradient}>
          <SidebarLayout
            hiddenOnTablet={true}
            sidebarContent={null}
            addMainLandmark={false}
            addAsideLandmark={false}
          >
            <Box paddingTop={[8, 8, 12]} paddingBottom={4}>
              <LogoList
                {...slice}
                images={slice.images.map((img) => img.url)}
              />
            </Box>
          </SidebarLayout>
        </div>
      )
    case 'BulletListSlice':
      return (
        <div id={slice.id} key={slice.id}>
          <SidebarLayout
            hiddenOnTablet={true}
            sidebarContent={null}
            addMainLandmark={false}
            addAsideLandmark={false}
          >
            <Box paddingBottom={[8, 5, 10]}>
              <BulletList
                bullets={slice.bullets.map((bullet) => {
                  switch (bullet.__typename) {
                    case 'IconBullet':
                      return {
                        ...bullet,
                        type: 'IconBullet',
                        icon: bullet.icon.url,
                      }
                    case 'NumberBulletGroup':
                      return { ...bullet, type: 'NumberBulletGroup' }
                    default:
                      return null
                  }
                })}
              />
            </Box>
            <Divider />
          </SidebarLayout>
        </div>
      )
    case 'TabSection':
      return (
        <Box key={slice.id} id={slice.id} backgroundPattern="dotted">
          <SidebarLayout
            hiddenOnTablet={true}
            sidebarContent={null}
            addMainLandmark={false}
            addAsideLandmark={false}
          >
            <Box paddingTop={2} paddingBottom={[0, 5, 10]}>
              <Tabs
                label={slice?.title}
                tabs={slice?.tabs.map((tab) => ({
                  label: tab.tabTitle,
                  content: (
                    <GridRow>
                      <GridColumn
                        span={['9/9', '9/9', '9/9', '7/9']}
                        offset={[null, null, null, '1/9']}
                      >
                        <Box paddingTop={[0, 4, 9]} paddingBottom={[8, 0, 9]}>
                          <img
                            src={tab.image.url}
                            className={styles.tabSectionImg}
                            alt=""
                          />
                          <Text variant="h2" as="h2" marginBottom={3}>
                            {tab.contentTitle}
                          </Text>
                          {tab.body && renderSlices(tab.body as SliceType)}
                        </Box>
                      </GridColumn>
                    </GridRow>
                  ),
                }))}
                contentBackground="white"
              />
            </Box>
            <Divider />
          </SidebarLayout>
        </Box>
      )
  }
}

export interface AboutPageProps {
  page?: GetAboutPageQuery['getAboutPage']
  namespace: GetNamespaceQuery['getNamespace']
  megaMenuData
}

const AboutPageScreen: Screen<AboutPageProps> = ({
  page,
  namespace,
  megaMenuData,
}) => {
  const navigation = useMemo(
    () =>
      [{ id: page.pageHeader.id, text: page.pageHeader.navigationText }].concat(
        createNavigation(page.slices),
      ),
    [page.slices, page.pageHeader],
  )
  return (
    <Main>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.seoDescription} />
      </Head>
      <Box position="relative">
        <PageHeader
          page={page}
          navigation={navigation as SliceItem[]}
          megaMenuData={megaMenuData}
        />
        {(page.slices as AvailableSlices[]).map((slice) => (
          <Section key={slice.id} slice={slice} namespace={namespace} />
        ))}
        <GridContainer>
          <Box display={['block', 'block', 'block', 'none']} marginBottom={8}>
            <Navigation
              baseId="MobileBottomNavigation"
              isMenuDialog={false}
              items={sidebarContent(
                navigation as SliceItem[],
                page.pageHeader.links,
              )}
              title={page.title}
            />
          </Box>
        </GridContainer>
      </Box>
    </Main>
  )
}

AboutPageScreen.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getAboutPage: page },
    },
    namespace,
    megaMenuData,
    categories,
  ] = await Promise.all([
    apolloClient.query<GetAboutPageQuery, QueryGetAboutPageArgs>({
      query: GET_ABOUT_PAGE_QUERY,
      variables: {
        input: {
          lang: locale,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'About',
            lang: locale,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient
      .query<GetGroupedMenuQuery, QueryGetGroupedMenuArgs>({
        query: GET_GROUPED_MENU_QUERY,
        variables: {
          input: { id: '5prHB8HLyh4Y35LI4bnhh2', lang: locale },
        },
      })
      .then((res) => res.data.getGroupedMenu),
    apolloClient
      .query<GetArticleCategoriesQuery, QueryGetArticleCategoriesArgs>({
        query: GET_CATEGORIES_QUERY,
        variables: {
          input: {
            lang: locale,
          },
        },
      })
      .then((res) => res.data.getArticleCategories),
  ])

  const [asideTopLinksData, asideBottomLinksData] = megaMenuData.menus

  return {
    page,
    namespace,
    megaMenuData: {
      asideTopLinks: formatMegaMenuLinks(
        locale as Locale,
        asideTopLinksData.menuLinks,
      ),
      asideBottomTitle: asideBottomLinksData.title,
      asideBottomLinks: formatMegaMenuLinks(
        locale as Locale,
        asideBottomLinksData.menuLinks,
      ),
      mainLinks: formatMegaMenuCategoryLinks(locale as Locale, categories),
    },
  }
}

export default withMainLayout(AboutPageScreen, {
  showHeader: false,
})
