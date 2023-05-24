import { SEOProps } from '../../../../types/interfaces'
import Head from 'next/head'
import localization from '../../Layout.json'

const SEO = ({ title, image, url }: SEOProps) => {
  const loc = localization.seo

  return (
    <Head>
      <title>{`${loc.title} | ${title}`}</title>
      <meta
        property="og:url"
        content={`https://island.is/samradsgatt/${url}`}
        key="ogurl"
      />
      <meta property="og:image" content={image ?? image} key="ogimage" />
      <meta property="og:site_name" content="Samráðsgátt" key="ogsitename" />
      <meta
        property="og:title"
        content={`${loc.title} | ${title}`}
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
