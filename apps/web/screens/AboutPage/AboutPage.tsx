/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, ReactNode, useMemo, forwardRef } from 'react'
import routeNames from '@island.is/web/i18n/routeNames'
import { useI18n } from '@island.is/web/i18n'
import { GET_ABOUT_PAGE_QUERY, GET_NAMESPACE_QUERY } from '../queries'
import { Screen } from '@island.is/web/types'
import {
  Header,
  LinkCardList,
  Heading,
  Timeline,
  StoryList,
  AboutLatestNews,
  LogoList,
  BulletList,
  DrawerMenu,
} from '@island.is/web/components'
import {
  Typography,
  Box,
  BoxProps,
  Breadcrumbs,
  Stack,
  Link,
  ColorSchemeContext,
  GridContainer,
  GridColumn,
  GridRow,
  SpanType,
  Tabs,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import Sidebar, { SidebarProps } from './Sidebar'
import * as styles from './AboutPage.treat'
import Head from 'next/head'
import {
  GetAboutPageQuery,
  QueryGetAboutPageArgs,
  AllSlicesFragment,
  AllSlicesEmbeddedVideoFragment,
  AllSlicesImageFragment,
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { renderSlices } from '@island.is/island-ui/contentful'
import useScrollSpy from '@island.is/web/hooks/useScrollSpy'
import { createNavigation } from '@island.is/web/utils/navigation'
import { RenderForm } from './RenderForm'

const mainContentSpanFull: SpanType = ['12/12', '12/12', '12/12', '9/12']
const mainContentSpan: SpanType = ['12/12', '12/12', '12/12', '8/12']
const mainContentSpanWithIndent: SpanType = ['12/12', '12/12', '12/12', '7/12']
const mainContentIndent: SpanType = [null, null, null, '1/12']
const sidebarContentSpan: SpanType = ['12/12', '12/12', '12/12', '3/12']
const nestedSpanWithOffset: SpanType = ['9/9', '9/9', '9/9', '7/9']
const nestedOffset: SpanType = [null, null, null, '1/9']

/**
 * TODO: Both fragments Image and EmbeddedVideo aren't used inside
 * queries, so no fields are retrieve, which mean `id` is undefined
 */
type AvailableSlices = Exclude<
  AllSlicesFragment,
  AllSlicesEmbeddedVideoFragment | AllSlicesImageFragment
>

export interface LayoutProps {
  width: SpanType
  indent?: SpanType
  boxProps?: BoxProps
}

const Layout: FC<LayoutProps> = ({ width, indent, children }) => {
  return (
    <GridContainer position="none">
      <GridRow>
        <GridColumn span={width} offset={indent}>
          {children}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
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
): SidebarProps['type'] => {
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
  namespace?: GetNamespaceQuery['getNamespace']
}

const PageHeader: FC<PageHeaderProps> = ({ page }) => {
  const slice = page.pageHeader
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)
  const navigation = useMemo(
    () =>
      [{ id: slice.id, text: slice.navigationText }].concat(
        createNavigation(page.slices),
      ),
    [page.slices, slice],
  )
  const ids = useMemo(() => navigation.map((x) => x.id), [navigation])
  const [currentSliceId, navigate] = useScrollSpy(ids, { marginTop: 220 })

  const mobileNavigation = navigation.map((x) => ({
    title: x.text,
    url: '#' + x.id,
  }))

  return (
    <Background id={slice.id} theme={page.theme}>
      {!!mobileNavigation.length && (
        <Box display={['block', 'block', 'block', 'none']} paddingBottom={4}>
          <DrawerMenu
            categories={[
              {
                title: 'Efnisyfirlit',
                items: mobileNavigation,
              },
            ]}
          />
        </Box>
      )}
      <GridContainer position="none">
        <ColorSchemeContext.Provider value={{ colorScheme: 'white' }}>
          <Box marginBottom={[8, 8, 8, 15]}>
            <Header />
          </Box>
        </ColorSchemeContext.Provider>
        <GridRow>
          <GridColumn span={mainContentSpanFull}>
            <GridRow>
              <GridColumn offset={nestedOffset} span={nestedSpanWithOffset}>
                <Stack space={2}>
                  <Breadcrumbs color="blue300" separatorColor="blue300">
                    <Link href={makePath()}>Ísland.is</Link>
                    <span>{page.title}</span>
                  </Breadcrumbs>
                  <Typography variant="h1" as="h1" color="white">
                    {slice.title}
                  </Typography>
                  <Typography variant="p" as="p" color="white">
                    {slice.introduction}
                  </Typography>
                </Stack>
              </GridColumn>
            </GridRow>
          </GridColumn>
          <GridColumn span={sidebarContentSpan} position="none">
            <Sidebar
              title={page.title}
              type={decideSidebarType(page, currentSliceId)}
            >
              {({ bulletRef, colors }) => {
                const [navigationTitle, ...navigationList] = navigation
                return (
                  <>
                    <Box
                      component="a"
                      ref={
                        navigationTitle.id === currentSliceId ? bulletRef : null
                      }
                      href={'#' + navigationTitle.id}
                      onClick={() => navigate(navigationTitle.id)}
                      paddingBottom={2}
                      display="inlineBlock"
                    >
                      <Typography variant="p" color={colors.main}>
                        {navigationTitle.id === currentSliceId ? (
                          <b>{navigationTitle.text}</b>
                        ) : (
                          navigationTitle.text
                        )}
                      </Typography>
                    </Box>
                    <Box
                      borderLeftWidth="standard"
                      borderColor={colors.subNavBorder}
                      paddingLeft={2}
                    >
                      {navigationList.map(({ id, text }, index) => (
                        <Box key={index} paddingBottom={1}>
                          <a
                            ref={id === currentSliceId ? bulletRef : null}
                            href={'#' + id}
                            onClick={() => navigate(id)}
                          >
                            <Typography
                              variant="pSmall"
                              as="p"
                              color={colors.main}
                            >
                              {id === currentSliceId ? <b>{text}</b> : text}
                            </Typography>
                          </a>
                        </Box>
                      ))}
                    </Box>
                    {slice.links.map(({ url, text }, index) => (
                      <span key={index}>
                        <Box paddingY={1}>
                          <Link href={url}>
                            <Typography
                              variant="p"
                              as="div"
                              color={colors.secondary}
                            >
                              {text}
                            </Typography>
                          </Link>
                        </Box>
                      </span>
                    ))}
                  </>
                )
              }}
            </Sidebar>
          </GridColumn>
          <GridColumn span={mainContentSpanFull}>
            {(slice.slices as AvailableSlices[]).map((slice) => (
              <Section key={slice.id} slice={slice} />
            ))}
          </GridColumn>
        </GridRow>
      </GridContainer>
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
          <Timeline
            {...slice}
            events={slice.events.map((event) => ({
              ...event,
              body: event.body && renderSlices(event.body),
            }))}
          />
        </div>
      )
    case 'HeadingSlice':
      return (
        <div key={slice.id} id={slice.id}>
          <Layout indent={mainContentIndent} width={mainContentSpanWithIndent}>
            <Box paddingTop={[6, 6, 15]} paddingBottom={[5, 5, 10]}>
              <Heading {...slice} />
            </Box>
          </Layout>
        </div>
      )
    case 'LinkCardSlice':
      return (
        <Box key={slice.id} id={slice.id} background="dotted">
          <Layout width={mainContentSpan}>
            <Box paddingTop={8} paddingBottom={[5, 5, 10]}>
              <LinkCardList {...slice} />
            </Box>
          </Layout>
        </Box>
      )
    case 'MailingListSignupSlice':
      return (
        <Box key={slice.id} id={slice.id} background="blue100">
          <Layout width={mainContentSpanWithIndent} indent={mainContentIndent}>
            <Box paddingTop={[4, 4, 10]} paddingBottom={[3, 3, 7]}>
              <RenderForm
                namespace={namespace}
                heading={slice.title}
                text={slice.description}
                submitButtonText={slice.buttonText}
                inputLabel={slice.inputLabel}
              />
            </Box>
          </Layout>
        </Box>
      )
    case 'StorySlice':
      return (
        <div key={slice.id} id={slice.id} className={styles.gradient}>
          <Layout width={mainContentSpan}>
            <Box paddingTop={[8, 8, 12]} paddingBottom={[8, 8, 10]}>
              <StoryList
                {...slice}
                stories={(slice.stories as any[]).map((story) => ({
                  ...story,
                  logoUrl: story.logo.url,
                }))}
              />
            </Box>
          </Layout>
        </div>
      )
    case 'LatestNewsSlice':
      return (
        <div key={slice.id} id={slice.id}>
          <Layout width={mainContentSpan}>
            <Box paddingTop={[8, 8, 15]} paddingBottom={[6, 6, 12]}>
              <AboutLatestNews {...slice} namespace={namespace} />
            </Box>
          </Layout>
        </div>
      )
    case 'LogoListSlice':
      return (
        <div key={slice.id} id={slice.id} className={styles.gradient}>
          <Layout width={mainContentSpan}>
            <Box paddingTop={[8, 8, 12]} paddingBottom={5}>
              <LogoList
                {...slice}
                images={slice.images.map((img) => img.url)}
              />
            </Box>
          </Layout>
        </div>
      )
    case 'BulletListSlice':
      return (
        <div id={slice.id} key={slice.id}>
          <Layout width={mainContentSpan}>
            <Box paddingBottom={[5, 5, 10]}>
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
          </Layout>
        </div>
      )
    case 'TabSection':
      return (
        <Box key={slice.id} id={slice.id} background="dotted">
          <Layout width={mainContentSpan}>
            <Box paddingTop={8} paddingBottom={[5, 5, 10]}>
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
                        <Box paddingTop={[4, 4, 9]} paddingBottom={[0, 0, 9]}>
                          <Typography variant="h2" as="h2" marginBottom={3}>
                            {tab.contentTitle}
                          </Typography>
                          <img
                            src={tab.image.url}
                            className={styles.tabSectionImg}
                          />
                          {tab.body && renderSlices(tab.body)}
                        </Box>
                      </GridColumn>
                    </GridRow>
                  ),
                }))}
                contentBackground="white"
              />
            </Box>
          </Layout>
        </Box>
      )
  }
}

export interface AboutPageProps {
  page?: GetAboutPageQuery['getAboutPage']
  namespace: GetNamespaceQuery['getNamespace']
}

const AboutPageScreen: Screen<AboutPageProps> = ({ page, namespace }) => {
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.seoDescription} />
      </Head>
      <Box position="relative">
        <PageHeader page={page} />
        {(page.slices as AvailableSlices[]).map((slice) => (
          <Section key={slice.id} slice={slice} namespace={namespace} />
        ))}
      </Box>
    </>
  )
}

AboutPageScreen.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getAboutPage: page },
    },
    namespace,
  ] = await Promise.all([
    await apolloClient.query<GetAboutPageQuery, QueryGetAboutPageArgs>({
      query: GET_ABOUT_PAGE_QUERY,
      variables: {
        input: {
          lang: locale,
        },
      },
    }),
    await apolloClient
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
  ])

  return {
    page,
    namespace,
  }
}

export default withMainLayout(AboutPageScreen, { showHeader: false })
