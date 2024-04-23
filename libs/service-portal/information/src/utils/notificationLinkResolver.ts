import { NotificationLink } from '@island.is/api/schema'
import { ServicePortalPaths } from '@island.is/service-portal/core'

function extractPath(url: string): string {
  try {
    const source = 'island.is'
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url
    }

    const parsedUrl = new URL(url)
    const domain = parsedUrl.hostname
    const path = parsedUrl.pathname

    if (domain === source) {
      return path
    } else {
      return url
    }
  } catch (e) {
    return url
  }
}

export const resolveLink = (link: NotificationLink): string => {
  const url = extractPath(link.url ?? '')
  const base = ServicePortalPaths.Base

  if (url.startsWith('/')) {
    if (url.startsWith(base)) {
      return url.substring(base.length)
    }
    return `${window.location.origin}${url}`
  }
  return link.url ?? ''
}
