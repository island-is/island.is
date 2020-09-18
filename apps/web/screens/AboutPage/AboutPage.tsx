/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useRef,
  useMemo,
  Ref,
  forwardRef,
  useCallback,
} from 'react'
import { fromPairs, minBy } from 'lodash'
import routeNames from '@island.is/web/i18n/routeNames'
import { useI18n } from '@island.is/web/i18n'
import { GET_ABOUT_PAGE_QUERY } from '../queries'
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
} from '@island.is/web/graphql/schema'
import useViewport from '@island.is/web/hooks/useViewport'
import { renderSlices } from '@island.is/island-ui/contentful'
import { GridColumns } from 'libs/island-ui/core/src/lib/Grid/GridColumn/GridColumn.treat'
import { ResponsiveProp } from 'libs/island-ui/core/src/utils/responsiveProp'

const mainContentSpan: ResponsiveProp<GridColumns> = [
  '12/12',
  '12/12',
  '12/12',
  '8/12',
  '8/12',
]
const mainContentSpanWithIndent: ResponsiveProp<GridColumns> = [
  '12/12',
  '12/12',
  '12/12',
  '7/12',
  '7/12',
]
const mainContentIndent: ResponsiveProp<GridColumns> = [
  null,
  null,
  null,
  '1/12',
  '1/12',
]
const sidebarContentSpan: ResponsiveProp<GridColumns> = [
  '12/12',
  '12/12',
  '12/12',
  '3/12',
  '3/12',
]

const useScrollSpy = ({
  margin = 0,
  initialId = '',
}: {
  margin?: number
  initialId?: string
}): [(id: string) => (e: HTMLElement) => void, string | undefined] => {
  const elements = useRef<{ [key: string]: HTMLElement }>({})
  const [currentId, setCurrentId] = useState(initialId)

  // re-render on scroll or resize
  useViewport()

  // Elements are cleared on each render. After the component that calls this
  // hook has finished rendering, the useEffect hook below runs with
  // elements.current populated by the component using this hook.
  elements.current = {}

  const spy = useCallback(
    (key: string) => {
      return (e: HTMLElement) => {
        elements.current[key] = e
      }
    },
    [elements],
  )

  useEffect(() => {
    const candidates = Array.from(
      Object.entries(elements.current),
    ).map(([name, elem]) => ({ name, elem }))

    const best = minBy(candidates, (c) => {
      const { top, height } = c.elem.getBoundingClientRect()
      return Math.min(
        Math.abs(top - margin),
        Math.abs(top + height - margin - 1),
      )
    })

    if (best && best.name !== currentId) {
      setCurrentId(best.name)
    }
  })

  return [spy, currentId]
}

/**
 * TODO: Both fragments Image and EmbeddedVideo aren't used inside
 * queries, so no fields are retrieve, which mean `id` is undefined
 */
type AvailableSlices = Exclude<
  AllSlicesFragment,
  AllSlicesEmbeddedVideoFragment | AllSlicesImageFragment
>

const extractSliceTitle = (slice: AvailableSlices): [string, string] | null => {
  switch (slice.__typename) {
    case 'PageHeaderSlice':
      return [slice.id, slice.navigationText]

    case 'HeadingSlice':
    case 'LinkCardSlice':
    case 'MailingListSignupSlice':
    case 'LatestNewsSlice':
    case 'LogoListSlice':
      return [slice.id, slice.title]

    default:
      return null
  }
}

const connectSlices = (slices: AvailableSlices[]): { [k: string]: string } => {
  let head = slices.find(extractSliceTitle) ?? slices[0]

  const pairs = slices.map((slice) => {
    if (extractSliceTitle(slice)) {
      head = slice
    }

    return [slice.id, head.id]
  })

  return fromPairs(pairs)
}

