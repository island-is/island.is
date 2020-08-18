import React, { FC } from 'react'

import * as styles from './EmbeddedVideo.treat'

export interface EmbeddedVideoProps {
  title?: string
  url: string
}

const EmbeddedVideo: FC<EmbeddedVideoProps> = ({ title, url }) => {
  let embedUrl = null

  if (url.includes('vimeo.com')) {
    const match = /vimeo.*\/(\d+)/i.exec(url)

    if (match) {
      embedUrl = `https://player.vimeo.com/video/${match[1]}`
    }
  }

  if (url.match(/(youtube.com|youtu.be)/g)) {
    const regExp = /^.*((youtu.be|youtube.com\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)

    const youtubeId = match && match[7].length === 11 ? match[7] : false

    if (youtubeId) {
      embedUrl = `https://www.youtube.com/embed/${youtubeId}`
    }
  }

  if (!embedUrl) {
    return null
  }

  return (
    <span className={styles.container}>
      <iframe
        title={title}
        src={embedUrl}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        allowFullScreen
        className={styles.iframe}
      ></iframe>
    </span>
  )
}

export default EmbeddedVideo
