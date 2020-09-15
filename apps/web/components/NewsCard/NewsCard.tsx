import React from 'react'
import { Typography, Link, Box, ArrowLink } from '@island.is/island-ui/core'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import { Image } from '../../graphql/schema'
import * as styles from './NewsCard.treat'

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
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  subtitle,
  introduction,
  slug,
  image,
  readMoreText = 'Lesa nánar',
  url,
  as,
  date,
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
        style={{ backgroundImage: `url(${image.url})` }}
      />
      <Box
        className={styles.content}
        display="flex"
        flexDirection="column"
        padding={3}
        paddingBottom={5}
        height="full"
      >
        <Typography variant="eyebrow" color="purple400" paddingBottom={2}>
          {subtitle}
        </Typography>
        {date && (
          <Typography
            variant="eyebrow"
            as="p"
            color="purple400"
            paddingBottom={2}
          >
            {format(new Date(date), 'do MMMM yyyy')}
          </Typography>
        )}
        <Typography variant="h3" as="h2" paddingBottom={1}>
          {title}
        </Typography>
        <Typography variant="p" paddingBottom={3}>
          {introduction}
        </Typography>
        <div className={styles.readMore}>
          <ArrowLink>{readMoreText}</ArrowLink>
        </div>
      </Box>
    </Box>
  )
}

export default NewsCard
