import { gql } from '@apollo/client'
import { MachineForInspectionDto } from '@island.is/clients/work-machines'
import { GET_MACHINE_BY_REGNO } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyMachineDetailsByRegno = () => {
  return useLazyQuery<
    {
      getWorkerMachineDetailsByRegno: MachineForInspectionDto
    },
    {
      input: { registrationNumber: string }
    }
  >(
    gql`
      ${GET_MACHINE_BY_REGNO}
    `,
  )
}
