import { Box, GridContainer, Stack, Text } from '@island.is/island-ui/core'
import { HeadWithSocialSharing, Webreader } from '@island.is/web/components'
import type {
  GenericListItem,
  Query,
  QueryGetGenericListItemBySlugArgs,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import type { Screen } from '../../types'
import { GET_GENERIC_LIST_ITEM_BY_SLUG_QUERY } from '../queries/GenericList'

export interface GenericListItemPageProps {
  item: GenericListItem
  showReadspeaker?: boolean
  ogTitle?: string
}

const GenericListItemPage: Screen<GenericListItemPageProps> = ({
  item,
  showReadspeaker = true,
  ogTitle,
}) => {
  const { format } = useDateUtils()

  return (
    <GridContainer className="rs_read">
      <Box paddingBottom={2}>
        {ogTitle && <HeadWithSocialSharing title={ogTitle} />}
        <Stack space={1}>
          {item?.date && (
            <Text variant="eyebrow">
              {format(new Date(item.date), 'dd.MM.yyyy')}
            </Text>
          )}
          <Stack space={1}>
            <Text variant="h1" as="h1">
              {item?.title}
            </Text>
            {showReadspeaker && <Webreader readClass="rs_read" marginTop={0} />}
          </Stack>
          <Text as="div">{webRichText(item?.content ?? [])}</Text>
        </Stack>
      </Box>
    </GridContainer>
  )
}

GenericListItemPage.getProps = async ({ apolloClient, query, locale }) => {
  const [_slug, _subSlug, slug] = query.slugs as string[]

  if (!slug) {
    throw new CustomNextError(
      404,
      'Generic List item could not be found since no slug was provided',
    )
  }

  const response = await apolloClient.query<
    Query,
    QueryGetGenericListItemBySlugArgs
  >({
    query: GET_GENERIC_LIST_ITEM_BY_SLUG_QUERY,
    variables: {
      input: {
        lang: locale,
        slug: slug as string,
      },
    },
  })

  if (!response?.data?.getGenericListItemBySlug?.title) {
    throw new CustomNextError(
      404,
      `Generic List item with slug: ${slug} could not be found`,
    )
  }

  return {
    item: response.data.getGenericListItemBySlug,
  }
}

export default GenericListItemPage
