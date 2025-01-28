import React from 'react'

import {
  Box,
  FocusableBox,
  Inline,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { BackgroundImage } from '@island.is/web/components'
import { Image } from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import * as styles from './Item.css'

type Tag = {
  label: string
  href?: string
}

type ItemProps = {
  heading: string
  date: string
  text: string
  href: string
  image?: Partial<Image>
  tags?: Tag[]
  colorVariant?: 'default' | 'blue'
}

export const Item = ({
  heading,
  date,
  text,
  href,
  image,
  colorVariant = 'default',
  tags = [],
}: ItemProps) => {
  const hasTags = Array.isArray(tags) && tags.length > 0
  const { format } = useDateUtils()

  const formattedDate = date ? format(new Date(date), 'do MMMM yyyy') : ''

  return (
    <FocusableBox
      href={href}
      display="flex"
      flexDirection="column"
      paddingY={[2, 2, 3]}
      paddingX={[2, 2, 4]}
      background="white"
      borderColor="blue200"
      borderRadius="large"
      borderWidth="standard"
      height="full"
      color="blue"
    >
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Box flexGrow={1} height="full">
            <Stack space={2}>
              <Text
                color={colorVariant === 'blue' ? 'blue400' : undefined}
                as="span"
                variant="eyebrow"
              >
                {formattedDate}
              </Text>
              <Text
                color={colorVariant === 'blue' ? 'blue600' : undefined}
                as="h3"
                variant="h2"
                title={heading}
              >
                {heading}
              </Text>
              <Text color={colorVariant === 'blue' ? 'blue600' : undefined}>
                {text}
              </Text>
            </Stack>
          </Box>
          {hasTags && (
            <Box paddingTop={2} flexGrow={0}>
              <Inline space={['smallGutter', 'smallGutter', 'gutter']}>
                {tags.map(({ label }) => (
                  <Tag key={label} variant="blue" truncate={true} disabled>
                    {label}
                  </Tag>
                ))}
              </Inline>
            </Box>
          )}
        </div>
        <Box
          marginLeft={[0, 0, 0, 0, 2]}
          marginBottom={[2, 2, 2, 2, 0]}
          className={styles.image}
        >
          <BackgroundImage
            width={600}
            quality={60}
            positionX="left"
            backgroundSize="cover"
            ratio="1:1"
            thumbnailColor="blue100"
            image={{
              url: image?.url || '',
              title: image?.title || '',
            }}
          />
        </Box>
      </div>
    </FocusableBox>
  )
}

export default Item
