import { Error500 } from '../components'
import initApollo from '../graphql/client'
import { HOME_GET_TYPES } from '../graphql/queries.graphql'
import { HomeGetTypesQuery } from '../graphql/queries.graphql.generated'
import { withApollo } from '../graphql/withApollo'
import Home from '../screens/Home/Home'
import { ArrOfTypes } from '../types/interfaces'

interface HomeProps {
  types: ArrOfTypes
  is500: boolean
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
    props: {
      types: null,
      is500: true,
    },
  }
}

export const Index = ({ types, is500 }: HomeProps) => {
  if (is500) return <Error500 />
  return <Home types={types} />
}

export default withApollo(Index)
