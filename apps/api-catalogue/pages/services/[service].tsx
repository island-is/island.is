import { GetServerSideProps } from 'next'
import { ServiceDetail, ServiceDetailProps } from '../../screens'
import ContentfulApi from '../../services/contentful'

export const getServerSideProps: GetServerSideProps<ServiceDetailProps> = async (
  ctx,
) => {
  const client = new ContentfulApi()
  const locale = 'is-IS'

  const filterStrings = await client.fetchPageBySlug('service-filter', locale)
  const id = ctx.params.service as string

  return {
    props: {
      filterStrings: filterStrings,
      serviceId: id,
    },
  }
}

export default ServiceDetail
