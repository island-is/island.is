import { Box, Button, LinkV2, Stack } from '@island.is/island-ui/core'
import { ClickableItem, NonClickableItem } from '@island.is/web/components'
import {
  FeaturedGenericListItems,
  GenericListItemType,
} from '@island.is/web/graphql/schema'

interface FeaturedGenericListItemsSliceProps {
  slice: FeaturedGenericListItems
}

export const FeaturedGenericListItemsSlice = ({
  slice,
}: FeaturedGenericListItemsSliceProps) => {
  return (
    <Stack space={5}>
      <Stack space={2}>
        {slice.items.map((item) => {
          if (
            item.genericList?.itemType === GenericListItemType.Clickable &&
            Boolean(slice.baseUrl)
          ) {
            return (
              <ClickableItem
                item={item}
                key={item.id}
                baseUrl={slice.baseUrl}
              />
            )
          }
          return <NonClickableItem item={item} key={item.id} />
        })}
      </Stack>
      {Boolean(slice.baseUrl) && slice.items.length > 0 && (
        <Box display="flex" justifyContent="flexEnd">
          <LinkV2 href={slice.filterUrl || slice.baseUrl}>
            <Button
              variant="text"
              icon="arrowForward"
              as="span"
              unfocusable={true}
            >
              {slice.seeMoreLinkTextString}
            </Button>
          </LinkV2>
        </Box>
      )}
    </Stack>
  )
}
