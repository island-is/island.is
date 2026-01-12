import React, { memo, ReactNode } from 'react'
import dynamic from 'next/dynamic'

import {
  defaultRenderComponent,
  RenderConfig,
  renderSlices,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import { Link, LinkContext } from '@island.is/island-ui/core'

const TellUsAStory = dynamic(() => import('../TellUsAStory/TellUsAStory'))
const ContactUs = dynamic(() => import('../ContactUs/ContactUs'))

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

  children = <div id={slice.id}>{children}</div>

  return children
}

type RichTextProps = {
  body: SliceType[]
  locale?: string
  config?: Partial<RenderConfig>
}

export const RichText = memo(({ body, locale, config = {} }: RichTextProps) => {
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
