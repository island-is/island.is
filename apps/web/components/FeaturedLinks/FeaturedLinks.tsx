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
      {links.map(({ title, attention, thing }) => {
        const cardUrl = linkResolver(thing?.type as LinkType, [
          thing?.slug as string,
        ])
        return cardUrl?.href && cardUrl?.href.length > 0 ? (
          <Tag
            key={title}
            {...(cardUrl.href.startsWith('/')
              ? {
                  CustomLink: ({ children, ...props }) => (
                    <LinkV2
                      key={title}
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
        ) : (
          <Tag key={title} variant="blue" attention={attention}>
            {title}
          </Tag>
        )
      })}
    </Inline>
  )
}