export interface LayoutProps {
  width: ResponsiveProp<GridColumns>
  indent?: ResponsiveProp<GridColumns>
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

const decideSidebarType = (slice?: AllSlicesFragment): SidebarProps['type'] => {
  switch (slice && slice.__typename) {
    case 'PageHeaderSlice':
    case 'MailingListSignupSlice':
    case 'LogoListSlice':
      return 'gradient'

    default:
      return 'standard'
  }
}

interface SectionProps {
  slice: AvailableSlices
  page: GetAboutPageQuery['getAboutPage']
  currentSliceId: string
  setRef: (k: string) => (e: HTMLDivElement) => void
}

const Section: FC<SectionProps> = ({ slice, page, currentSliceId, setRef }) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  switch (slice.__typename) {
    case 'PageHeaderSlice':
      return (
        <Background ref={setRef(slice.id)} id={slice.id} theme={page.theme}>
          <GridContainer position="none">
            <ColorSchemeContext.Provider value={{ colorScheme: 'white' }}>
              <Box marginBottom={15}>
                <Header />
              </Box>
            </ColorSchemeContext.Provider>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '9/12', '9/12']}>
                <div className={styles.indent}>
                  <Stack space={2}>
                    <Breadcrumbs color="blue300" separatorColor="blue300">
                      <Link href={makePath()}>Ísland.is</Link>
                      <Link href="">{page.title}</Link>
                    </Breadcrumbs>
                    <Typography variant="h1" as="h1" color="white">
                      {slice.title}
                    </Typography>
                    <Typography variant="p" as="p" color="white">
                      {slice.introduction}
                    </Typography>
                  </Stack>
                </div>
                {(slice.slices as AvailableSlices[]).map((slice) => (
                  <Section
                    key={slice.id}
                    slice={slice}
                    page={page}
                    currentSliceId={currentSliceId}
                    setRef={setRef}
                  />
                ))}
              </GridColumn>
              <GridColumn span={sidebarContentSpan} position="none">
                <Sidebar
                  title={page.title}
                  type={decideSidebarType(
                    (page.slices as AvailableSlices[]).find(
                      (slice) => !currentSliceId || slice.id === currentSliceId,
                    ),
                  )}
                >
                  {({ bulletRef, colors }) => (
                    <>
                      {page.slices
                        .map(extractSliceTitle)
                        .filter(Boolean)
                        .map(([id, text], index) => (
                          <Box key={index} paddingBottom={index === 0 ? 2 : 0}>
                            <a
                              ref={id === currentSliceId ? bulletRef : null}
                              href={'#' + id}
                              onClick={(e) => {
                                e.preventDefault()
                                document.getElementById(id).scrollIntoView()
                              }}
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
    case 'TimelineSlice':
      return (
        <Timeline
          {...slice}
          events={slice.events.map((event) => ({
            ...event,
            body: event.body && renderSlices(event.body),
          }))}
        />
      )
    case 'HeadingSlice':
      return (
        <div key={slice.id} id={slice.id} ref={setRef(slice.id)}>
          <Layout indent={mainContentIndent} width={mainContentSpanWithIndent}>
            <Box paddingTop={15} paddingBottom={10}>
              <Heading {...slice} />
            </Box>
          </Layout>
        </div>
      )
    case 'LinkCardSlice':
      return (
        <Box
          key={slice.id}
          id={slice.id}
          ref={setRef(slice.id)}
          background="dotted"
        >
          <Layout width={mainContentSpan}>
            <Box paddingTop={8} paddingBottom={10}>
              <LinkCardList {...slice} />
            </Box>
          </Layout>
        </Box>
      )
    case 'MailingListSignupSlice':
      return (
        <Box
          key={slice.id}
          id={slice.id}
          ref={setRef(slice.id)}
          background="blue100"
        >
          <Layout width={mainContentSpanWithIndent} indent={mainContentIndent}>
            <Box paddingTop={10} paddingBottom={7}>
              <EmailSignup {...slice} />
            </Box>
          </Layout>
        </Box>
      )
    case 'StorySlice':
      return (
        <div
          key={slice.id}
          id={slice.id}
          ref={setRef(slice.id)}
          className={styles.gradient}
        >
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
        <div key={slice.id} id={slice.id} ref={setRef(slice.id)}>
          <Layout width={mainContentSpan}>
            <Box paddingTop={15} paddingBottom={12}>
              <AboutLatestNews {...slice} />
            </Box>
          </Layout>
        </div>
      )
    case 'LogoListSlice':
      return (
        <div
          key={slice.id}
          id={slice.id}
          ref={setRef(slice.id)}
          className={styles.gradient}
        >
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
        <div key={slice.id} ref={setRef(slice.id)}>
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
  }
}

export interface AboutPageProps {
  page?: GetAboutPageQuery['getAboutPage']
}

const AboutPageScreen: Screen<AboutPageProps> = ({ page }) => {
  const refs: Ref<{ [k: string]: HTMLDivElement }> = useRef({})
  const [spy, sliceId] = useScrollSpy({ margin: 200 })
  const sliceMap = useMemo(
    () => connectSlices(page.slices as AvailableSlices[]),
    [page.slices],
  )

  const setRef = (id: string) => {
    return (e: HTMLDivElement) => {
      refs.current[id] = e
      spy(id)(e)
    }
  }

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.seoDescription} />
      </Head>
      <Box position="relative">
        {(page.slices as AvailableSlices[]).map((slice) => (
          <Section
            key={slice.id}
            slice={slice}
            page={page}
            currentSliceId={sliceMap[sliceId]}
            setRef={setRef}
          />
        ))}
      </Box>
    </>
  )
}

AboutPageScreen.getInitialProps = async ({ apolloClient, locale }) => {
  const {
    data: { getAboutPage: page },
  } = await apolloClient.query<GetAboutPageQuery, QueryGetAboutPageArgs>({
    query: GET_ABOUT_PAGE_QUERY,
    variables: {
      input: {
        lang: locale,
      },
    },
  })

  return {
    page,
  }
}

export default withMainLayout(AboutPageScreen, { showHeader: false })
