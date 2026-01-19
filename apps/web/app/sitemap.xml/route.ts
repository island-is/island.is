export const revalidate = 3600 // 1 hour

export const GET = async () => {
  const sitemap = [
    {
      icelandicUrl: 'https://island.is',
      englishUrl: 'https://island.is/en',
      lastModified: new Date().toISOString(),
    },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
        ${sitemap
          .map(
            (item) => `
            <url>
                <lastmod>${item.lastModified}</lastmod>
                <loc>${item.icelandicUrl}</loc>
                <xhtml:link 
                    rel="alternate" 
                    hreflang="is" 
                    href="${item.icelandicUrl}" />
                <xhtml:link 
                    rel="alternate" 
                    hreflang="en" 
                    href="${item.englishUrl}" />
                <xhtml:link 
                    rel="alternate" 
                    hreflang="x-default" 
                    href="${item.englishUrl}" />
            </url>
        `,
          )
          .join('')}
    </urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
