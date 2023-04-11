import initApollo from '../graphql/client'
import { HOME_GET_TYPES, HOME_GET_STATISTICS } from '../graphql/queries.graphql'
import {
  HomeGetTypesQuery,
  HomeGetStatisticsQuery,
} from '../graphql/queries.graphql.generated'
import { ArrOfStatistics, ArrOfTypes } from '../types/interfaces'
import Home from '../screens/Home/Home'

interface HomeProps {
  types: ArrOfTypes
  statistics: ArrOfStatistics
}
export const getServerSideProps = async (ctx) => {
  const client = initApollo()

  try {
    const [
      {
        data: { consultationPortalAllTypes },
      },
      {
        data: { consultationPortalStatistics },
      },
    ] = await Promise.all([
      client.query<HomeGetTypesQuery>({
        query: HOME_GET_TYPES,
      }),
      client.query<HomeGetStatisticsQuery>({
        query: HOME_GET_STATISTICS,
      }),
    ])
    return {
      props: {
        types: consultationPortalAllTypes,
        statistics: consultationPortalStatistics,
      },
    }
  } catch (e) {
    console.error(e)
  }
  return {
    redirect: {
      destination: '/500',
    },
  }
}

export const Index = ({ types, statistics }: HomeProps) => {
  return <Home types={types} statistics={statistics} />
}

export default Index
