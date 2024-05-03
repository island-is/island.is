import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { MachineSelectField } from './MachineSelectField'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'
import { information, applicationCheck, error } from '../../lib/messages'
import { FindVehicleFormField } from '@island.is/application/ui-fields'
import { ApolloQueryResult } from '@apollo/client'
import { useLazyMachineDetailsByRegno } from '../../hooks/useLazyMachineDetails'

export const MachinesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const machineList = application?.externalData.machinesList
    .data as MachinesWithTotalCount

  const getMachineDetails = useLazyMachineDetailsByRegno()
  const createGetMachineDetailsWrapper = (
    getMachineDetailsFunction: (variables: {
      regno: string
      rel: string
    }) => Promise<ApolloQueryResult<any>>,
  ) => {
    return async (plate: string) => {
      const variables = { regno: plate, rel: 'supervisorChange' }
      const result = await getMachineDetailsFunction(variables)
      return result.data.getWorkerMachineByRegno // Adjust based on your query
    }
  }

  return (
    <Box paddingTop={2}>
      {machineList.totalCount > 20 ? (
        <FindVehicleFormField
          application={application}
          setFieldLoadingState={props.setFieldLoadingState}
          setSubmitButtonDisabled={props.setSubmitButtonDisabled}
          field={{
            id: 'machine',
            title: information.labels.pickMachine.title,
            description: information.labels.pickMachine.description,
            type: FieldTypes.FIND_VEHICLE,
            component: FieldComponents.FIND_VEHICLE,
            children: undefined,
            getDetails: createGetMachineDetailsWrapper(getMachineDetails),
            validationErrors: applicationCheck.validation,
            additionalErrors: false,
            findPlatePlaceholder:
              information.labels.pickMachine.findRegistrationNumberPlaceholder,
            findVehicleButtonText: information.labels.pickMachine.findButton,
            hasErrorTitle: information.labels.pickMachine.hasErrorTitle,
            notFoundErrorMessage:
              information.labels.pickMachine.notFoundMessage,
            notFoundErrorTitle: information.labels.pickMachine.notFoundTitle,
            requiredValidVehicleErrorMessage: error.requiredValidMachine,
            isMachine: true,
          }}
        />
      ) : (
        <MachineSelectField
          currentMachineList={machineList.machines}
          {...props}
        />
      )}
    </Box>
  )
}
