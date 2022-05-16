import React from 'react'
import * as styles from './Embed.css'

export interface EmbedProps {
  title: string
  url: string
  height: number
}

export const Embed = ({ title, url, height }: EmbedProps) => {
  return (
    <iframe
      className={styles.container}
      src={url}
      width="100%"
      height={height}
      title={title}
    />
  )
}

export default Embed
