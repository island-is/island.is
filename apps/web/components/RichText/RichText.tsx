import React, { FC, memo, ReactNode } from 'react'
import { AllSlicesFragment as Slice } from '@island.is/web/graphql/schema'
import {
  renderSlices,
  defaultRenderComponent,
  RenderConfig,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import { LinkContext, Link } from '@island.is/island-ui/core'
import { TellUsAStory, ContactUs } from '@island.is/web/components'

const FULL_WIDTH_SLICE_TYPES: Array<Slice['__typename']> = [
  'SectionWithImage',
  'TeamList',
  'ContactUs',
  'Location',
  'TellUsAStory',
]

const renderComponent = (
  slice: SliceType,
  locale: string,
  config: RenderConfig,
) => {
  let children: ReactNode | null = null

  switch (slice.__typename) {
    case 'ContactUs':
      children = <ContactUs {...slice} />
      break
    case 'TellUsAStory':
      children = <TellUsAStory {...slice} showIntro={false} locale={locale} />
      break
    default:
      children = defaultRenderComponent(slice, locale, config)
      break
  }

  if (
    config.skipGrid !== true &&
    !FULL_WIDTH_SLICE_TYPES.includes(slice.__typename)
  ) {
    children
  }

  if (slice.__typename !== 'Html') {
    // Wrap with slice id for navigation and linking to specific slice.
    // Html type is excluded because navigation/linking is handled by
    // the heading tags in the html.
    children = <div id={slice.id}>{children}</div>
  }

  return children
}

export const RichText: FC<{
  body: SliceType[]
  locale?: string
  config?: Partial<RenderConfig>
}> = memo(({ body, locale, config = {} }) => {
  return (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, children) => (
          <Link
            href={href}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {children}
          </Link>
        ),
      }}
    >
      {renderSlices(body, locale, { renderComponent, ...config })}
    </LinkContext.Provider>
  )
})

export default RichText
