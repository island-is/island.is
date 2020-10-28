import { ServicePortalFooterContent } from '@island.is/service-portal/graphql'

export const convertUrl = (url: string) =>
  url.startsWith('/') ? `https://island.is${url}` : url

export const getFooterProps = (data: ServicePortalFooterContent) => ({
  hideLanguageSwith: true,
  topLinks:
    data.upper?.links.map((link) => ({
      title: link.text,
      href: convertUrl(link.url),
    })) || [],
  topLinksContact: [
    {
      title: 'Hafa samband',
      href: 'https://island.is/um-island-is/hafa-samband',
    },
    {
      title: 'Sími: 426 5500',
      href: 'tel: +3544265500',
    },
  ],
  showMiddleLinks: true,
  middleLinksTitle: 'Þjónustuflokkar',
  middleLinks:
    data.middle?.links.map((link) => ({
      title: link.text,
      href: convertUrl(link.url),
    })) || [],
  showTagLinks: true,
  tagLinksTitle: 'Flýtileiðir',
  tagLinks:
    data.tags?.links.map((link) => ({
      title: link.text,
      href: convertUrl(link.url),
    })) || [],
  bottomLinksTitle: 'Aðrir opinberir vefir',
  bottomLinks:
    data.lower?.links.map((link) => ({
      title: link.text,
      href: convertUrl(link.url),
    })) || [],
})
