import { Query, QueryGetApiServiceByIdArgs } from '@island.is/api/schema'
import { GetServerSideProps } from 'next'
import { ServiceDetail, ServiceDetailProps } from '../../screens'
import ContentfulApi from '../../services/contentful'
import { GET_API_SERVICE_QUERY } from '../../screens/Queries'
import initApollo from '../../graphql/client'

const apolloClient = initApollo({})

export const getServerSideProps: GetServerSideProps<ServiceDetailProps> = async (
  ctx,
) => {
  const client = new ContentfulApi()
  const locale = 'is-IS'

  const filterStrings = await client.fetchPageBySlug('service-filter', locale)
  const id = ctx.params.service as string

  const [
    {
      data: { getApiServiceById },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetApiServiceByIdArgs>({
      query: GET_API_SERVICE_QUERY,
      variables: {
        input: {
          id: id,
        },
      },
    }),
  ])

  return {
    props: {
      filterStrings: filterStrings,
      service: getApiServiceById,
    },
  }
}

export default ServiceDetail
