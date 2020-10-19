import { ServiceList } from '../../screens'
import ContentfulApi from '../../services/contentful'

export async function getStaticProps() {
  const client = new ContentfulApi()
  let locale = 'is-IS'

  const pageContent = await client.fetchPageBySlug('services', locale)
  const filterStrings = await client.fetchPageBySlug('service-filter', locale)

  return {
    props: {
      pageContent: pageContent,
      filterStrings: filterStrings,
    },
  }
}

export default ServiceList
