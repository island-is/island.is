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
  mini?: boolean
  titleAs?: 'h2'
}

export const DigitalIcelandNewsCard = (item: ItemProps) => {
  const { format } = useDateUtils()

  const formattedDate = item.date && format(new Date(item.date), 'do MMMM yyyy')

  if (item.mini) {
    return (
      <Box marginBottom={3}>
        <LinkV2
          href={item.href}
          className={`${styles.itemWrapper} ${styles.itemWrapperMini}`}
        >
          <Box display="flex" flexGrow={1} width="full" height="full">
            <Stack space={2}>
              <Stack space={1}>
                {!!formattedDate && (
                  <Text variant="eyebrow" color="purple400">
                    {formattedDate}
                  </Text>
                )}
                <Text variant="h3">{item.title}</Text>
              </Stack>
              {item.tags.length > 0 && (
                <Inline space={1}>
                  {item.tags.map((tag) => (
                    <Tag key={tag} disabled outlined>
                      {tag}
                    </Tag>
                  ))}
                </Inline>
              )}
            </Stack>
          </Box>
        </LinkV2>
      </Box>
    )
  }

  return (
    <Box marginBottom={3}>
      <LinkV2 href={item.href} className={styles.itemWrapper}>
        <Box className={styles.contentWrapper}>
          <Box className={styles.contentMobile}>
            <Stack space={2}>
              <Stack space={1}>
                {!!formattedDate && (
                  <Text variant="eyebrow" color="purple400">
                    {formattedDate}
                  </Text>
                )}
                <Text variant="h3" as={item.titleAs}>
                  {item.title}
                </Text>
                <Text variant="default">
                  {shortenText(item.description ?? '', 80)}
                </Text>
              </Stack>
              {item.tags.length > 0 && (
                <Inline space={1}>
                  {item.tags.map((tag) => (
                    <Tag key={tag} disabled outlined>
                      {tag}
                    </Tag>
                  ))}
                </Inline>
              )}
            </Stack>
          </Box>
          <Box className={styles.image}>
            <BackgroundImage
              backgroundSize="cover"
              image={{ url: item.imageSrc }}
              ratio="200:122"
              boxProps={{
                alignItems: 'center',
                width: 'full',
                display: 'inlineFlex',
                overflow: 'hidden',
              }}
            />
          </Box>
        </Box>
      </LinkV2>
    </Box>
  )
}
