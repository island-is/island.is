import React from 'react'
import * as styles from './NewsCard.treat'
import { Typography, Link, Box, ArrowLink } from '@island.is/island-ui/core'

export type NewsImage = {
  url: string
  title: string
  contentType: string
  width: number
  height: number
}

interface NewsCardProps {
  title: string
  subtitle?: string
  introduction: string
  slug: string
  image?: NewsImage
  readMoreText?: string
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  subtitle,
  introduction,
  slug,
  image,
  readMoreText = 'Lesa nánar',
}) => {
  return (
    <Box
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
        <Typography variant="h3" as="h2" paddingBottom={1}>
          {title}
        </Typography>
        <Typography variant="p" paddingBottom={3}>
          {introduction}
        </Typography>
        <div className={styles.readMore}>
          <ArrowLink href={`/frett/${slug}`}>{readMoreText}</ArrowLink>
        </div>
      </Box>
    </Box>
  )
}

export default NewsCard
