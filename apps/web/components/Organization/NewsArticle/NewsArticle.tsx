import React from 'react'
import cn from 'classnames'
import isBefore from 'date-fns/isBefore'
import subYears from 'date-fns/subYears'

import {
  EmbeddedVideo,
  EmbeddedVideoProps,
  Image,
  ImageProps,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import { AlertMessage, Box, Stack, Text } from '@island.is/island-ui/core'
import { EmailSignup, Webreader } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { webRichText } from '@island.is/web/utils/richText'

import { GetSingleNewsItemQuery } from '../../../graphql/schema'
import * as styles from './NewsArticle.css'

interface NewsArticleProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
  showDate?: boolean
}

const NewsItemImage = ({ newsItem }: NewsArticleProps) =>
  newsItem?.image && (
    <Box
      paddingY={2}
      className={cn({
        [styles.floatedImage]: newsItem?.fullWidthImageInContent === false,
      })}
    >
      <Image
        {...newsItem?.image}
        url={newsItem?.image?.url ? newsItem.image?.url : ''}
        height={newsItem.image.height ?? ''}
        caption={newsItem?.imageText ?? undefined}
      />
    </Box>
  )

export const NewsArticle: React.FC<
  React.PropsWithChildren<NewsArticleProps>
> = ({ newsItem, showDate = true }) => {
  const { format } = useDateUtils()

  const formattedDate = newsItem?.date
    ? format(new Date(newsItem.date), 'do MMMM yyyy')
    : ''

  const { activeLocale } = useI18n()

  const displaySignLanguageVideo = Boolean(newsItem?.signLanguageVideo?.url)
  const displayImageAboveContent =
    !newsItem?.fullWidthImageInContent ||
    (!displaySignLanguageVideo && newsItem?.fullWidthImageInContent)

  const bottomSlices = newsItem?.organization?.newsBottomSlices ?? []

  return (
    <Box paddingBottom={[0, 0, 4]}>
      <Stack space={3}>
        {newsItem?.date &&
          isBefore(new Date(newsItem.date), subYears(new Date(), 1)) && (
            <AlertMessage
              type="info"
              title={
                activeLocale === 'is'
                  ? 'Þessi frétt er meira en árs gömul'
                  : 'This news article is more than a year old'
              }
            />
          )}
        <Box className="rs_read">
          <Text variant="h1" as="h1" paddingBottom={2}>
            {newsItem?.title}
          </Text>
        </Box>
      </Stack>

      <Webreader
        marginTop={0}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        readId={null}
        readClass="rs_read"
      />

      {showDate && (
        <Box className="rs_read">
          <Text variant="h4" as="p" paddingBottom={2} color="blue400">
            {formattedDate}
          </Text>
        </Box>
      )}

      {displaySignLanguageVideo && (
        <Box paddingBottom={3}>
          <EmbeddedVideo
            url={newsItem?.signLanguageVideo?.url ?? ''}
            locale={activeLocale}
            thumbnailImageUrl={newsItem?.signLanguageVideo?.thumbnailImageUrl}
          />
        </Box>
      )}

      <Box className="rs_read">
        <Text variant="intro" as="p" paddingBottom={2}>
          {newsItem?.intro}
        </Text>
      </Box>

      {displayImageAboveContent && <NewsItemImage newsItem={newsItem} />}

      <Box className="rs_read" paddingBottom={4} width="full">
        {webRichText(
          newsItem?.content
            ? (newsItem?.content as SliceType[])
            : ([] as SliceType[]),
          {
            renderComponent: {
              Image: (slice: ImageProps) => {
                return (
                  <Box className={styles.clearBoth}>
                    <Image {...slice} url={slice.url} />
                  </Box>
                )
              },
              EmbeddedVideo: (slice: EmbeddedVideoProps) => (
                <Box className={styles.clearBoth}>
                  <EmbeddedVideo {...slice} />
                </Box>
              ),
            },
          },
        )}
      </Box>

      {!displayImageAboveContent &&
        displaySignLanguageVideo &&
        newsItem?.fullWidthImageInContent && (
          <NewsItemImage newsItem={newsItem} />
        )}

      {bottomSlices.length > 0 && (
        <Box paddingTop={3}>
          <Stack space={3}>
            {bottomSlices.map((slice) => (
              <EmailSignup key={slice.id} slice={slice} />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}
