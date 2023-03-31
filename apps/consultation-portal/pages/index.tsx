import initApollo from '../graphql/client'
import { GET_ALL_TYPES } from '../screens/Home/getAllTypes.graphql'
import { ConsultationPortalAllTypesQuery } from '../screens/Home/getAllTypes.graphql.generated'

import { ArrOfStatistics, ArrOfTypes, Case } from '../types/interfaces'
import Home from '../screens/Home/Home'
import { ConsultationPortalStatisticsQuery } from '../screens/Home/getStatistics.graphql.generated'
import { GET_STATISTICS } from '../screens/Home/getStatistics.graphql'

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
      client.query<ConsultationPortalAllTypesQuery>({
        query: GET_ALL_TYPES,
      }),
      client.query<ConsultationPortalStatisticsQuery>({
        query: GET_STATISTICS,
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
