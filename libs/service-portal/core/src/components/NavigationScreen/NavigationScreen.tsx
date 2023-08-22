import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { Text, Box, Tiles, Inline, Tag } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import Card from './Card/Card'
import { MessageDescriptor } from 'react-intl'
import * as styles from './NavigationScreen.css'

export interface NavigationScreenItem {
  name: string | MessageDescriptor
  url: string
  text: string | MessageDescriptor
  tags: MessageDescriptor[]
  disabled?: boolean
}

interface Props {
  title: MessageDescriptor
  inProgress?: boolean
  items: NavigationScreenItem[]
}

export const NavigationScreen: FC<React.PropsWithChildren<Props>> = ({
  title,
  items,
  inProgress,
}) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginBottom={4}>
        <Inline space={1}>
          <Text variant="h2" as="h2">
            {formatMessage(title)}
          </Text>
          {inProgress && (
            <Tag variant="blue" outlined>
              {formatMessage(m.inProgress)}
            </Tag>
          )}
        </Inline>
      </Box>
      <Tiles space="gutter" columns={[1, 2]}>
        {items.map((item, index) =>
          item.disabled ? (
            <Card
              title={item.name}
              description={item.text}
              tags={item.tags}
              disabled={item.disabled}
              key={index}
            />
          ) : (
            <Link to={item.url} key={index} className={styles.link}>
              <Card
                title={item.name}
                description={item.text}
                tags={item.tags}
                disabled={item.disabled}
              />
            </Link>
          ),
        )}
      </Tiles>
    </>
  )
}

export default NavigationScreen
