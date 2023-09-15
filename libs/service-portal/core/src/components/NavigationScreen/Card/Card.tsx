import { Box, Inline, Tag, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import * as styles from './Card.css'
import WipCard from './WipCard'

interface Props {
  title: string | MessageDescriptor
  description: string | MessageDescriptor
  tags: MessageDescriptor[]
  disabled?: boolean
}

const Card: FC<React.PropsWithChildren<Props>> = ({
  title,
  description,
  tags,
  disabled,
}) => {
  const { formatMessage } = useLocale()

  return disabled ? (
    <WipCard label={formatMessage(m.inProgress)} />
  ) : (
    <Box
      position="relative"
      className={styles.card}
      background="white"
      border="standard"
      borderRadius="large"
      paddingY={3}
      paddingX={4}
    >
      <Box marginBottom={1}>
        <Text variant="h3" as="h3" color="blue400">
          {formatMessage(title)}
        </Text>
      </Box>
      <Box marginBottom={3}>{formatMessage(description)}</Box>
      <Inline space={1}>
        {tags.map((tag, index) => (
          <Tag variant="purple" key={index} outlined>
            {formatMessage(tag)}
          </Tag>
        ))}
      </Inline>
    </Box>
  )
}

export default Card
