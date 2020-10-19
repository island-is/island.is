import { GetStaticProps } from 'next'
import { ServiceList, ServiceListProps } from '../../screens'
import ContentfulApi from '../../services/contentful'

export const getStaticProps: GetStaticProps<ServiceListProps> = async () => {
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
