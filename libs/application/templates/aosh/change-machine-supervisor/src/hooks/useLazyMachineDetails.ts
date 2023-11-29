import { gql } from '@apollo/client'
import { MachineHateoasDto } from '@island.is/clients/aosh/transfer-of-machine-ownership'
import { GET_MACHINE_DETAILS } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyMachineDetails = () => {
  return useLazyQuery<
    {
      aoshMachineDetails: MachineHateoasDto
    },
    {
      id: string
    }
  >(
    gql`
      ${GET_MACHINE_DETAILS}
    `,
  )
}
