import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './ProfileUnit.css'
import cn from 'classnames'
import { LinkItem, ButtonItem, OtherItem } from './GetUnitContent'
import { ApplicationProfileInfo } from '@island.is/financial-aid/shared/lib'

interface Props {
  info: ApplicationProfileInfo[]
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
          <Box
            key={'profile-' + index}
            className={cn({
              [`${styles.fullWidth} `]: item.fullWidth,
            })}
          >
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

const getContent = (item: ApplicationProfileInfo) => {
  const { content, link, onclick, other } = item
  switch (true) {
    case Boolean(link):
      return LinkItem(link, onclick, content)
    case Boolean(onclick):
      return ButtonItem(onclick, content)
    default:
      return (
        <>
          <Text whiteSpace="breakSpaces">{content}</Text>
          {other && OtherItem(other)}
        </>
      )
  }
}
