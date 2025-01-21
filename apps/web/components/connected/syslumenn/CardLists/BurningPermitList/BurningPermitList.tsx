import { useQuery } from '@apollo/client'

import type { ConnectedComponent } from '@island.is/web/graphql/schema'

import { GET_BURNING_PERMITS_QUERY } from './queries'

interface BurningPermitListProps {
  slice: ConnectedComponent
}

export const BurningPermitList = ({ slice }: BurningPermitListProps) => {
  useQuery(GET_BURNING_PERMITS_QUERY, {
    onCompleted(data) {
      console.log(data)
    },
    onError(error) {
      console.error(error)
    },
  })

  return <div>{JSON.stringify(slice)}</div>
}
