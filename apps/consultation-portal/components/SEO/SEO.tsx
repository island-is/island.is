import { SEOProps } from '../../types/interfaces'
import Head from 'next/head'

export const SEO = ({ title, image, url }: SEOProps) => {
  return (
    <Head>
      <title>{`Samráðsgátt | ${title}`}</title>
      <meta
        property="og:url"
        content={`https://samradsgatt.island.is/${url}`}
        key="ogurl"
      />
      <meta property="og:image" content={image ?? image} key="ogimage" />
      <meta property="og:site_name" content="Samráðsgátt" key="ogsitename" />
      <meta
        property="og:title"
        content={`Samráðsgátt | ${title}`}
        key="ogtitle"
      />
      <meta
        property="og:description"
        content="seoDescriptionHomePage"
        key="ogdesc"
      />
      <meta name="description" content="seoDescriptionHomePage" />
      <meta name="keywords" content="seoKeyWords" />
    </Head>
  )
}
export default SEO
