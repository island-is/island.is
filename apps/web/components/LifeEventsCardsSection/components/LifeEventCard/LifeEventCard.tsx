import React from 'react'
import * as styles from './LifeEventCard.treat'
import {
  Box,
  Typography,
  Link,
  FocusableBox,
  Tag,
  Inline,
} from '@island.is/island-ui/core'

interface Props {
  title: string
  intro: string
  image: string
  url: string
  tags?: string[]
}

const LifeEventCard: React.FC<Props> = ({ title, intro, image, url, tags }) => {
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
        height="full"
        paddingX={[2, 2, 4]}
        paddingY={[1, 1, 3]}
        overflow="hidden"
      >
        <Box
          display="flex"
          flexDirection="column"
          className={styles.content}
          marginRight={[2, 2, 2, 2, 1]}
        >
          <Typography variant="h3" as="h3" paddingBottom={1} color="blue400">
            {title}
          </Typography>
          <Box display="flex" flexGrow={1}>
            <Typography variant="p">{intro}</Typography>
          </Box>{' '}
          {tags && (
            <Inline space={1}>
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  label
                  variant="purple"
                  noBackgroundFill
                  bordered
                >
                  {tag}
                </Tag>
              ))}
            </Inline>
          )}
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
