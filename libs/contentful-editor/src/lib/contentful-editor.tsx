import React from 'react'
import { NextComponentType, NextPageContext } from 'next'
import {
  getContentfulInfo,
  Editor,
  ContentfulProvider,
} from '@island.is/contentful-editor'

export type ContentfulLocale = 'is-IS' | 'en'

const CONTENTFUL_TYPES_TO_MAP = [
  { id: 'lifeEventPage', matches: ['life-event', 'lifsvidburdur'] },
  { id: 'articleCategory', matches: ['category', 'flokkur'] },
  { id: 'news', matches: ['news', 'frett'] },
  { id: 'article', matches: ['article', 'grein'] },
  { id: 'tellUsAStory', matches: ['tell-us-your-story', 'segdu-okkur-sogu'] },
  { id: 'organization', matches: ['organizations', 'stofnanir'] },
  { id: 'aboutPage', matches: ['stafraent-island'] },
]

/**
 * LOGIN to an endpoint somewhere else first through oauth contentful application.
 * Get management token there (not working from what I tested so far)
 * If we don't have any management token, we just return the component without anything else wrapped around
 */
export const withContentfulEditor = (
  Component: NextComponentType<NextPageContext, unknown, any>,
) => {
  const NewComponent = ({
    pageProps,
    slug,
    contentType,
    locale,
  }: {
    pageProps: unknown
    slug: string
    contentType: string
    locale: ContentfulLocale
  }) => (
    <ContentfulProvider config={{ slug, contentType, locale }}>
      <Editor>
        <Component {...pageProps} />
      </Editor>
    </ContentfulProvider>
  )

  NewComponent.getInitialProps = async (ctx: NextPageContext) => {
    const { slug, contentType, locale } = getContentfulInfo(
      ctx,
      CONTENTFUL_TYPES_TO_MAP,
    )

    const props = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    return {
      pageProps: props,
      slug,
      contentType,
      locale,
    }
  }

  return NewComponent
}
