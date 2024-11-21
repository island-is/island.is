import { gql } from '@apollo/client'
import { MyPlateOwnershipChecksByRegno } from '@island.is/api/schema'
import { GET_MY_PLATE_OWNERSHIP_CHECKS_BY_REGNO } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyPlateDetails = () => {
  return useLazyQuery<
    {
      myPlateOwnershipChecksByRegno: MyPlateOwnershipChecksByRegno
    },
    {
      regno: string
    }
  >(
    gql`
      ${GET_MY_PLATE_OWNERSHIP_CHECKS_BY_REGNO}
    `,
  )
}
