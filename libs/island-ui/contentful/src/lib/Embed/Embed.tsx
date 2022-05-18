import React from 'react'
import * as styles from './Embed.css'

export interface EmbedProps {
  title: string
  url: string
  frameHeight: number
}

export const Embed = ({ title, url, frameHeight }: EmbedProps) => {
  return (
    <iframe
      className={`${styles.container} ${frameHeight ? '' : styles.fullHeight}`}
      src={url}
      title={title}
      width="100%"
      height={frameHeight}
    />
  )
}

export default Embed
