import { Inline, LinkV2, Tag } from '@island.is/island-ui/core'
import type { Featured } from '@island.is/web/graphql/schema'
import { type LinkType, useLinkResolver } from '@island.is/web/hooks'

interface FeaturedLinksProps {
  links: Featured[]
}

export const FeaturedLinks = ({ links }: FeaturedLinksProps) => {
  const { linkResolver } = useLinkResolver()
  return (
    <Inline space={2}>
      {links
        .filter((link) => Boolean(link.title?.trim()))
        .map(({ title, attention, thing }) => {
          if (!thing?.type || !thing?.slug) {
            return (
              <Tag key={title} variant="blue" attention={attention}>
                {title}
              </Tag>
            )
          }
          const cardUrl = linkResolver(thing.type as LinkType, [thing.slug])
          if (!cardUrl?.href) {
            return (
              <Tag key={title} variant="blue" attention={attention}>
                {title}
              </Tag>
            )
          }

          return (
            <Tag
              key={title}
              {...(cardUrl.href.startsWith('/')
                ? {
                    CustomLink: ({ children, ...props }) => (
                      <LinkV2
                        {...props}
                        {...cardUrl}
                        dataTestId="featured-link"
                      >
                        {children}
                      </LinkV2>
                    ),
                  }
                : { href: cardUrl.href })}
              variant="blue"
              attention={attention}
            >
              {title}
            </Tag>
          )
        })}
    </Inline>
  )
}
