/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  FC,
  ReactNode,
  useRef,
  Ref,
  forwardRef,
} from 'react'
import Link from 'next/link'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { Locale } from '@island.is/web/i18n/I18n'
import { useI18n } from '@island.is/web/i18n'
import { Query, QueryGetPageArgs, Page, Slice } from '@island.is/api/schema'
import { GET_PAGE_QUERY } from '../queries'
import { Screen } from '@island.is/web/types'
import { withApollo } from '../../graphql'
import {
  Header,
  LinkCardList,
  Heading,
  Timeline,
  StoryList,
  LatestNews,
  EmailSignup,
  LogoList,
} from '@island.is/web/components'
import {
  Typography,
  Divider,
  ContentBlock,
  Box,
  Column,
  Columns,
  ColumnProps,
  BoxProps,
  Breadcrumbs,
  Stack,
} from '@island.is/island-ui/core'
import Sidebar, { SidebarProps } from './Sidebar'
import * as styles from './GenericPage.treat'
import useScrollSpy from '@island.is/web/hooks/useScrollSpy'
import Head from 'next/head'

const extractSliceTitle = (slice: Slice): [string, string] | null => {
  switch (slice.__typename) {
    case 'PageHeaderSlice':
      return [slice.id, slice.navigationText]
    case 'HeadingSlice':
    case 'LinkCardSlice':
    case 'MailingListSignupSlice':
    case 'LatestNewsSlice':
    case 'LogoListSlice':
      return [slice.id, slice.title]
    case 'TimelineSlice':
    case 'StorySlice':
      return null
  }
}

export interface LayoutProps {
  width: ColumnProps['width']
  indent?: ColumnProps['width']
  boxProps?: BoxProps
}

const Layout: FC<LayoutProps> = ({
  width,
  indent,
  boxProps = {},
  children,
}) => {
  return (
    <ContentBlock>
      <Box paddingX={[0, 0, 0, 6]} {...boxProps}>
        <Columns collapseBelow="lg">
          {indent && <Column width={indent}>{null}</Column>}
          <Column width={width}>{children}</Column>
        </Columns>
      </Box>
    </ContentBlock>
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

const decideSidebarType = (slice?: Slice): SidebarProps['type'] => {
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
  slice: Slice
  page: Page
  currentSliceId: string
  setRef: (k: string) => (e: HTMLDivElement) => void
}

const Section: FC<SectionProps> = ({ slice, page, currentSliceId, setRef }) => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)

  switch (slice.__typename) {
    case 'PageHeaderSlice':
      return (
        <Background ref={setRef(slice.id)} id={slice.id} theme={page.theme}>
          <ContentBlock>
            <Box paddingX={[0, 0, 0, 6]}>
              <Header />
              <Box position="relative" marginTop={6} marginX={[0, 0, 0, 6]}>
                <Sidebar
                  title={page.title}
                  type={decideSidebarType(
                    page.slices.find(
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
                          <Box paddingBottom={index === 0 ? 2 : 0}>
                            <a
                              key={id}
                              ref={id === currentSliceId ? bulletRef : null}
                              href={'#' + id}
                              onClick={(e) => {
                                e.preventDefault()
                                document.getElementById(id).scrollIntoView()
                              }}
                            >
                              <Typography
                                variant="p"
                                as="p"
                                color={colors.main}
                              >
                                {id === currentSliceId ? <b>{text}</b> : text}
                              </Typography>
                            </a>
                          </Box>
                        ))}
                      {slice.links.length > 0 && (
                        <Box paddingTop={2}>
                          <Stack space={2}>
                            {slice.links.map(({ url, text }) => (
                              <>
                                <Divider weight={colors.divider} />
                                <Link href={url}>
                                  <a>
                                    <Typography
                                      variant="p"
                                      as="div"
                                      color={colors.secondary}
                                    >
                                      {text}
                                    </Typography>
                                  </a>
                                </Link>
                              </>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </>
                  )}
                </Sidebar>
              </Box>
              <Breadcrumbs color="blue300" separatorColor="blue300">
                <Link href={makePath()}>
                  <a>Ísland.is</a>
                </Link>
                <Link href={''}>
                  <a>{page.title}</a>
                </Link>
              </Breadcrumbs>
              {slice.slices.map((slice) => (
                <Section
                  key={slice.id}
                  slice={slice}
                  page={page}
                  currentSliceId={currentSliceId}
                  setRef={setRef}
                />
              ))}
            </Box>
          </ContentBlock>
        </Background>
      )
    case 'TimelineSlice':
      return (
        <ContentBlock key={slice.id}>
          <Box paddingX={[0, 0, 0, 6]}>
            <Timeline {...slice} />
          </Box>
        </ContentBlock>
      )
    case 'HeadingSlice':
      return (
        <div key={slice.id} id={slice.id} ref={setRef(slice.id)}>
          <Layout
            indent="1/12"
            width="7/12"
            boxProps={{ paddingTop: 15, paddingBottom: 10 }}
          >
            <Heading {...slice} />
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
          <Layout width="8/12" boxProps={{ paddingTop: 8, paddingBottom: 10 }}>
            <LinkCardList {...slice} />
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
          <Layout
            width="7/12"
            indent="1/12"
            boxProps={{ paddingTop: 10, paddingBottom: 7 }}
          >
            <EmailSignup {...slice} />
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
          <Layout width="7/12" boxProps={{ paddingY: 10 }}>
            <StoryList
              {...slice}
              stories={slice.stories.map((story) => ({
                ...story,
                logoUrl: story.logo.url,
              }))}
            />
          </Layout>
        </div>
      )
    case 'LatestNewsSlice':
      return (
        <div key={slice.id} id={slice.id} ref={setRef(slice.id)}>
          <Layout width="8/12" boxProps={{ paddingTop: 15, paddingBottom: 12 }}>
            <LatestNews {...slice} />
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
          <Layout width="7/12" boxProps={{ paddingY: 10 }}>
            <LogoList {...slice} images={slice.images.map((img) => img.url)} />
          </Layout>
        </div>
      )
  }
}

export interface GenericPageProps {
  page?: Page
}

const GenericPage: Screen<GenericPageProps> = ({ page }) => {
  const refs: Ref<{ [k: string]: HTMLDivElement }> = useRef({})
  const [spy, currentId] = useScrollSpy({ margin: 200 })

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
      {page.slices.map((slice) => (
        <Section
          key={slice.id}
          slice={slice}
          page={page}
          currentSliceId={currentId}
          setRef={setRef}
        />
      ))}
    </>
  )
}

GenericPage.getInitialProps = async ({ apolloClient, locale, query }) => {
  const {
    data: { getPage: page },
  } = await apolloClient.query<Query, QueryGetPageArgs>({
    query: GET_PAGE_QUERY,
    fetchPolicy: 'no-cache',
    variables: {
      input: {
        lang: locale,
        slug: query.slug as string,
      },
    },
  })

  return {
    page,
    layoutConfig: {
      showHeader: false,
    },
  }
}

export default withApollo(GenericPage)
