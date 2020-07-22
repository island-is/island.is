/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import cn from 'classnames'
import { Typography, Stack } from '@island.is/island-ui/core'
import * as styles from './BulletList.treat'
import BigLink from './BigLink'

export interface BulletListProps {
  items: BulletListItemProps[]
}

const BulletList: FC<BulletListProps> = ({ items }) => {
  let i = 1
  items = items.map((item) => ({ ...item, index: item.icon ? 0 : i++ }))

  return (
    <Stack space={3}>
      {items.map((item, i) => (
        <BulletListItem key={i} {...item} />
      ))}
    </Stack>
  )
}

interface BulletListItemProps {
  title: string
  body: string
  link?: string
  href?: string
  icon?: string
  index?: number
  size?: 'small' | 'large'
  color?: 'blue' | 'red'
}

const BulletListItem: FC<BulletListItemProps> = ({
  title,
  body,
  link,
  href,
  icon,
  index,
  size = 'large',
  color = 'blue',
}) => {
  const titleTag = size === 'large' ? 'h3' : 'h4'

  return (
    <div className={styles.row}>
      <div className={styles.leftCol}>
        <div
          className={cn(styles.circle, {
            [styles.circleRed]: color === 'red',
            [styles.circleSmall]: size === 'small',
          })}
        >
          <span className={styles.icon}>
            {icon ? (
              <img src={icon} alt="" />
            ) : (
              <Typography variant="h4" as="span">
                {index}
              </Typography>
            )}
          </span>
        </div>
      </div>
      <Stack space={1}>
        <Typography variant={titleTag} as={titleTag}>
          {title}
        </Typography>
        <Typography variant="p" as="p">
          {body}
        </Typography>
        {link && href && <BigLink href={href}>{link}</BigLink>}
      </Stack>
    </div>
  )
}

export default BulletList
