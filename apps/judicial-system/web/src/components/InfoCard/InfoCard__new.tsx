import cn from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'

import * as styles from './InfoCard.css'

interface Section {
  id: string // Used as a key
  items: Item[]
  columns?: number
}

interface Item {
  id: string // Used as a key
  title: string
  values: string[]
}

interface Props {
  sections: Section[]
}

export const defendantsSection: Section = {
  id: 'defendants-section',
  items: [
    {
      id: 'defendants-item',
      title: 'Varnaraðilar',
      values: ['sad', 'asd'],
    },
  ],
}

const InfoCardNew: React.FC<Props> = (props) => {
  const { sections } = props

  return (
    <Box className={styles.infoCardContainerNew} paddingX={[2, 2, 3, 3]}>
      {sections.map((section, index) => {
        return (
          <Box
            className={cn(
              index < sections.length - 1
                ? styles.infoCardTitleContainer
                : null,
              {
                [styles.twoCols]: section.columns === 2,
              },
            )}
            paddingY={[2, 2, 3, 3]}
            key={section.id}
          >
            {section.items.map((item) => (
              <Box marginBottom={1} key={item.id}>
                <Text variant="h4" as="h4">
                  {item.title}
                </Text>
                {item.values.map((value, index) => (
                  <Text key={`${value}-${index}`}>{value}</Text>
                ))}
              </Box>
            ))}
          </Box>
        )
      })}
    </Box>
  )
}

export default InfoCardNew
