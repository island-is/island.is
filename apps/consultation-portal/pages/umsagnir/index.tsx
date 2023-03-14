import initApollo from '../../graphql/client'
import { GET_ALL_USER_ADVICES } from '../../screens/Advices/getAllUserAdvices.graphql'
import { ConsultationPortalAllUserAdvicesQuery } from '../../screens/Advices/getAllUserAdvices.graphql.generated'
import { UserAdvice } from '../../types/interfaces'
import Advices from '../../screens/Advices/Advices'

interface UserAdvicesProps {
  allUserAdvices: UserAdvice
}

export const getServerSideProps = async (ctx) => {
  const client = initApollo()
  try {
    const [
      {
        data: { consultationPortalAllUserAdvices },
      },
    ] = await Promise.all([
      client.query<ConsultationPortalAllUserAdvicesQuery>({
        query: GET_ALL_USER_ADVICES,
      }),
    ])
    return {
      props: {
        allUserAdvices: consultationPortalAllUserAdvices,
      },
    }
  } catch (e) {
    console.error(e)
  }
  return {
    notFound: true,
  }
}

export const Index = ({ allUserAdvices }: UserAdvicesProps) => {
  return <Advices allUserAdvices={allUserAdvices} />
}

export default Index
