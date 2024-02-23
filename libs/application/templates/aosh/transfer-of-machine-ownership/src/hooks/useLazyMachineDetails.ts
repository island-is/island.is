import { gql } from '@apollo/client'
import { MachineDto } from '@island.is/clients/work-machines'
import { GET_MACHINE_DETAILS, GET_MACHINE_BY_REGNO } from '../graphql/queries'
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

export const useLazyMachineDetailsByRegno = () => {
  return useLazyQuery<
    {
      getWorkerMachineDetailsByRegno: MachineDto
    },
    {
      regno: string
    }
  >(
    gql`
      ${GET_MACHINE_BY_REGNO}
    `,
  )
}
