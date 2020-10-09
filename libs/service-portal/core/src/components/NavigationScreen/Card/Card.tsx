import { Box, Inline, Tag, Typography } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import * as styles from './Card.treat'

interface Props {
  title: string
  description: string
  tags: string[]
}

const Card: FC<Props> = ({ title, description, tags }) => {
  return (
    <Box
      className={styles.card}
      background="white"
      border="standard"
      borderRadius="large"
      paddingY={3}
      paddingX={4}
    >
      <Box marginBottom={1}>
        <Typography variant="h3" color="blue400">
          {title}
        </Typography>
      </Box>
      <Box marginBottom={3}>{description}</Box>
      <Inline space={1}>
        {tags.map((tag, index) => (
          <Tag variant="purple" key={index}>
            {tag}
          </Tag>
        ))}
      </Inline>
    </Box>
  )
}

export default Card
