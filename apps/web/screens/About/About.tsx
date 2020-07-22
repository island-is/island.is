/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, ReactElement, useMemo } from 'react'
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
import ProjectStories, { StoryProps } from './ProjectStories'
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
import {
  GET_NEWS_LIST_QUERY,
  GET_TIMELINE_QUERY,
  GET_STORIES_QUERY,
} from '../queries'
import {
  Query,
  QueryGetNewsListArgs,
  QueryGetStoriesArgs,
  Timeline as TimelineApi,
  Story,
  ContentLanguage,
} from '@island.is/api/schema'

const Intro = () => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)

  return (
    <>
      <Stack space={3}>
        <Breadcrumbs color="blue300" separatorColor="blue300">
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
  stories: Query['getStories']
  timelineEvents: TimelineApi[]
  bullets: BulletListProps['items']
  changes: CardsProps
  news: Query['getNewsList']['news']
}

export const About: Screen<AboutProps> = ({
  stories: apiStories,
  timelineEvents: apiTimeline,
  bullets,
  news,
  changes,
}) => {
  const sections: [string, string][] = [
    ['timeline', 'Verkefnið'],
    ['mailinglist', 'Vertu með'],
    ['changes', 'Hvað breytist'],
    ['bullets', 'Fagleg nálgun'],
    ['collaborators', 'Samstarf'],
    ['news', 'Fréttir og tilkynningar'],
  ]

  const aliases = {
    heading1: 'changes',
    heading2: 'bullets',
    stories: 'collaborators',
  }

  const [spy, _currentId] = useScrollSpy({ margin: 230 })
  const currentId = aliases[_currentId] || _currentId

  const stories = useMemo(() => apiStories.map(mapStory), [apiStories])

  const timelineEvents = useMemo(() => {
    return apiTimeline.map(mapTimeline)
  }, [apiTimeline])

  const gradients = ['timeline', 'mailinglist', 'collaborators']

  return (
    <div>
      <div ref={spy('timeline')}>
        <Layout background="gradient">
          <Header />
          <Content offsetRight columns={7} center>
            <Box paddingY={2}>
              <Intro />
            </Box>
            <Sidebar
              title="Stafrænt Ísland"
              sections={sections}
              currentSection={currentId}
              type={gradients.includes(currentId) ? 'gradient' : 'standard'}
            />
          </Content>
          <TimelineSection events={timelineEvents} />
        </Layout>
      </div>

      <div ref={spy('mailinglist')}>
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
        <Layout
          contentProps={{ columns: 7, offsetRight: true }}
          boxProps={{ paddingBottom: 15 }}
        >
          <BulletList items={bullets} />
        </Layout>
      </div>

      <div ref={spy('collaborators')}>
        <Layout
          background="gradient"
          contentProps={{ columns: 7, center: true, offsetRight: true }}
          boxProps={{ paddingTop: 15, paddingBottom: 6 }}
        >
          <Collaborators />
        </Layout>
      </div>

      <div ref={spy('stories')}>
        <Layout
          background="gradient"
          contentProps={{ columns: 7, offsetRight: true }}
          boxProps={{ paddingTop: 12, paddingBottom: 10 }}
        >
          <ProjectStories stories={stories} />
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

About.getInitialProps = async ({ apolloClient, locale }) => {
  const [news, stories, timeline] = await Promise.all([
    apolloClient.query<Query, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          perPage: 3,
        },
      },
    }),
    apolloClient.query<Query, QueryGetStoriesArgs>({
      query: GET_STORIES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query>({
      query: GET_TIMELINE_QUERY,
    }),
  ])

  const mocks = await import('./mockdata.json')

  return {
    news: news.data.getNewsList.news,
    timelineEvents: timeline.data.getTimeline,
    stories: stories.data.getStories,
    bullets: mocks.bullets as BulletListProps['items'],
    changes: mocks.changes as CardsProps,
    layoutConfig: {
      showHeader: false,
      wrapContent: false,
    },
  }
}

const mapStory = (story: Story): StoryProps => ({
  logo: story.logo.url,
  label: story.label,
  title: story.title,
  intro: story.intro,
})

const mapTimeline = (e: TimelineApi): TimelineEvent => ({
  date: new Date(e.date),
  title: e.title,
  value: e.numerator,
  maxValue: e.denominator,
  valueLabel: e.label,
  data: e.body && {
    labels: e.tags,
    text: e.body,
    link: e.link,
  },
})

export default withApollo(About)
