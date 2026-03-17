export type SitemapUrl = {
  loc:
    | {
        en: string
        is: string
      }
    | {
        en?: string
        is: string
      }
    | {
        en: string
        is?: string
      }
  lastmod?: string
}

export const generateSitemapUrlString = (url: SitemapUrl) => {
  const lastmod = url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''
  const xhtmlLinks =
    Boolean(url.loc.is) && Boolean(url.loc.en)
      ? `
      ${
        Boolean(url.loc.is) &&
        `<xhtml:link rel="alternate" hreflang="is" href="${url.loc.is}" />`
      }
      ${
        Boolean(url.loc.en) &&
        `<xhtml:link rel="alternate" hreflang="en" href="${url.loc.en}" />`
      }
      <xhtml:link rel="alternate" hreflang="x-default" href="${url.loc.en}" />
    `
      : ''
  const icelandicUrl = url.loc.is
    ? `<url>
        <loc>${url.loc.is}</loc>
        ${lastmod}
        ${xhtmlLinks}
     </url>`
    : ''
  const englishUrl = url.loc.en
    ? `<url>
        <loc>${url.loc.en}</loc>
        ${lastmod}
        ${xhtmlLinks}
     </url>`
    : ''

  return `${icelandicUrl}${englishUrl}`
}
