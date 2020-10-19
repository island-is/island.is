import { DesignGuide } from '../screens'
import ContentfulApi from '../services/contentful'

export async function getStaticProps() {
  const client = new ContentfulApi()
  let locale = 'is-IS'

  const pageContent = await client.fetchPageBySlug('design-guide', locale)

  return {
    props: {
      pageContent: pageContent,
    },
  }
}

export default DesignGuide
