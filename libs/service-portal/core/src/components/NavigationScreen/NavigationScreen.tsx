import React, { FC } from 'react'
import { Typography, Box, Tiles } from '@island.is/island-ui/core'
import * as styles from './NavigationScreen.treat'
import { Link } from 'react-router-dom'
import Card from './Card/Card'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'

export interface NavigationScreenItem {
  name: string | MessageDescriptor
  url: string
  text: string | MessageDescriptor
  tags: MessageDescriptor[]
}

interface Props {
  title: MessageDescriptor
  items: NavigationScreenItem[]
}

export const NavigationScreen: FC<Props> = ({ title, items }) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Box marginBottom={4}>
        <Typography variant="h2" as="h2">
          {formatMessage(title)}
        </Typography>
      </Box>
      <Tiles space="gutter" columns={[1, 2]}>
        {items.map((item, index) => (
          <Link to={item.url} key={index} className={styles.link}>
            <Card title={item.name} description={item.text} tags={item.tags} />
          </Link>
        ))}
      </Tiles>
    </>
  )
}

export default NavigationScreen
