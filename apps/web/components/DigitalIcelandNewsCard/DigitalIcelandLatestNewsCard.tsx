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

import * as styles from './DigitalIcelandLatestNewsCard.css'

interface ItemProps {
  imageSrc: string
  date: string
  title: string
  description?: string | null
  tags: string[]
  href: string
}

export const DigitalIcelandLatestNewsCard = (item: ItemProps) => {
  const { format } = useDateUtils()

  return (
    <LinkV2 href={item.href} className={styles.itemContainer}>
      <Stack space={2}>
        <BackgroundImage
          backgroundSize="cover"
          image={{ url: item.imageSrc }}
          ratio="64:40"
          boxProps={{
            alignItems: 'center',
            width: 'full',
            display: 'inlineFlex',
            overflow: 'hidden',
          }}
        />
        <Box paddingLeft={2} paddingRight={2} paddingBottom={3}>
          <Stack space={1}>
            {item.date && (
              <Text variant="eyebrow" color="purple400">
                {format(new Date(item.date), 'do MMMM yyyy')}
              </Text>
            )}
            <Text variant="h3">{item.title}</Text>
            <Text variant="default">
              {shortenText(item.description ?? '', 80)}
            </Text>
          </Stack>
        </Box>
      </Stack>
      <Box paddingLeft={2} paddingRight={2}>
        <Inline space={1}>
          {item.tags.map((tag) => (
            <Tag key={tag} disabled outlined>
              {tag}
            </Tag>
          ))}
        </Inline>
      </Box>
    </LinkV2>
  )
}
