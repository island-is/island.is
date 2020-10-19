import {
  Query,
  QueryGetApiCatalogueArgs,
  QueryGetApiServiceByIdArgs,
} from '@island.is/api/schema'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ServiceDetail, ServiceDetailProps } from '../../screens'
import ContentfulApi from '../../services/contentful'
import {
  GET_API_SERVICE_QUERY,
  GET_CATALOGUE_QUERY,
} from '../../screens/Queries'
import initApollo from '../../graphql/client'

const apolloClient = initApollo({})

export const getStaticProps: GetStaticProps<ServiceDetailProps> = async (
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

export const getStaticPaths: GetStaticPaths<{ service: string }> = async () => {
  const [
    {
      data: { getApiCatalogue },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetApiCatalogueArgs>({
      query: GET_CATALOGUE_QUERY,
      variables: {
        input: {},
      },
    }),
  ])

  const paths = getApiCatalogue.services.map((x) => {
    return { params: { service: x.id } }
  })

  return {
    fallback: true,
    paths: paths,
  }
}
