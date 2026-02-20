import React from 'react'

import {
  Box,
  FocusableBox,
  Icon,
  IconMapIcon,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'

export type StudyDetailLine = {
  icon: IconMapIcon
  text: string
}

export type SecondarySchoolStudyCardProps = {
  id: string
  schoolName: string
  schoolIcon?: React.ReactElement
  title: string
  description?: string
  detailLines?: StudyDetailLine[]
  href: string
  onCardClick?: () => void
  size?: 'medium' | 'large'
  colorScheme?: 'blue' | 'purple'
}

const colorSchemes = {
  blue: {
    textColor: 'blue400',
    borderColor: 'blue200',
    iconColor: 'blue400',
  },
  purple: {
    textColor: 'purple400',
    borderColor: 'purple200',
    iconColor: 'purple400',
  },
} as const

export const SecondarySchoolStudyCard = ({
  schoolName,
  schoolIcon,
  title,
  description,
  detailLines = [],
  href,
  onCardClick,
  size = 'medium',
  colorScheme = 'blue',
}: SecondarySchoolStudyCardProps) => {
  const { borderColor, textColor, iconColor } = colorSchemes[colorScheme]
  const isLarge = size === 'large'

  return (
    <Box height="full">
      <FocusableBox
        component={LinkV2}
        href={href}
        onClick={onCardClick}
        borderRadius="large"
        color={'blue'}
        borderColor={borderColor}
        borderWidth="standard"
        background="white"
        height="full"
        display="flex"
        flexDirection="column"
        position="relative"
      >
        <Box
          paddingY={3}
          paddingX={4}
          display="flex"
          flexDirection={isLarge ? 'row' : 'column'}
          justifyContent="spaceBetween"
          height="full"
        >
          {/* Left side / Top section */}
          <Box
            display="flex"
            flexDirection="column"
            style={isLarge ? { flex: '2' } : undefined}
            paddingRight={isLarge ? 4 : 0}
          >
            {/* School name with icon */}
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingBottom={2}
            >
              {schoolIcon && (
                <Box paddingRight={1} display="flex" alignItems="center">
                  {schoolIcon}
                </Box>
              )}
              <Text variant="eyebrow" fontWeight="light" color="dark400">
                {schoolName}
              </Text>
            </Box>

            {/* Title */}
            <Box paddingBottom={description ? 2 : 3}>
              <Text
                as="h3"
                variant={isLarge ? 'h3' : 'h4'}
                color={textColor}
                truncate={false}
              >
                {title}
              </Text>
            </Box>

            {/* Description - only shown in large view */}
            {isLarge && description && (
              <Box paddingBottom={3}>
                <Text variant="default">{description}</Text>
              </Box>
            )}
          </Box>

          {/* Right side / Bottom section - Detail lines */}
          {detailLines.length > 0 && (
            <Box
              display="flex"
              flexDirection="column"
              style={isLarge ? { flex: '1' } : undefined}
              paddingY={isLarge ? 4 : 0}
              rowGap={2}
            >
              {detailLines.map((line, index) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Box paddingRight={1} display="flex" alignItems="center">
                    <Icon
                      icon={line.icon}
                      color={iconColor}
                      size="small"
                      type="outline"
                    />
                  </Box>
                  <Text variant="small" color="dark400">
                    {line.text}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </FocusableBox>
    </Box>
  )
}
