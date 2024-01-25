import { gql } from '@apollo/client'
import { MachineDto } from '@island.is/clients/work-machines'
import { GET_MACHINE_DETAILS } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyMachineDetails = () => {
  return useLazyQuery<
    {
      getWorkerMachineDetails: MachineDto
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
