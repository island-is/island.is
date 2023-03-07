import initApollo from '../graphql/client'
import {
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllCasesQueryVariables,
  ConsultationPortalAllCasesDocument,
} from '../screens/Home/getAllCases.graphql.generated'
import {
  ConsultationPortalAllTypesQuery,
  ConsultationPortalAllTypesQueryVariables,
  ConsultationPortalAllTypesDocument,
} from '../screens/Home/getAllTypes.generated'
import Home from '../screens/Home/Home'
import { ArrOfTypes, Case } from '../types/interfaces'

interface HomeProps {
  cases: Case[]
  types: ArrOfTypes
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
  const [
    {
      data: { consultationPortalAllTypes },
    },
  ] = await Promise.all([
    client.query<
      ConsultationPortalAllTypesQuery,
      ConsultationPortalAllTypesQueryVariables
    >({
      query: ConsultationPortalAllTypesDocument,
    }),
  ])
  return {
    props: {
      cases: consultationPortalAllCases,
      types: consultationPortalAllTypes,
    },
  }
}
export const Index = ({ cases, types }: HomeProps) => {
  return <Home cases={cases} types={types} />
}
export default Index