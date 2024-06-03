import { GridContainer, Stack, Text } from '@island.is/island-ui/core'
import {
  GenericListItem,
  Query,
  QueryGetGenericListItemBySlugArgs,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import type { Screen } from '../../types'
import { GET_GENERIC_LIST_ITEM_BY_SLUG_QUERY } from '../queries/GenericList'

interface GenericListItemPageProps {
  item: GenericListItem
}

const GenericListItemPage: Screen<GenericListItemPageProps> = ({ item }) => {
  const { format } = useDateUtils()

  return (
    <GridContainer>
      <Stack space={0}>
        {item.date && (
          <Text variant="eyebrow">
            {format(new Date(item.date), 'dd.MM.yyyy')}
          </Text>
        )}
        <Text variant="h1" as="h1">
          {item.title}
        </Text>
        <Text as="div">{webRichText(item.content ?? [])}</Text>
      </Stack>
    </GridContainer>
  )
}

GenericListItemPage.getProps = async ({ apolloClient, query, locale }) => {
  const slug = query.genericListItemSlug

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

  if (!response?.data?.getGenericListItemBySlug) {
    throw new CustomNextError(
      404,
      `Generic List item with slug: ${slug} could not be found`,
    )
  }

  return {
    item: response.data.getGenericListItemBySlug,
  }
}

export default withMainLayout(GenericListItemPage)
