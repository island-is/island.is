import React from 'react'
import { Box } from '../Box/Box'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Inline } from '../Inline/Inline'
import { Tag } from '../Tag/Tag'
import { Text, TextProps } from '../Text/Text'

type Tag = {
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

type CategoryCardProps = {
  heading: string
  headingAs?: TextProps['as']
  headingVariant?: TextProps['variant']
  text: string
  tags?: Tag[]
  href?: string
  colorScheme?: 'blue' | 'purple' | 'red'
  truncateHeading?: TextProps['truncate']
}

const colorSchemes = {
  blue: {
    textColor: 'blue400',
    borderColor: 'blue200',
    tagVariant: 'blue',
  },
  purple: {
    textColor: 'purple400',
    borderColor: 'purple200',
    tagVariant: 'purple',
  },
  red: {
    textColor: 'red600',
    borderColor: 'red200',
    tagVariant: 'red',
  },
} as const

export const CategoryCard = ({
  heading,
  headingAs = 'h3',
  headingVariant = 'h3',
  text,
  href = '/',
  tags = [],
  colorScheme = 'blue',
  truncateHeading = false,
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
      borderRadius="large"
      borderColor={borderColor}
      borderWidth="standard"
      height="full"
      background="white"
      color={colorScheme}
    >
      <Text
        as={headingAs}
        variant={headingVariant}
        color={textColor}
        truncate={truncateHeading}
        title={heading}
      >
        {heading}
      </Text>
      <Text paddingTop={1}>{text}</Text>
      {hasTags && (
        <Box paddingTop={3}>
          <Inline space={['smallGutter', 'smallGutter', 'gutter']}>
            {tags.map((tag) => (
              <Tag
                key={tag.label}
                disabled={tag.disabled}
                outlined={!tag.href}
                variant={tagVariant}
                href={tag.href}
                onClick={tag.onClick}
                truncate={true}
              >
                {tag.label}
              </Tag>
            ))}
          </Inline>
        </Box>
      )}
    </FocusableBox>
  )
}
