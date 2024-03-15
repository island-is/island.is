import Head from 'next/head'
import { SEOProps } from '../../../../types/interfaces'
import localization from '../../Layout.json'

const SEO = ({ title, image, url, description, keywords }: SEOProps) => {
  const loc = localization.seo
  const desc = description ? description : ''
  const kwords = keywords ? keywords : loc.keywords
  const _url = url ? url : ''

  return (
    <Head>
      <title>{`${loc.title} | ${title}`}</title>
      <meta
        property="og:url"
        content={`https://island.is/samradsgatt/${_url}`}
        key="ogurl"
      />
      <meta property="og:image" content={image ?? image} key="ogimage" />
      <meta property="og:site_name" content={loc.title} key="ogsitename" />
      <meta
        property="og:title"
        content={`${loc.title} - ${title}`}
        key="ogtitle"
      />
      <meta property="og:description" content={desc} key="ogdesc" />
      <meta name="description" content={desc} />
      <meta name="keywords" content={kwords} />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  )
}
export default SEO
