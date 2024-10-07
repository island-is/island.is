import { Box, Button, LinkV2, Stack } from '@island.is/island-ui/core'
import { Text } from '@island.is/island-ui/core'
import { LatestGenericListItems as LatestGenericListItemsSchema } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import { ClickableItem, NonClickableItem } from '../GenericList'

interface LatestGenericListItemsProps {
  slice: LatestGenericListItemsSchema
}

export const LatestGenericListItems = ({
  slice,
}: LatestGenericListItemsProps) => {
  const { linkResolver } = useLinkResolver()

  const items = slice.itemResponse?.items ?? []
  if (items.length === 0) {
    return null
  }

  // Only allow organization subpage links as is
  let seeMoreLinkHref = ''
  if (
    slice.seeMorePage?.__typename === 'OrganizationSubpage' &&
    slice.seeMorePage.organizationPage?.slug &&
    slice.seeMorePage.slug
  ) {
    seeMoreLinkHref = linkResolver('organizationsubpage', [
      slice.seeMorePage.organizationPage.slug,
      slice.seeMorePage.slug,
    ]).href
  }

  const itemsAreClickable =
    slice.genericList?.itemType === 'Clickable' &&
    slice.seeMoreLinkText &&
    seeMoreLinkHref

  return (
    <Stack space={6}>
      <Stack space={3}>
        {slice.title && <Text variant="h2">{slice.title}</Text>}
        <Stack space={4}>
          {!itemsAreClickable &&
            items.map((item) => <NonClickableItem key={item.id} item={item} />)}
          {itemsAreClickable &&
            items.map((item) => (
              <ClickableItem
                key={item.id}
                item={item}
                baseUrl={seeMoreLinkHref}
              />
            ))}
        </Stack>
      </Stack>
      {slice.seeMoreLinkText && seeMoreLinkHref && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flexEnd"
          alignItems="center"
        >
          <LinkV2 href={seeMoreLinkHref}>
            <Button
              icon="arrowForward"
              iconType="filled"
              variant="text"
              as="span"
            >
              {slice.seeMoreLinkText}
            </Button>
          </LinkV2>
        </Box>
      )}
    </Stack>
  )
}
