import React from 'react'
import { Text, Box, Link } from '@island.is/island-ui/core'

import * as styles from './ProfileUnit.css'
import cn from 'classnames'

const LinkItem = (link?: string, onclick?: () => void, content?: string) => {
  return (
    link && (
      <Link href={link} color="blue400" onClick={onclick}>
        {content}
      </Link>
    )
  )
}

const ButtonItem = (onclick?: () => void, content?: string) => {
  return (
    onclick && (
      <button onClick={onclick} className={styles.button}>
        {content}
      </button>
    )
  )
}

const OtherItem = (other?: string) => {
  return (
    other && (
      <Box background="blue100" borderRadius="large" padding={2} marginTop={1}>
        <Text variant="small">
          „<em>{other}</em>“
        </Text>
      </Box>
    )
  )
}

interface Props {
  info: {
    title: string
    content?: string
    link?: string
    onclick?: () => void
    other?: string
  }[]
  className?: string
}

const Unit = ({ info, className }: Props) => {
  return (
    <div
      className={cn({
        [`${styles.container} hideScrollBar`]: true,
        [`${className}`]: true,
      })}
    >
      {info.map((item, index) => {
        const content = getContent(item)

        return (
          <Box key={'profile-' + index}>
            <Text variant="eyebrow" marginBottom={1}>
              {item.title}
            </Text>

            {content}
          </Box>
        )
      })}
    </div>
  )
}

export default Unit

const getContent = (item: {
  title: string
  content?: string
  link?: string
  onclick?: () => void
  other?: string
}) => {
  const { content, link, onclick, other } = item
  switch (true) {
    case Boolean(link):
      return LinkItem(link, onclick, content)
    case Boolean(onclick):
      return ButtonItem(onclick, content)
    default:
      return (
        <>
          <Text>{content}</Text>
          {other && OtherItem(other)}
        </>
      )
  }
}
