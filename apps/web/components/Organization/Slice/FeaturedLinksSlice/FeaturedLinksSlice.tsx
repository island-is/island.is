import { Stack, Text } from '@island.is/island-ui/core'
import { FeaturedLinks } from '@island.is/web/components'
import { FeaturedLinks as FeaturedLinksSchema } from '@island.is/web/graphql/schema'

interface FeaturedLinksSliceProps {
  slice: FeaturedLinksSchema
}

export const FeaturedLinksSlice = ({ slice }: FeaturedLinksSliceProps) => {
  if (!slice.featuredLinks?.length) return null
  return (
    <Stack space={2}>
      <Text variant="h4">{slice.title}</Text>
      <FeaturedLinks links={slice.featuredLinks} />
    </Stack>
  )
}
