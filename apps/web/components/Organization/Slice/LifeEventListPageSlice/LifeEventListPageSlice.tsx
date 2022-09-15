import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  ProfileCard,
} from '@island.is/island-ui/core'
import { IconTitleCard } from '@island.is/web/components'
import type { LifeEventPageListSlice as LifeEventPageListSliceSchema } from '@island.is/web/graphql/schema'
import { linkResolver, LinkType, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './LifeEventPageListSlice.css'

const MAX_DESCRIPTION_LENGTH = 120

const truncateText = (text: string) => {
  if (text.length > MAX_DESCRIPTION_LENGTH)
    return text.slice(0, MAX_DESCRIPTION_LENGTH) + '...'
  return text
}

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
          return (
            <ProfileCard
              key={page.id}
              variant="title-above"
              size="small"
              title={page.shortTitle || page.title}
              description={page.shortIntro || truncateText(page.intro)}
              link={{
                text: page.seeMoreText || n('profileCardSeeMore', 'Sjá nánar'),
                url: linkResolver(
                  'digitalicelandservicesdetailpage',
                  [page.slug],
                  activeLocale,
                ).href,
              }}
              image={page.thumbnail?.url}
            />
          )
        })}
      </Box>
    )
  }

  return (
    <GridContainer>
      <GridRow>
        {slice.lifeEventPageList?.map((page) => (
          <GridColumn span={['1/1', '1/1', '1/1', '1/1', '1/2']} key={page.id}>
            <Box marginBottom={3}>
              <IconTitleCard
                heading={page.shortTitle || page.title}
                imgSrc={page.tinyThumbnail?.url}
                alt={page.tinyThumbnail?.title}
                href={
                  linkResolver(anchorPageLinkType, [page.slug], activeLocale)
                    .href
                }
              />
            </Box>
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )
}
