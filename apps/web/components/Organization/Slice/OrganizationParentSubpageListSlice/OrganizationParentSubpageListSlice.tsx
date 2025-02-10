import { Box, Stack, Text } from '@island.is/island-ui/core'
import { IconTitleCard } from '@island.is/web/components'
import { OrganizationParentSubpageList } from '@island.is/web/graphql/schema'

import * as styles from './OrganizationParentSubpageList.css'

interface OrganizationParentSubpageListSliceProps {
  slice: OrganizationParentSubpageList
}

// TODO: add variant
export const OrganizationParentSubpageListSlice = ({
  slice,
}: OrganizationParentSubpageListSliceProps) => {
  return (
    <Stack space={3}>
      {slice.title && <Text variant="h3">{slice.title}</Text>}
      <Box className={styles.itemContainer}>
        {slice.pageLinks.map((page) => (
          <IconTitleCard
            heading={page.label}
            href={page.href}
            imgSrc={page.thumbnailImageHref ?? ''}
            alt=""
          />
        ))}
      </Box>
    </Stack>
  )
}
