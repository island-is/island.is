import React from 'react'
import * as styles from './LifeEventCard.treat'
import { Box, Typography, Link } from '@island.is/island-ui/core'

interface Props {
  title: string
  intro: string
  thumbnail: string
  image: string
  url: string
}

const LifeEventCard: React.FC<Props> = ({
  title,
  intro,
  image,
  thumbnail,
  url,
}) => {
  return (
    <Link href={url}>
      <Box
        className={styles.card}
        alignItems="flexStart"
        background="white"
        display="flex"
        boxShadow="subtle"
        flexDirection={['column', 'column', 'row']}
        height="full"
        paddingX={[2, 2, 4]}
        paddingY={[1, 1, 3]}
        overflow="hidden"
      >
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${image})` }}
        />
        <Box
          display="flex"
          flexDirection="column"
          paddingTop={[2, 2, null]}
          paddingBottom={[4, 4, null]}
          marginRight={[2, 2, 2, 2, 1]}
        >
          <Typography variant="h3" as="h3" paddingBottom={1} color="blue400">
            {title}
          </Typography>
          <Typography variant="p">{intro}</Typography>
        </Box>

        <div
          className={styles.thumbnail}
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
      </Box>
    </Link>
  )
}

export default LifeEventCard
