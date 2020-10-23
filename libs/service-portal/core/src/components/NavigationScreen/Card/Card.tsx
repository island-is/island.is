import { Box, Inline, Tag, Typography } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import cn from 'classnames'
import * as styles from './Card.treat'

interface Props {
  title: string | MessageDescriptor
  description: string | MessageDescriptor
  tags: MessageDescriptor[]
  disabled?: boolean
}

const Card: FC<Props> = ({ title, description, tags, disabled }) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      className={styles.card}
      background="white"
      border="standard"
      borderRadius="large"
      paddingY={3}
      paddingX={4}
    >
      <div
        className={cn({
          [styles.disabled]: disabled,
        })}
      >
        <Box marginBottom={1}>
          <Typography variant="h3" color="blue400">
            {formatMessage(title)}
          </Typography>
        </Box>
        <Box marginBottom={3}>{formatMessage(description)}</Box>
        <Inline space={1}>
          {tags.map((tag, index) => (
            <Tag variant="purple" key={index}>
              {formatMessage(tag)}
            </Tag>
          ))}
        </Inline>
      </div>
    </Box>
  )
}

export default Card
