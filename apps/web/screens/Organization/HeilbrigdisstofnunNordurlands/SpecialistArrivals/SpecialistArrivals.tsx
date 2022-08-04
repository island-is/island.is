import { Query } from '@island.is/api/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_HEILBRIGDISSTOFNUN_NORDURLANDS_SPECIALISTS_QUERY } from '@island.is/web/screens/queries'
import type { Screen } from '@island.is/web/types'

interface SpecialistArrivalsProps {
  data: any
}

const SpecialistArrivals: Screen<SpecialistArrivalsProps> = ({
  data,
}: SpecialistArrivalsProps) => {
  return <div>{JSON.stringify(data)}</div>
}

SpecialistArrivals.getInitialProps = async ({ apolloClient }) => {
  const [{ data }] = await Promise.all([
    apolloClient.query<Query>({
      query: GET_HEILBRIGDISSTOFNUN_NORDURLANDS_SPECIALISTS_QUERY,
      variables: {
        input: {
          personSsn: '0101302129',
        },
      },
    }),
  ])

  return {
    data,
  }
}

export default withMainLayout(SpecialistArrivals)
