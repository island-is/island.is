import React from 'react'
import { Box } from '../Box/Box'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Inline } from '../Inline/Inline'
import { Tag } from '../Tag/Tag'
import { Text } from '../Text/Text'

type Tag = {
  label: string
  href?: string
  onClick?: () => void
}

type CategoryCardProps = {
  heading: string
  text: string
  tags?: Tag[]
  href?: string
  colorScheme?: 'blue' | 'red'
}

const colorSchemes = {
  blue: {
    textColor: 'blue400',
    borderColor: 'purple200',
    tagVariant: 'blue',
  },
  red: {
    textColor: 'red600',
    borderColor: 'red200',
    tagVariant: 'red',
  },
} as const

export const CategoryCard = ({
  heading,
  text,
  href = '/',
  tags = [],
  colorScheme = 'blue',
}: CategoryCardProps) => {
  const hasTags = Array.isArray(tags) && tags.length > 0
  const { borderColor, textColor, tagVariant } = colorSchemes[colorScheme]

  return (
    <FocusableBox
      href={href}
      display="flex"
      flexDirection="column"
      paddingY={3}
      paddingX={4}
      borderRadius="standard"
      borderColor={borderColor}
      borderWidth="standard"
      height="full"
    >
      <Text variant="h3" color={textColor}>
        {heading}
      </Text>
      <Text paddingTop={1}>{text}</Text>
      {hasTags && (
        <Box paddingTop={3}>
          <Inline space={['smallGutter', 'smallGutter', 'gutter']}>
            {tags.map((tag) => (
              <Tag variant={tagVariant} href={tag.href} onClick={tag.onClick}>
                {tag.label}
              </Tag>
            ))}
          </Inline>
        </Box>
      )}
    </FocusableBox>
  )
}
