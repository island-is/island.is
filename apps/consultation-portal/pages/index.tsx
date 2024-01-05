import initApollo from '../graphql/client'
import { HOME_GET_TYPES } from '../graphql/queries.graphql'
import { HomeGetTypesQuery } from '../graphql/queries.graphql.generated'
import { withApollo } from '../graphql/withApollo'
import Home from '../screens/Home/Home'
import { ArrOfTypes } from '../types/interfaces'

interface HomeProps {
  types: ArrOfTypes
}
export const getServerSideProps = async (ctx) => {
  const client = initApollo()

  try {
    const [
      {
        data: { consultationPortalAllTypes },
      },
    ] = await Promise.all([
      client.query<HomeGetTypesQuery>({
        query: HOME_GET_TYPES,
      }),
    ])
    return {
      props: {
        types: consultationPortalAllTypes,
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

export const Index = ({ types }: HomeProps) => {
  return <Home types={types} />
}

export default withApollo(Index)
