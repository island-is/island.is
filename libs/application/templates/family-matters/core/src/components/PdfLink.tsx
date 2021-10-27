import React from 'react'
import { Icon, Link } from '@island.is/island-ui/core'
import * as styles from './PdfLink.css'

interface Props {
  url: string
  label: string
}

const PdfLink = ({ url, label }: Props) => {
  return (
    <Link
      className={styles.link}
      href={url}
      color="blue400"
      underline="normal"
      underlineVisibility="always"
    >
      <span className={styles.linkContent}>
        {label}
        <Icon
          className={styles.icon}
          color="currentColor"
          icon="open"
          size="medium"
          type="outline"
        />
      </span>
    </Link>
  )
}

export default PdfLink
