/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import cn from 'classnames'
import NextLink from 'next/link'
import { Box, Inline, Logo, Text, Button } from '@island.is/island-ui/core'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import * as styles from './NewLinks.css'

type Item = {
  date: Date
  text: string
  href: string
}

interface NewLinksProps {
  heading?: string
  items?: Item[]
  showMoreButton?: boolean
  seeMoreText?: string
}

export const NewLinks = ({
  items = [],
  heading = '',
  showMoreButton = false,
  seeMoreText = '',
}: NewLinksProps) => {
  const { format } = useDateUtils()

  return (
    <Box
      paddingX={[3, 3, 4]}
      paddingY={[4, 4, 5]}
      background="purple100"
      borderRadius="large"
      className={styles.container}
    >
      <Box marginRight={[0, 0, 3]} className={styles.logo}>
        <Inline space={1} alignY="center" flexWrap="nowrap">
          <Logo width={16} height={16} iconOnly />
          <Text variant="h5">{heading}</Text>
        </Inline>
      </Box>
      <div className={styles.content}>
        <div className={styles.truncate}>
          {items.map(({ date, text, href }, index) => (
            <NextLink key={index} href={href} className={styles.link}>
              <strong>{format(new Date(date), 'dd/MM')}</strong> {text}
            </NextLink>
          ))}
        </div>
      </div>
      <Box
        className={cn(styles.button, {
          [styles.buttonVisible]: showMoreButton,
        })}
      >
        <Button
          variant="text"
          as="span"
          icon="arrowForward"
          size="small"
          nowrap
        >
          {seeMoreText}
        </Button>
      </Box>
    </Box>
  )
}

export default NewLinks
