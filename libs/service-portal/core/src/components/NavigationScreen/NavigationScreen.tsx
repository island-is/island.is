import React, { FC } from 'react'
import { Typography, Box, Tiles } from '@island.is/island-ui/core'
import * as styles from './NavigationScreen.treat'
import { Link } from 'react-router-dom'
import Card from './Card/Card'

export interface NavigationScreenItem {
  name: string
  url: string
  text: string
  tags: string[]
}

interface Props {
  items: NavigationScreenItem[]
}

export const NavigationScreen: FC<Props> = ({ items }) => {
  return (
    <>
      <Box marginBottom={4}>
        <Typography variant="h2" as="h2">
          Stillingar
        </Typography>
      </Box>
      <Tiles space="gutter" columns={[1, 2]}>
        {items.map((item, index) => (
          <Link to={item.url} key={index} className={styles.link}>
            <Card
              title={item.name}
              description={item.text}
              tags={item.tags.map((x) => ({ title: x }))}
            />
          </Link>
        ))}
      </Tiles>
    </>
  )
}

export default NavigationScreen
