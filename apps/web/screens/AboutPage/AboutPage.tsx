/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  FC,
  ReactNode,
  useMemo,
  forwardRef,
  useState,
  useEffect,
} from 'react'
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
  EmailSignup,
  LogoList,
  BulletList,
  DrawerMenu,
} from '@island.is/web/components'
import {
  Typography,
  Divider,
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
  NewsletterSignup,
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

const mainContentSpan: SpanType = ['12/12', '12/12', '12/12', '8/12']
const mainContentSpanWithIndent: SpanType = ['12/12', '12/12', '12/12', '7/12']
const mainContentIndent: SpanType = [null, null, null, '1/12']
const sidebarContentSpan: SpanType = ['12/12', '12/12', '12/12', '3/12']

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
          <GridColumn
            offset={mainContentIndent}
            span={mainContentSpanWithIndent}
          >
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
          <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
            {(slice.slices as AvailableSlices[]).map((slice) => (
              <Section key={slice.id} slice={slice} />
            ))}
          </GridColumn>
          <GridColumn span={sidebarContentSpan} position="none">
            <Sidebar
              title={page.title}
              type={decideSidebarType(page, currentSliceId)}
            >
              {({ bulletRef, colors }) => (
                <>
                  {navigation.map(({ id, text }, index) => (
                    <Box key={index} paddingBottom={index === 0 ? 2 : 0}>
                      <a
                        ref={id === currentSliceId ? bulletRef : null}
                        href={'#' + id}
                        onClick={() => navigate(id)}
                      >
                        <Typography
                          variant={index === 0 ? 'p' : 'pSmall'}
                          as="p"
                          color={colors.main}
                        >
                          {id === currentSliceId ? <b>{text}</b> : text}
                        </Typography>
                      </a>
                    </Box>
                  ))}
                  {slice.links.map(({ url, text }, index) => (
                    <span key={index}>
                      <Box paddingY={2}>
                        <Divider weight={colors.divider} />
                      </Box>
                      <Link href={url}>
                        <Typography
                          variant="p"
                          as="div"
                          color={colors.secondary}
                        >
                          {text}
                        </Typography>
                      </Link>
                    </span>
                  ))}
                </>
              )}
            </Sidebar>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Background>
  )
}

interface SectionProps {
  slice: AvailableSlices
}

const Section: FC<SectionProps> = ({ slice }) => {
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
            <Box paddingTop={15} paddingBottom={10}>
              <Heading {...slice} />
            </Box>
          </Layout>
        </div>
      )
    case 'LinkCardSlice':
      return (
        <Box key={slice.id} id={slice.id} background="dotted">
          <Layout width={mainContentSpan}>
            <Box paddingTop={8} paddingBottom={10}>
              <LinkCardList {...slice} />
            </Box>
          </Layout>
        </Box>
      )
    case 'MailingListSignupSlice':
      return (
        <Box key={slice.id} id={slice.id} background="blue100">
          <Layout width={mainContentSpanWithIndent} indent={mainContentIndent}>
            <Box paddingTop={10} paddingBottom={7}>
              <EmailSignup {...slice} />
            </Box>
          </Layout>
        </Box>
      )
    case 'StorySlice':
      return (
        <div key={slice.id} id={slice.id} className={styles.gradient}>
          <Layout width={mainContentSpan}>
            <Box paddingTop={12} paddingBottom={10}>
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
            <Box paddingTop={15} paddingBottom={12}>
              <AboutLatestNews {...slice} />
            </Box>
          </Layout>
        </div>
      )
    case 'LogoListSlice':
      return (
        <div key={slice.id} id={slice.id} className={styles.gradient}>
          <Layout width={mainContentSpan}>
            <Box paddingTop={12} paddingBottom={5}>
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
            <Box paddingBottom={10}>
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
            <Box paddingTop={8} paddingBottom={10}>
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
                        <Box paddingY={9}>
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
          <Section key={slice.id} slice={slice} />
        ))}
      </Box>
      <RenderForm namespace={namespace} />
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
            namespace: 'Categories',
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
