import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { CurrentVehiclesAndRecords } from '../../shared'
import { error, information } from '../../lib/messages'
import {
  FindVehicleFormField,
  VehicleRadioFormField,
  VehicleSelectFormField,
} from '@island.is/application/ui-fields'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { ApolloQueryResult } from '@apollo/client'

export const VehiclesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const currentVehicleList = application.externalData.currentVehicleList
    .data as CurrentVehiclesAndRecords

  const getVehicleDetails = useLazyVehicleDetails()
  const createGetVehicleDetailsWrapper = (
    getVehicleDetailsFunction: (variables: {
      permno: string
    }) => Promise<ApolloQueryResult<any>>,
  ) => {
    return async (plate: string) => {
      const variables = { permno: plate }
      const result = await getVehicleDetailsFunction(variables)
      return result.data.myVehicleBasicInfoByPermno // Adjust based on your query
    }
  }

  return (
    <Box paddingTop={2}>
      {currentVehicleList.totalRecords > 20 ? (
        <FindVehicleFormField
          application={application}
          setFieldLoadingState={props.setFieldLoadingState}
          setSubmitButtonDisabled={props.setSubmitButtonDisabled}
          field={{
            id: 'pickVehicle',
            title: information.labels.pickVehicle.title,
            type: FieldTypes.FIND_VEHICLE,
            component: FieldComponents.FIND_VEHICLE,
            children: undefined,
            getDetails: createGetVehicleDetailsWrapper(getVehicleDetails),
            additionalErrors: false,
            findPlatePlaceholder:
              information.labels.pickVehicle.findPlatePlaceholder,
            findVehicleButtonText: information.labels.pickVehicle.findButton,
            notFoundErrorMessage:
              information.labels.pickVehicle.notFoundMessage,
            notFoundErrorTitle: information.labels.pickVehicle.notFoundTitle,
            requiredValidVehicleErrorMessage: error.requiredValidVehicle,
          }}
        />
      ) : currentVehicleList.totalRecords > 5 ? (
        <VehicleSelectFormField
          {...props}
          field={{
            id: 'pickVehicle',
            title: information.labels.pickVehicle.title,
            type: FieldTypes.VEHICLE_SELECT,
            component: FieldComponents.VEHICLE_SELECT,
            children: undefined,
            itemType: 'VEHICLE',
            itemList: currentVehicleList?.vehicles,
            inputLabelText: information.labels.pickVehicle.vehicle,
            inputPlaceholderText: information.labels.pickVehicle.placeholder,
            inputErrorMessage: error.requiredValidVehicle,
          }}
        />
      ) : (
        <VehicleRadioFormField
          {...props}
          field={{
            id: 'pickVehicle',
            title: information.labels.pickVehicle.title,
            type: FieldTypes.VEHICLE_RADIO,
            component: FieldComponents.VEHICLE_RADIO,
            children: undefined,
            itemType: 'VEHICLE',
            itemList: currentVehicleList?.vehicles,
            inputErrorMessage: error.requiredValidVehicle,
          }}
        />
      )}
    </Box>
  )
}
