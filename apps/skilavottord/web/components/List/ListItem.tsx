import React, { FC, ReactNode } from 'react'
import { Stack, Text, Box, Link } from '@island.is/island-ui/core'
import * as styles from './ListItem.css'

export interface CompanyProps {
  title: string
  content: Content[]
  buttons?: ReactNode
}

interface Content {
  text: string
  isHighlighted?: boolean
  href?: string
}

export const ListItem: FC<React.PropsWithChildren<CompanyProps>> = ({
  title,
  content,
  buttons,
}: CompanyProps) => {
  const createLink = (link: string) => {
    return link.indexOf('https://') === -1 ? `https://${link}` : link
  }

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
      flexWrap="wrap"
      paddingX={[0, 0, 3, 3]}
      paddingY={[3, 3, 3, 3]}
      className={styles.container}
    >
      <Box paddingBottom={[2, 2, 0, 0]}>
        <Stack space={[2, 2, 1, 1]}>
          <Text variant="h5">{title}</Text>
          {content.map((row, key) => {
            if (!row?.text) return null
            return (
              <Text
                key={key}
                color={row.isHighlighted ? 'blue400' : 'currentColor'}
              >
                {row.href ? (
                  <Link
                    href={createLink(row.href)}
                    color="blue400"
                    underline="small"
                  >
                    {row.text}
                  </Link>
                ) : (
                  row.text
                )}
              </Text>
            )
          })}
        </Stack>
      </Box>
      {buttons}
    </Box>
  )
}

export default ListItem
