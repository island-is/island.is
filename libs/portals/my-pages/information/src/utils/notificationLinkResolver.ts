import { NotificationLink } from '@island.is/api/schema'
import { ServicePortalPaths } from '@island.is/portals/my-pages/core'

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

export const COAT_OF_ARMS =
  'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'
