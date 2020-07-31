/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, ReactNode, useRef, Ref, forwardRef } from 'react'
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
  LinkCardSlice,
  HeadingSlice,
  TimelineSlice,
  StorySlice,
  LatestNewsSlice,
  MailingListSignup,
  LogoListSlice,
} from '@island.is/web/components'
import {
  ContentBlock,
  Box,
  Column,
  Columns,
  ColumnProps,
  BoxProps,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import Sidebar, { SidebarProps } from './Sidebar'
import * as styles from './GenericPage.treat'
import useScrollSpy from '@island.is/web/hooks/useScrollSpy'
import Head from 'next/head'

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
        <Columns>
          {indent && <Column width={indent}>{null}</Column>}
          <Column width={width}>{children}</Column>
        </Columns>
      </Box>
    </ContentBlock>
  )
}

const renderSlice = (
  slice: Slice,
  ref: (k: string) => (e: HTMLDivElement) => void,
): ReactNode => {
  switch (slice.__typename) {
    case 'TimelineSlice':
      return (
        <ContentBlock key={slice.id}>
          <Box paddingX={[0, 0, 0, 6]}>
            <TimelineSlice {...slice} />
          </Box>
        </ContentBlock>
      )
    case 'HeadingSlice':
      return (
        <div key={slice.id} ref={ref(slice.id)}>
          <Layout
            indent="1/12"
            width="7/12"
            boxProps={{ paddingTop: 15, paddingBottom: 10 }}
          >
            <HeadingSlice {...slice} />
          </Layout>
        </div>
      )
    case 'LinkCardSlice':
      return (
        <Box key={slice.id} ref={ref(slice.id)} background="dotted">
          <Layout width="8/12" boxProps={{ paddingTop: 8, paddingBottom: 10 }}>
            <LinkCardSlice {...slice} />
          </Layout>
        </Box>
      )
    case 'MailingListSignupSlice':
      return (
        <Box key={slice.id} ref={ref(slice.id)} background="blue100">
          <Layout
            width="7/12"
            indent="1/12"
            boxProps={{ paddingTop: 10, paddingBottom: 7 }}
          >
            <MailingListSignup {...slice} />
          </Layout>
        </Box>
      )
    case 'StorySlice':
      return (
        <div key={slice.id} ref={ref(slice.id)} className={styles.gradient}>
          <Layout width="7/12" boxProps={{ paddingY: 10 }}>
            <StorySlice {...slice} />
          </Layout>
        </div>
      )
    case 'LatestNewsSlice':
      return (
        <div key={slice.id} ref={ref(slice.id)}>
          <Layout width="8/12" boxProps={{ paddingTop: 15, paddingBottom: 12 }}>
            <LatestNewsSlice {...slice} />
          </Layout>
        </div>
      )
    case 'LogoListSlice':
      return (
        <div key={slice.id} ref={ref(slice.id)} className={styles.gradient}>
          <Layout width="7/12" boxProps={{ paddingY: 10 }}>
            <LogoListSlice {...slice} />
          </Layout>
        </div>
      )
  }
}

const extractSliceTitle = (slice: Slice): [string, string] | null => {
  switch (slice.__typename) {
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

const decideSidebarType = (slice?: Slice): SidebarProps['type'] => {
  switch (slice && slice.__typename) {
    case 'MailingListSignupSlice':
    case 'LogoListSlice':
      return 'gradient'
    default:
      return 'standard'
  }
}

export interface GenericPageProps {
  page?: Page
}

const GenericPage: Screen<GenericPageProps> = ({ page }) => {
  const refs: Ref<{ [k: string]: HTMLDivElement }> = useRef({})
  const [spy, currentId] = useScrollSpy({ margin: 200 })
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)
  const sections = page.slices.map(extractSliceTitle).filter(Boolean)
  const slicesInHeader = page.slices.slice(0, page.numSlicesInHeader)
  const slices = page.slices.slice(page.numSlicesInHeader)
  const currentSlice = page.slices.find((s) => !currentId || s.id === currentId)
  const sidebarType = decideSidebarType(currentSlice)

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
      </Head>
      <div className={styles.gradient}>
        <Header />
        <ContentBlock>
          <Box position="relative" marginTop={6} marginX={[0, 0, 0, 6]}>
            <Sidebar
              type={sidebarType}
              title={page.title}
              sections={sections}
              currentSection={currentId}
            />
          </Box>
        </ContentBlock>
        <Layout width="content">
          <Breadcrumbs color="blue300" separatorColor="blue300">
            <Link href={makePath()}>
              <a>Ísland.is</a>
            </Link>
            <Link href={''}>
              <a>{page.title}</a>
            </Link>
          </Breadcrumbs>
        </Layout>
        {slicesInHeader.map((s) => renderSlice(s, setRef))}
      </div>
      {slices.map((s) => renderSlice(s, setRef))}
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
