import { gql } from '@apollo/client'
import { MachineParentCategoryDetailsDto } from '@island.is/clients/work-machines'
import { MACHINE_CATEGORY } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyMachineCategory = () => {
  return useLazyQuery<
    {
      getMachineParentCategoryByTypeAndModel: MachineParentCategoryDetailsDto[]
    },
    {
      input: {
        type: string
        model: string
      }
    }
  >(
    gql`
      ${MACHINE_CATEGORY}
    `,
  )
}
