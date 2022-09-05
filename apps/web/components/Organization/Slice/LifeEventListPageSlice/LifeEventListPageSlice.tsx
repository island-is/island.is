import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { IconTitleCard } from '@island.is/web/components'
import type { LifeEventPageListSlice as LifeEventPageListSliceSchema } from '@island.is/web/graphql/schema'
import { linkResolver, LinkType } from '@island.is/web/hooks'

interface LifeEventPageListSliceProps {
  slice: LifeEventPageListSliceSchema
}

export const LifeEventPageListSlice: React.FC<LifeEventPageListSliceProps> = ({
  slice,
}) => {
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
                dataTestId={'lifeevent-card'}
                href={
                  linkResolver(page.__typename as LinkType, [page.slug]).href
                }
              />
            </Box>
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )
}
