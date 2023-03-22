import initApollo from '../../graphql/client'
import { GET_ALL_USER_ADVICES } from '../../screens/Advices/getAllUserAdvices.graphql'
import { ConsultationPortalAllUserAdvicesQuery } from '../../screens/Advices/getAllUserAdvices.graphql.generated'
import { UserAdvice } from '../../types/interfaces'
import Advices from '../../screens/Advices/Advices'
import { parseCookie } from '../../utils/helpers'

interface UserAdvicesProps {
  allUserAdvices: UserAdvice
}

export const getServerSideProps = async (ctx) => {
  const cookie = ctx.req.headers.cookie
  const parsedCookie = parseCookie(cookie)
  const token = Object.prototype.hasOwnProperty.call(parsedCookie, "token")
    ? parsedCookie['token']
    : ''

  const client = initApollo()
  try {
    const [
      {
        data: { consultationPortalAllUserAdvices },
      },
    ] = await Promise.all([
      client.query<ConsultationPortalAllUserAdvicesQuery>({
        query: GET_ALL_USER_ADVICES,
        context: { token },
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
