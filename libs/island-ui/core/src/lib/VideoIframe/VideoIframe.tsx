import React from 'react'
import * as styles from './VideoIframe.treat'

export interface VideoIframeProps {
  src: string
  title: string
}

export const VideoIframe = ({ src, title = 'video' }: VideoIframeProps) => {
  return (
    <div className={styles.container}>
      <iframe
        title={title}
        scrolling="no"
        width="560"
        height="315"
        src={src}
        frameBorder="0"
        allowFullScreen
        className={styles.iframe}
      />
    </div>
  )
}

export default VideoIframe
