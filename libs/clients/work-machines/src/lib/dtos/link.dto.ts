import { LinkDtoWithDisplayTitle } from '../..'

export interface LinkDto {
  href: string
  rel: string
  method: string
  displayTitle?: string
}

export const mapLinkDto = (data: LinkDtoWithDisplayTitle): LinkDto | null => {
  if (!data.href || !data.rel || !data.method) {
    return null
  }

  return {
    href: data.href,
    rel: data.rel,
    method: data.method,
    displayTitle: data.displayTitle ?? undefined,
  }
}
