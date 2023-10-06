import { Box, Link, ProfileCard, Text } from '@island.is/island-ui/core'
import { IconTitleCard } from '@island.is/web/components'
import type { LifeEventPageListSlice as LifeEventPageListSliceSchema } from '@island.is/web/graphql/schema'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { extractAnchorPageLinkType } from '@island.is/web/utils/anchorPage'

import * as styles from './LifeEventPageListSlice.css'

interface LifeEventPageListSliceProps {
  slice: LifeEventPageListSliceSchema
  namespace: Record<string, string>
  renderLifeEventPagesAsProfileCards?: boolean
}

export const LifeEventPageListSlice: React.FC<
  React.PropsWithChildren<LifeEventPageListSliceProps>
> = ({ slice, namespace, renderLifeEventPagesAsProfileCards = false }) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)

  if (renderLifeEventPagesAsProfileCards) {
    return (
      <Box className={styles.profileCardContainer} marginLeft={[0, 0, 0, 0, 6]}>
        {slice.lifeEventPageList?.map((page) => {
          const linkType = extractAnchorPageLinkType(page)

          const href = linkResolver(linkType, [page.slug], activeLocale).href
          return (
            <Link key={page.id} href={href}>
              <ProfileCard
                heightFull={true}
                variant="title-above"
                size="small"
                title={page.shortTitle || page.title}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                description={page.shortIntro || page.intro}
                link={{
                  text:
                    page.seeMoreText || n('profileCardSeeMore', 'Sjá nánar'),
                  url: href,
                }}
                image={page.thumbnail?.url}
              />
            </Link>
          )
        })}
      </Box>
    )
  }

  return (
    <Box>
      {slice.title && (
        <Text variant="h2" marginBottom={3}>
          {slice.title}
        </Text>
      )}
      <Box className={styles.lifeEventCardContainer}>
        {slice.lifeEventPageList?.map((page) => (
          <IconTitleCard
            heading={page.shortTitle || page.title}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            imgSrc={page.tinyThumbnail?.url}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            alt={page.tinyThumbnail?.title}
            href={
              linkResolver(extractLinkType(page), [page.slug], activeLocale)
                .href
            }
          />
        ))}
      </Box>
    </Box>
  )
}
