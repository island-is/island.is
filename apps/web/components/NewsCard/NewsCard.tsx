import React from 'react'
import {
  Text,
  Link,
  Box,
  ArrowLink,
  TagProps,
  Tag,
  Inline,
} from '@island.is/island-ui/core'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { Image } from '@island.is/web/graphql/schema'

import * as styles from './NewsCard.treat'

type TagsProps = {
  tagProps?: Omit<TagProps, 'children'>
  title: string
}

interface NewsCardProps {
  title: string
  subtitle?: string
  introduction: string
  slug: string
  image?: Partial<Image>
  readMoreText?: string
  url: string
  as: string
  date?: string
  imagePosition?: 'top' | 'right'
  titleAs?: 'h2' | 'h3' | 'h4'
  tags?: Array<TagsProps>
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  subtitle,
  introduction,
  image,
  readMoreText = 'Lesa nánar',
  url,
  as,
  date,
  titleAs = 'h3',
  tags = [],
}) => {
  const { format } = useDateUtils()
  return (
    <Box
      component={Link}
      href={url}
      as={as}
      className={styles.root}
      boxShadow="subtle"
      overflow="hidden"
      borderRadius="large"
      display="flex"
      flexDirection="column"
      height="full"
      background="white"
    >
      <div
        className={styles.image}
        role="img"
        aria-label={image.title}
        style={{ backgroundImage: `url(${image.url}?fm=webp&w=640&q=80)` }}
      />
      <Box
        className={styles.content}
        display="flex"
        flexDirection="column"
        padding={3}
        paddingBottom={5}
        height="full"
      >
        <Text variant="eyebrow" color="purple400" paddingBottom={2}>
          {subtitle}
        </Text>
        {date && (
          <Text variant="eyebrow" as="p" color="purple400" paddingBottom={2}>
            {format(new Date(date), 'do MMMM yyyy')}
          </Text>
        )}
        <Text variant="h3" as={titleAs} paddingBottom={1}>
          {title}
        </Text>
        {!!tags.length && (
          <Box paddingTop={2} paddingBottom={3}>
            <Inline space={2}>
              {tags.map(({ title }, index) => {
                return (
                  <Tag key={index} variant="blue" label>
                    {title}
                  </Tag>
                )
              })}
            </Inline>
          </Box>
        )}
        <Text paddingBottom={3}>{introduction}</Text>
        <div className={styles.readMore}>
          <ArrowLink>{readMoreText}</ArrowLink>
        </div>
      </Box>
    </Box>
  )
}

export default NewsCard
