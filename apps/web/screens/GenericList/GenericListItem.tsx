import cn from 'classnames'

import { FaqList, FaqListProps, Image } from '@island.is/island-ui/contentful'
import {
  Box,
  GridContainer,
  Inline,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import {
  AccordionSlice,
  HeadWithSocialSharing,
  Webreader,
} from '@island.is/web/components'
import type {
  AccordionSlice as AccordionSliceSchema,
  GenericListItem,
  Query,
  QueryGetGenericListItemBySlugArgs,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import type { Screen } from '../../types'
import { GET_GENERIC_LIST_ITEM_BY_SLUG_QUERY } from '../queries/GenericList'
import * as styles from './GenericListItem.css'

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
  const filterTags = item.filterTags ?? []

  return (
    <GridContainer className="rs_read">
      <Box paddingBottom={2}>
        {ogTitle && <HeadWithSocialSharing title={ogTitle} />}
        <Stack space={1}>
          {item.date && (
            <Text variant="eyebrow">
              {format(new Date(item.date), 'do MMMM yyyy')}
            </Text>
          )}
          <Stack space={2}>
            <Text variant="h1" as="h1">
              {item.title}
            </Text>
            {filterTags.length > 0 && (
              <Inline space={1}>
                {filterTags.map((tag) => (
                  <Tag
                    disabled={true}
                    variant="purple"
                    outlined={true}
                    key={tag.id}
                  >
                    {tag.title}
                  </Tag>
                ))}
              </Inline>
            )}
            {showReadspeaker && <Webreader readClass="rs_read" marginTop={0} />}
          </Stack>
          {item.image && (
            <Box
              paddingY={2}
              className={cn({
                [styles.floatedImage]: item.fullWidthImageInContent !== false,
              })}
            >
              <Image
                {...item?.image}
                url={item?.image?.url ? item.image.url : ''}
              />
            </Box>
          )}
          <Text as="div">
            {webRichText(item.content ?? [], {
              renderComponent: {
                FaqList: (slice: FaqListProps) => (
                  <Box className={styles.clearBoth}>
                    <FaqList {...slice} />
                  </Box>
                ),
                AccordionSlice: (slice: AccordionSliceSchema) => (
                  <Box className={styles.clearBoth}>
                    <AccordionSlice slice={slice} />
                  </Box>
                ),
              },
            })}
          </Text>
        </Stack>
      </Box>
    </GridContainer>
  )
}

GenericListItemPage.getProps = async ({ apolloClient, query, locale }) => {
  const querySlugs = (query.slugs ?? []) as string[]
  const slug =
    querySlugs[querySlugs.length - 1] ?? (query.genericListItemSlug as string)

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

export default GenericListItemPage
