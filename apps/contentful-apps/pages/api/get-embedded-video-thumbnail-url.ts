import type { NextApiRequest, NextApiResponse } from 'next'

import { getVideoEmbedProperties } from '@island.is/shared/utils'

export interface ResponseData {
  thumbnailUrl: string
}

interface VimeoApiResponse {
  type: 'video'
  version: string
  provider_name: 'Vimeo'
  provider_url: 'https://vimeo.com/'
  title: string
  author_name: string
  author_url: string
  account_type: string
  html: string
  width: number
  height: number
  duration: number
  description: string
  thumbnail_url: string
  thumbnail_width: number
  thumbnail_height: number
  thumbnail_url_with_play_button: string
  upload_date: string
  video_id: number
  uri: string
}

const fetchVimeoVideoThumbnailUrl = async (vimeoUrl: string) => {
  const response = await fetch(
    `https://vimeo.com/api/oembed.json?url=${vimeoUrl}&width=960`,
  )
  const data: VimeoApiResponse = await response.json()
  return data.thumbnail_url
}

const createYoutubeVideoThumbnailUrl = async (youtubeVideoId: string) => {
  const url = `https://i.ytimg.com/vi/${youtubeVideoId}/maxresdefault.jpg`
  const response = await fetch(url)

  // If there exists a "maxres" thumbnail so we'll use that
  if (response.ok) {
    return url
  }

  // Fallback to using the "hqdefault" thumbnail in case a "maxres" thumbnail doesn't exist
  return `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`
}

const getVideoImageThumbnailUrl = async (videoUrl: string) => {
  const embedProperties = getVideoEmbedProperties(videoUrl)
  if (!embedProperties) return ''
  if (embedProperties.type === 'YOUTUBE')
    return createYoutubeVideoThumbnailUrl(embedProperties.id)
  return fetchVimeoVideoThumbnailUrl(videoUrl)
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const videoUrl = req.query.videoUrl

  if (!videoUrl || typeof videoUrl !== 'string') {
    res.status(400).json({
      thumbnailUrl: '',
    })
    return
  }

  res.json({
    thumbnailUrl: await getVideoImageThumbnailUrl(videoUrl),
  })
}

export default handler
