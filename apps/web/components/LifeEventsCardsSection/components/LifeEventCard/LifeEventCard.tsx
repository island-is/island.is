import React from 'react'
import * as styles from './LifeEventCard.treat'
import { Box, Typography, Link } from '@island.is/island-ui/core'

interface Props {
  title: string
  intro: string
  thumbnail: string
  url: string
}

const LifeEventCard: React.FC<Props> = ({ title, intro, thumbnail, url }) => {
  return (
    <Link href={url}>
      <Box
        className={styles.card}
        alignItems="flexStart"
        background="white"
        borderColor="purple200"
        borderRadius="large"
        borderStyle="solid"
        borderWidth="standard"
        display="flex"
        height="full"
        paddingX={4}
        paddingY={3}
        overflow="hidden"
      >
        <Box
          display="flex"
          flexDirection="column"
          marginRight={[2, 2, 2, 2, 1]}
        >
          <Typography variant="h3" as="h3" paddingBottom={1} color="blue400">
            {title}
          </Typography>
          <Typography variant="p">{intro}</Typography>
        </Box>

        <Box
          className={styles.thumbnail}
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
      </Box>
    </Link>
  )
}

export default LifeEventCard
