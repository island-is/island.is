import React from 'react'
import * as styles from './LinkBox.treat'
import { Typography, Icon } from '@island.is/island-ui/core'

export const LinkBox = ({ title, url, icon }) => {
  const firstLetter = title[0]

  return (
    <li className={styles.root}>
      <a href={url} className={styles.anchorWrap}>
        <div className={styles.linkBox}>
          <div className={styles.hoverIcon}>
            <Icon type="external" height={16} />
          </div>
          <div className={styles.iconWrap}>
            {icon || <div className={styles.letterIcon}>{firstLetter}</div>}
          </div>
          <Typography variant="eyebrow" color="blue400">
            {title}
          </Typography>
        </div>
      </a>
    </li>
  )
}
