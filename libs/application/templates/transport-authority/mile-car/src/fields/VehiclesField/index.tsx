import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { CurrentVehiclesAndRecords } from '../../shared'
import { ApolloQueryResult } from '@apollo/client'
import {
  FindVehicleFormField,
  VehicleRadioFormField,
  VehicleSelectFormField,
} from '@island.is/application/ui-fields'
import { selectVehicle as selectVehicleMessages } from '../../lib/messages'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { BasicVehicleInformation } from '@island.is/api/schema'

export const VehiclesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const currentVehicleList = application.externalData.currentVehicleList
    .data as CurrentVehiclesAndRecords

  const getVehicleDetails = useLazyVehicleDetails()
  const createGetVehicleDetailsWrapper = (
    getVehicleDetailsFunction: (variables: { permno: string }) => Promise<
      ApolloQueryResult<{
        vehicleBasicInfoByPermno: BasicVehicleInformation
      }>
    >,
  ) => {
    return async (plate: string) => {
      const variables = { permno: plate }
      const result = await getVehicleDetailsFunction(variables)
      return result.data.vehicleBasicInfoByPermno
    }
  }

  return (
    <Box paddingTop={2}>
      {currentVehicleList.totalRecords > 20 ? (
        <FindVehicleFormField
          setFieldLoadingState={props.setFieldLoadingState}
          setSubmitButtonDisabled={props.setSubmitButtonDisabled}
          {...props}
          field={{
            id: 'pickVehicle',
            title: selectVehicleMessages.labels.title,
            type: FieldTypes.FIND_VEHICLE,
            component: FieldComponents.FIND_VEHICLE,
            children: undefined,
            getDetails: createGetVehicleDetailsWrapper(getVehicleDetails),
            additionalErrors: true,
            isMileCar: true,
            hasErrorTitle:
              selectVehicleMessages.validation.requiredValidVehicle,
            findPlatePlaceholder:
              selectVehicleMessages.labels.findPlatePlaceholder,
            findVehicleButtonText: selectVehicleMessages.labels.findButton,
            notFoundErrorMessage: selectVehicleMessages.labels.notFoundMessage,
            notFoundErrorTitle: selectVehicleMessages.labels.notFoundTitle,
          }}
        />
      ) : currentVehicleList.totalRecords > 5 ? (
        <VehicleSelectFormField
          {...props}
          field={{
            id: 'pickVehicle',
            title: selectVehicleMessages.labels.title,
            type: FieldTypes.VEHICLE_SELECT,
            component: FieldComponents.VEHICLE_SELECT,
            children: undefined,
            itemType: 'VEHICLE',
            itemList: currentVehicleList?.vehicles,
            getDetails: createGetVehicleDetailsWrapper(getVehicleDetails),
            inputLabelText: selectVehicleMessages.labels.vehicle,
            inputPlaceholderText: selectVehicleMessages.labels.placeholder,
            alertMessageErrorTitle:
              selectVehicleMessages.validation.requiredValidVehicle,
            inputErrorMessage:
              selectVehicleMessages.errors.requiredValidVehicle,
          }}
        />
      ) : (
        <VehicleRadioFormField
          {...props}
          field={{
            id: 'pickVehicle',
            title: selectVehicleMessages.labels.title,
            type: FieldTypes.VEHICLE_RADIO,
            component: FieldComponents.VEHICLE_RADIO,
            children: undefined,
            itemType: 'VEHICLE',
            itemList: currentVehicleList?.vehicles,
            alertMessageErrorTitle:
              selectVehicleMessages.validation.requiredValidVehicle,
            inputErrorMessage:
              selectVehicleMessages.errors.requiredValidVehicle,
          }}
        />
      )}
    </Box>
  )
}
