import { Box, Link, ProfileCard } from '@island.is/island-ui/core'
import { IconTitleCard } from '@island.is/web/components'
import type { LifeEventPageListSlice as LifeEventPageListSliceSchema } from '@island.is/web/graphql/schema'
import { linkResolver, LinkType, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './LifeEventPageListSlice.css'

interface LifeEventPageListSliceProps {
  slice: LifeEventPageListSliceSchema
  namespace: Record<string, string>
  renderLifeEventPagesAsProfileCards?: boolean
  anchorPageLinkType?: LinkType
}

export const LifeEventPageListSlice: React.FC<LifeEventPageListSliceProps> = ({
  slice,
  namespace,
  renderLifeEventPagesAsProfileCards = false,
  anchorPageLinkType = 'lifeeventpage',
}) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)

  if (renderLifeEventPagesAsProfileCards) {
    return (
      <Box className={styles.profileCardContainer} marginLeft={[0, 0, 0, 0, 6]}>
        {slice.lifeEventPageList?.map((page) => {
          const href = linkResolver(
            'digitalicelandservicesdetailpage',
            [page.slug],
            activeLocale,
          ).href
          return (
            <Link key={page.id} href={href}>
              <ProfileCard
                heightFull={true}
                variant="title-above"
                size="small"
                title={page.shortTitle || page.title}
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
    <Box className={styles.lifeEventCardContainer}>
      {slice.lifeEventPageList?.map((page) => (
        <IconTitleCard
          heading={page.shortTitle || page.title}
          imgSrc={page.tinyThumbnail?.url}
          alt={page.tinyThumbnail?.title}
          href={
            linkResolver(anchorPageLinkType, [page.slug], activeLocale).href
          }
        />
      ))}
    </Box>
  )
}
