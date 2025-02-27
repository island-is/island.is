import React from 'react'

import {
  Box,
  Inline,
  LinkV2,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { BackgroundImage } from '@island.is/web/components'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { shortenText } from '@island.is/web/utils/shortenText'

import * as styles from './DigitalIcelandNewsCard.css'

interface ItemProps {
  imageSrc: string
  date: string
  title: string
  description?: string | null
  tags: string[]
  href: string
}

export const DigitalIcelandNewsCard = (item: ItemProps) => {
  const { format } = useDateUtils()

  return (
    <LinkV2 href={item.href} className={styles.itemContainer}>
      <Box
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        rowGap={[2, 2, 2, 5]}
        justifyContent="spaceBetween"
        height="full"
      >
        <Stack space={2}>
          <BackgroundImage
            positionX="left"
            backgroundSize="cover"
            image={{ url: item.imageSrc }}
            ratio="396:210"
            boxProps={{
              alignItems: 'center',
              width: 'full',
              display: 'inlineFlex',
              overflow: 'hidden',
              borderRadius: 'large',
            }}
          />

          <Stack space={1}>
            {item.date && (
              <Text variant="h5" color="purple400">
                {format(new Date(item.date), 'do MMMM yyyy')}
              </Text>
            )}
            <Text variant="h3">{item.title}</Text>
            <Text variant="medium">
              {shortenText(item.description ?? '', 80)}
            </Text>
          </Stack>
        </Stack>
        <Box>
          <Inline space={1}>
            {item.tags.map((tag) => (
              <Tag key={tag} disabled>
                {tag}
              </Tag>
            ))}
          </Inline>
        </Box>
      </Box>
    </LinkV2>
  )
}
