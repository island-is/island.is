import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useCallback, useEffect, useState } from 'react'
import { MachineSelectField } from './MachineSelectField'
import { MachineRadioField } from './MachineRadioField'
import { MachineHateoasDto } from '@island.is/clients/aosh/transfer-of-machine-ownership'
import { gql, useApolloClient } from '@apollo/client'
import { GET_MACHINE_DETAILS } from '../../graphql/queries'

export const MachinesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const [isLoading, setIsLoading] = useState(false)
  const initialMachineList = application?.externalData.machinesList.data as
    | MachineHateoasDto[]
    | undefined

  const [currentMachineList, setCurrentMachineList] = useState<
    MachineHateoasDto[]
  >(initialMachineList || [])

  const client = useApolloClient()

  const getMachineDetails = useCallback(
    async (machine: MachineHateoasDto) => {
      const { data } = await client.query({
        query: gql`
          ${GET_MACHINE_DETAILS}
        `,
        variables: {
          id: machine.id,
        },
      })

      return data.aoshMachineDetails
    },
    [client],
  )

  useEffect(() => {
    const fetchData = async () => {
      if (currentMachineList.length <= 5) {
        setIsLoading(true)
        const updatedMachines = await Promise.all(
          currentMachineList.map(async (machine) => {
            const updatedMachine = await getMachineDetails(machine)
            return updatedMachine || machine
          }),
        )
        setCurrentMachineList(updatedMachines)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Box paddingTop={2}>
      {currentMachineList.length > 5 ? (
        <MachineSelectField
          currentMachineList={currentMachineList}
          {...props}
        />
      ) : (
        !isLoading && (
          <MachineRadioField
            currentMachineList={currentMachineList}
            {...props}
          />
        )
      )}
    </Box>
  )
}
