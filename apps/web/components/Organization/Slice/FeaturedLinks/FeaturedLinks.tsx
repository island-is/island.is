import { Inline, LinkV2, Stack, Tag, Text } from '@island.is/island-ui/core'
import { FeaturedLinks as FeaturedLinksSchema } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'

interface FeaturedLinksProps {
  slice: FeaturedLinksSchema
}

export const FeaturedLinks = ({ slice }: FeaturedLinksProps) => {
  const { linkResolver } = useLinkResolver()
  return (
    <Stack space={2}>
      <Text variant="h4">{slice.title}</Text>
      <Inline space={2}>
        {(slice.links ?? [])
          .filter(
            (link) => Boolean(link.thing?.type) && Boolean(link.thing?.slug),
          )
          .map(({ title, attention, thing }) => {
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
    </Stack>
  )
}
