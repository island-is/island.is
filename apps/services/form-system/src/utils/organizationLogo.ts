import { BadRequestException } from '@nestjs/common'

export const getOrganizationLogoUrl = (value: string): URL => {
  let url: URL
  try {
    url = new URL(value.startsWith('//') ? `https:${value}` : value)
  } catch {
    throw new BadRequestException(
      'Organization logo must be a Contentful image',
    )
  }
  if (url.protocol !== 'https:' || url.hostname !== 'images.ctfassets.net') {
    throw new BadRequestException(
      'Organization logo must be a Contentful image',
    )
  }
  return url
}
