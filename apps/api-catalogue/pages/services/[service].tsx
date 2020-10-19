import { ServiceDetail } from '../../screens'
import ContentfulApi from '../../services/contentful'

export async function getStaticProps() {
  const client = new ContentfulApi()
  const locale = 'is-IS'

  const filterStrings = await client.fetchPageBySlug('service-filter', locale)

  return {
    props: {
      filterStrings: filterStrings,
    },
  }
}

export default ServiceDetail
