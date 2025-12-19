type VideoEmbedType = 'VIMEO' | 'YOUTUBE'

export const getVideoEmbedProperties = (
  url: string,
): {
  id: string
  embedUrl: string
  termsUrl: string
  type: VideoEmbedType
} | null => {
  let item: URL | null = null
  try {
    item = new URL(url)
  } catch {
    return null
  }
  if (!item) return null

  if (item.hostname.match(/(vimeo.com)/g)) {
    let videoId: string | null = null
    let privacyHash: string | null = null

    if (item.hostname === 'player.vimeo.com') {
      const pathParts = item.pathname.split('/')
      videoId = pathParts[pathParts.length - 1]
      privacyHash = item.searchParams.get('h')
    } else {
      const regExp =
        /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)(?:\/([a-zA-Z0-9]+))?/
      const match = item.href.match(regExp)
      if (match && match[5]) {
        videoId = match[5]
        privacyHash = match[6]
      }
    }

    if (!videoId) return null

    return {
      id: videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1${
        privacyHash ? `&h=${privacyHash}` : ''
      }`,
      termsUrl: 'https://vimeo.com/terms',
      type: 'VIMEO',
    }
  }

  if (item.hostname.match(/(youtube.com|youtu.be)/g)) {
    const regExp =
      /^.*((youtu.be|youtube.com\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = item.href.match(regExp)

    let youtubeId: string | undefined = undefined

    if (match) {
      let id = match[7]
      if (id.startsWith('/')) id = id.slice(1)
      if (id.length === 11) {
        youtubeId = id
      } else {
        const v = item.searchParams.get('v')
        if (v && v.length === 11) {
          youtubeId = v
        }
      }
    }

    if (youtubeId) {
      return {
        id: youtubeId,
        embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`,
        termsUrl: 'https://www.youtube.com/t/terms',
        type: 'YOUTUBE',
      }
    }
  }

  return null
}
