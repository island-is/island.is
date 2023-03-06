import initApollo from '../../graphql/client'
import {
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllCasesQueryVariables,
  ConsultationPortalAllCasesDocument,
} from '../../screens/Subscriptions/getSubscriptionCases.generated'
import SubscriptionScreen from '../../screens/Subscriptions/Subscriptions'
import { Case } from '../../types/interfaces'

interface SubProps {
  cases: Case[]
}
export const getServerSideProps = async (ctx) => {
  const client = initApollo()
  const [
    {
      data: { consultationPortalAllCases },
    },
  ] = await Promise.all([
    client.query<
      ConsultationPortalAllCasesQuery,
      ConsultationPortalAllCasesQueryVariables
    >({
      query: ConsultationPortalAllCasesDocument,
    }),
  ])
  return {
    props: { cases: consultationPortalAllCases },
  }
}
export const Index = ({ cases }: SubProps) => {
  return <SubscriptionScreen cases={cases} />
}
export default Index
