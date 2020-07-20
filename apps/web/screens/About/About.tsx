/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, ReactElement } from 'react'
import cn from 'classnames'
import { Screen } from '../../types'
import { useI18n } from '@island.is/web/i18n'
import { Locale } from '@island.is/web/i18n/I18n'
import { withApollo } from '../../graphql'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import Header from '@island.is/web/components/Header/Header'
import useScrollSpy from '../../hooks/useScrollSpy'
import BulletList, { BulletListProps } from './BulletList'
import MailingListSignup from '@island.is/web/components/MailingListSignup/MailingListSignup'
import Collaborators from './Collaborators'
import ProjectStories from './ProjectStories'
import SectionHeading from './SectionHeading'
import Cards, { CardsProps } from './Cards'
import Sidebar from './Sidebar'
import LatestNews from './LatestNews'
import Layout, { Content } from './Layout'
import {
  Breadcrumbs,
  Stack,
  Box,
  Typography,
  Timeline,
  TimelineEvent,
} from '@island.is/island-ui/core'
import Link from 'next/link'
import { GET_NEWS_LIST_QUERY } from '../queries'
import {
  Query,
  ContentLanguage,
  QueryGetNewsListArgs,
} from '@island.is/api/schema'
import * as styles from './About.treat'

const Intro = () => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)

  return (
    <>
      <Stack space={3}>
        <Breadcrumbs>
          <Link href={makePath()}>
            <a>Ísland.is</a>
          </Link>
          <Link href={''}>
            <a>Ísland.is</a>
          </Link>
        </Breadcrumbs>
        <Typography variant="h1" as="h1" color="white">
          Stafræn opinber þjónusta
        </Typography>
        <Typography variant="intro" as="p" color="white">
          Við vinnum að margvíslegum verkefnum sem öll stuðla að því að gera
          opinbera þjónustu skilvirkari og notendavænni.
        </Typography>
        <Typography variant="p" as="p" color="white">
          Á tímalínunni er hægt að sjá núverandi stöðu og skyggnast inn í
          framtíðina:
        </Typography>
      </Stack>
    </>
  )
}

interface TimelineSectionProps {
  events: TimelineEvent[]
}

const TimelineSection: FC<TimelineSectionProps> = ({ events }) => (
  <Timeline events={events} />
)

interface AboutProps {
  timelineEvents: TimelineEvent[]
  bullets: BulletListProps['items']
  changes: CardsProps
  news: Query['getNewsList']['news']
}

export const About: Screen<AboutProps> = ({
  timelineEvents,
  bullets,
  news,
  changes,
}) => {
  const [spy, currentId] = useScrollSpy(230)

  return (
    <div>
      <div ref={spy('timeline:gradient')}>
        <Layout background="gradient">
          <Header />
          <Content offsetRight columns={7} center>
            <Box paddingY={2}>
              <Intro />
            </Box>
            <Sidebar type={currentId.endsWith(':gradient') ? 'gradient' : 'standard'} />
          </Content>
          <TimelineSection events={timelineEvents} />
        </Layout>
      </div>

      <div ref={spy('mailinglist:gradient')}>
        <Layout
          background="blue100"
          contentProps={{ columns: 7, center: true, offsetRight: true }}
          boxProps={{ paddingTop: 8, paddingBottom: 6 }}
        >
          <MailingListSignup />
        </Layout>
      </div>

      <div ref={spy('heading1')}>
        <Layout
          contentProps={{ columns: 7, center: true, offsetRight: true }}
          boxProps={{ paddingTop: 15, paddingBottom: 10 }}
        >
          <SectionHeading
            title="Öll opinber þjónusta á einum stað"
            intro="Við viljum að stafræn þjónusta sé aðgengileg, sniðin að notandanum og með skýra framtíðarsýn."
          />
        </Layout>
      </div>

      <div ref={spy('changes')}>
        <Layout
          background="dotted"
          contentProps={{ columns: 8 }}
          boxProps={{ paddingTop: 8, paddingBottom: 10 }}
        >
          <Cards {...changes} />
        </Layout>
      </div>

      <div ref={spy('heading2')}>
        <Layout
          contentProps={{ columns: 7, center: true, offsetRight: true }}
          boxProps={{ paddingTop: 15, paddingBottom: 10 }}
        >
          <SectionHeading
            title="Fagleg nálgun"
            intro="Við vinnum að margvíslegum verkefnum sem öll stuðla að því að gera opinbera þjónustu skilvirkari og notendavænni."
          />
        </Layout>
      </div>

      <div ref={spy('bullets')}>
        <Layout contentProps={{ columns: 7, offsetRight: true }}>
          <BulletList items={bullets} />
        </Layout>
      </div>

      <div ref={spy('collaborators:gradient')}>
        <Layout
          background="gradient"
          contentProps={{ columns: 7, center: true, offsetRight: true }}
          boxProps={{ paddingTop: 15, paddingBottom: 6 }}
        >
          <Collaborators />
        </Layout>
      </div>

      <div ref={spy('stories:gradient')}>
        <Layout
          background="gradient"
          contentProps={{ columns: 7, offsetRight: true }}
          boxProps={{ paddingTop: 12, paddingBottom: 10 }}
        >
          <ProjectStories stories={[]} />
        </Layout>
      </div>

      <div ref={spy('news')}>
        <Layout
          contentProps={{ columns: 8, offsetRight: true }}
          boxProps={{ paddingTop: 12, paddingBottom: 10 }}
        >
          <LatestNews title="Fréttir og tilkynningar" newsList={news} />
        </Layout>
      </div>
    </div>
  )
}

About.getInitialProps = async ({ apolloClient }) => {
  const {
    data: {
      getNewsList: { news },
    },
  } = await apolloClient.query<Query, QueryGetNewsListArgs>({
    query: GET_NEWS_LIST_QUERY,
    variables: {
      input: {
        perPage: 3,
      },
    },
  })

  const mocks = await import('./mockdata.json')

  return {
    news,
    timelineEvents: mocks.timeline as TimelineEvent[],
    bullets: mocks.bullets as BulletListProps['items'],
    changes: mocks.changes as CardsProps,
    layoutConfig: {
      showHeader: false,
      wrapContent: false,
    },
  }
}

export default withApollo(About)
