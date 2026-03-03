import { FC, ReactNode } from 'react'
import cn from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'

import BlueBox from '../BlueBox/BlueBox'
import { grid } from '../../utils/styles/recipes.css'
import * as styles from './InfoCard.css'

interface Section {
  id: string // Used as a key
  items: Item[]
  columns?: number
}

export interface Item {
  id: string // Used as a key
  title: string | ReactNode
  values: string[] | ReactNode[]
}

interface Props {
  sections: Section[]
}

const InfoCard: FC<Props> = (props) => {
  const { sections } = props

  return (
    <BlueBox className={grid({ gap: 3 })}>
      {sections.map((section, index) => (
        <Box
          className={cn(styles.grid, {
            [styles.twoCols]: section.columns === 2,
            [styles.renderDividerFull]: index !== sections.length - 1,
          })}
          key={section.id}
        >
          {section.items.map((item) => (
            <Box key={item.id}>
              {typeof item.title === 'string' ? (
                <Text variant="h4" as="h4">
                  {item.title}
                </Text>
              ) : (
                item.title
              )}
              {item.values.map((value, index) =>
                typeof value === 'string' ? (
                  <Text key={`${value}-${index}`}>{value}</Text>
                ) : (
                  <Box key={`${value}-${index}`}>{value}</Box>
                ),
              )}
            </Box>
          ))}
        </Box>
      ))}
    </BlueBox>
  )
}

export default InfoCard
