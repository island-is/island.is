import { gql } from '@apollo/client'
import { MachineDto } from '@island.is/clients/work-machines'
import { GET_MACHINE_BY_REGNO, GET_MACHINE_DETAILS } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyMachineDetails = () => {
  return useLazyQuery<
    {
      getWorkerMachineDetails: MachineDto
    },
    {
      id: string
      rel: string
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
      rel: string
    }
  >(
    gql`
      ${GET_MACHINE_BY_REGNO}
    `,
  )
}
