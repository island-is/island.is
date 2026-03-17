import { EN_LOCALE, LOCALE } from '../constants'

export interface SitemapUrlFetcher {
  getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }>
}

export type SitemapUrl = {
  loc:
    | {
        [EN_LOCALE]: string
        [LOCALE]: string
      }
    | {
        [EN_LOCALE]?: string
        [LOCALE]: string
      }
    | {
        [EN_LOCALE]: string
        [LOCALE]: string
      }
  lastmod?: string | null
}

export const generateSitemapUrlString = (url: SitemapUrl) => {
  const lastmod = url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''
  const xhtmlLinks =
    Boolean(url.loc[LOCALE]) && Boolean(url.loc[EN_LOCALE])
      ? `
      ${
        Boolean(url.loc[LOCALE]) &&
        `<xhtml:link rel="alternate" hreflang="is" href="${url.loc[LOCALE]}" />`
      }
      ${
        Boolean(url.loc[EN_LOCALE]) &&
        `<xhtml:link rel="alternate" hreflang="en" href="${url.loc[EN_LOCALE]}" />`
      }
      <xhtml:link rel="alternate" hreflang="x-default" href="${
        url.loc[EN_LOCALE]
      }" />
    `
      : ''
  const icelandicUrl = url.loc[LOCALE]
    ? `<url>
        <loc>${url.loc[LOCALE]}</loc>
        ${lastmod}
        ${xhtmlLinks}
     </url>`
    : ''
  const englishUrl = url.loc[EN_LOCALE]
    ? `<url>
        <loc>${url.loc[EN_LOCALE]}</loc>
        ${lastmod}
        ${xhtmlLinks}
     </url>`
    : ''

  return `${icelandicUrl}${englishUrl}`
}
