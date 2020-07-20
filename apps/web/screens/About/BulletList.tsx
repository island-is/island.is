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
  return (
    <Stack space={3}>
      {items.map((item, i) => (
        <BulletListItem key={i} {...item} />
      ))}
    </Stack>
  )
}

// title="Aðgengi fyrir alla"
// body="Við leggjum áherslu á aðgengilega opinbera þjónustu sem byggist á þörfum notenda. Við viljum bjóða borgurum einfalda þjónustu í samskiptum við hið opinbera og hverfa frá því fyrirkomulagi að notendur þurfi að sækja þjónustu til margra mismunandi stofnana."
// link="Ávinningur fyrir stofnanir"
// href="/"
// icon=""

interface BulletListItemProps {
  title: string
  body: string
  link?: string
  href?: string
  icon?: string
  size?: 'small' | 'large'
  color?: 'blue' | 'red'
}

const BulletListItem: FC<BulletListItemProps> = ({
  title,
  body,
  link,
  href,
  icon,
  size = 'large',
  color = 'blue',
}) => {
  // if (typeof icon === 'string') {
  //   icon = (
  //     <Typography
  //       variant="h4"
  //       as="span"
  //       color={color === 'blue' ? 'blue400' : 'red400'}
  //     >
  //       {icon}
  //     </Typography>
  //   )
  // }

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
          <img src={icon} alt="" className={styles.icon} />
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
