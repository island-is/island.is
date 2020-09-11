import React from 'react'
import * as styles from './LifeEventCard.treat'
import { Box, Typography, Link, FocusableBox } from '@island.is/island-ui/core'

interface Props {
  title: string
  intro: string
  image: string
  url: string
}

const LifeEventCard: React.FC<Props> = ({ title, intro, image, url }) => {
  return (
    <FocusableBox
      component={Link}
      href={url}
      borderColor="blue200"
      borderWidth="standard"
      height="full"
    >
      <Box
        className={styles.card}
        alignItems="flexStart"
        background="white"
        display="flex"
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
          className={styles.content}
          marginRight={[2, 2, 2, 2, 1]}
        >
          <Typography variant="h3" as="h3" paddingBottom={1} color="blue400">
            {title}
          </Typography>
          <Typography variant="p">{intro}</Typography>
        </Box>

        <div
          className={styles.thumbnail}
          style={{ backgroundImage: `url(${image})` }}
        />
      </Box>
    </FocusableBox>
  )
}

export default LifeEventCard
