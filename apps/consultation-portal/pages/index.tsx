import initApollo from '../graphql/client'
import { GET_ALL_TYPES } from '../screens/Home/getAllTypes.graphql'
import { ConsultationPortalAllTypesQuery } from '../screens/Home/getAllTypes.graphql.generated'

import { ArrOfTypes, Case } from '../types/interfaces'
import Home from '../screens/Home/Home'

interface HomeProps {
  cases: Case[]
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
      client.query<ConsultationPortalAllTypesQuery>({
        query: GET_ALL_TYPES,
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
    notFound: true,
  }
}

export const Index = ({ types }: HomeProps) => {
  return <Home types={types} />
}

export default Index
