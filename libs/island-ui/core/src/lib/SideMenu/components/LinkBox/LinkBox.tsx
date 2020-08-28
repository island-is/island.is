import React from 'react'
import * as styles from './LinkBox.treat'
import { Typography } from '../../../Typography/Typography'

export const LinkBox = ({ title, url, icon }) => (
  <li className={styles.root}>
    <a href={url}>
      <div className={styles.linkBox}>
        <div className={styles.iconWrap}>O</div>
        <Typography variant="eyebrow" color="blue400">
          {title}
        </Typography>
      </div>
    </a>
  </li>
)
