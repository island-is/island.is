type VideoEmbedType = 'VIMEO' | 'YOUTUBE'

export const getVideoEmbedProperties = (
  url: string,
): {
  id: string
  embedUrl: string
  termsUrl: string
  type: VideoEmbedType
} | null => {
  const item = new URL(url)

  if (item.hostname.match(/(vimeo.com)/g)) {
    const match = /vimeo.*\/(\d+)/i.exec(item.href)

    if (match) {
      const vimeoId = match[1]
      return {
        id: vimeoId,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
        termsUrl: 'https://vimeo.com/terms',
        type: 'VIMEO',
      }
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
