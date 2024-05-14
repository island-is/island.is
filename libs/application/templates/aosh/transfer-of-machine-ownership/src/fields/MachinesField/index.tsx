import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { Dispatch, FC, SetStateAction, useCallback } from 'react'
import { MachineSelectField } from './MachineSelectField'
import {
  FindVehicleFormField,
  SelectVehicleFormField,
} from '@island.is/application/ui-fields'
import { information, applicationCheck, error } from '../../lib/messages'
import {
  useLazyMachineDetails,
  useLazyMachineDetailsByRegno,
} from '../../hooks/useLazyMachineDetails'
import { ApolloQueryResult } from '@apollo/client'
import {
  MachineDto,
  MachinesWithTotalCount,
} from '@island.is/clients/work-machines'
import { UseFormSetValue, FieldValues } from 'react-hook-form'
import { MachineDetails } from '@island.is/api/schema'

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
      const variables = { regno: plate, rel: 'ownerChange' }
      const result = await getMachineDetailsFunction(variables)
      return result.data.getWorkerMachineByRegno // Adjust based on your query
    }
  }

  const getMachineDetailsById = useLazyMachineDetails()
  const getMachineDetailsCallback = useCallback(
    async (id: string) => {
      const { data } = await getMachineDetailsById({
        id: id,
        rel: 'ownerChange',
      })
      return data
    },
    [getMachineDetailsById],
  )

  const onChange = (
    index: string,
    setValue: UseFormSetValue<FieldValues>,
    setSelectedMachine: Dispatch<SetStateAction<MachineDto | null>>,
  ) => {
    const currentMachine = machineList.machines[parseInt(index, 10)]
    // setSelected(true)
    if (currentMachine.id) {
      getMachineDetailsCallback(currentMachine.id)
        .then((response) => {
          setSelectedMachine(response.getWorkerMachineDetails)
          setValue(
            'machine.regNumber',
            response.getWorkerMachineDetails.regNumber,
          )
          setValue(
            'machine.category',
            response.getWorkerMachineDetails.category,
          )

          setValue('machine.type', response.getWorkerMachineDetails.type || '')
          setValue(
            'machine.subType',
            response.getWorkerMachineDetails.subType || '',
          )
          setValue(
            'machine.plate',
            response.getWorkerMachineDetails.plate || '',
          )
          setValue(
            'machine.ownerNumber',
            response.getWorkerMachineDetails.ownerNumber || '',
          )
          setValue('machine.id', response.getWorkerMachineDetails.id)
          setValue('machine.date', new Date().toISOString())
          setValue(
            'pickMachine.isValid',
            response.getWorkerMachineDetails.disabled ? undefined : true,
          )
          // setMachineId(currentMachine?.id || '')
        })
        .catch((error) => console.error(error))
    }
  }

  return (
    <Box paddingTop={2}>
      {
        machineList.totalCount > 20 ? (
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
                information.labels.pickMachine
                  .findRegistrationNumberPlaceholder,
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
          // <SelectVehicleFormField
          //   application={application}
          //   field={{
          //     id: 'machine',
          //     title: information.labels.pickMachine.title,
          //     description: information.labels.pickMachine.description,
          //     type: FieldTypes.SELECT_VEHICLE,
          //     component: FieldComponents.SELECT_VEHICLE,
          //     children: undefined,
          //     onSelect: onChange,
          //     options: machineList.machines.map((machine, index) => {
          //       return {
          //         value: index.toString(),
          //         label: `${machine.type} (${machine.regNumber})` || '',
          //       }
          //     }),
          //     validationErrors: applicationCheck.validation,
          //     additionalErrors: false,
          //   }}
          // />
          <SelectVehicleFormField
            application={application}
            field={{
              id: 'machine',
              title: information.labels.pickMachine.title,
              description: information.labels.pickMachine.description,
              type: FieldTypes.SELECT_VEHICLE,
              component: FieldComponents.SELECT_VEHICLE,
              children: undefined,
              options: machineList.machines.map((machine, index) => {
                return {
                  value: index.toString(),
                  label: `${machine.type} (${machine.regNumber})` || '',
                }
              }),
              validationErrors: applicationCheck.validation,
              getDetails: createGetMachineDetailsWrapper(getMachineDetails),
              selectLabel: information.labels.pickMachine.vehicle,
              selectPlaceholder: information.labels.pickMachine.placeholder,
              isMachine: true,
            }}
          />
        )
        // (
        //   <MachineSelectField
        //     currentMachineList={machineList.machines}
        //     {...props}
        //   />
        // )
      }
    </Box>
  )
}
