import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box, InputError } from '@island.is/island-ui/core'
import { FC } from 'react'
import { CurrentVehiclesAndRecords } from '../../shared'
import { VehicleRadioField } from './VehicleRadioField'
import { useLocale } from '@island.is/localization'
import { error, information } from '../../lib/messages'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { FindVehicleFormField } from '@island.is/application/ui-fields'
import { ApolloQueryResult } from '@apollo/client'
import { VehicleSelectField } from './VehicleSelectField'

export const VehiclesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage } = useLocale()
  const { application, errors } = props

  const getVehicleDetails = useLazyVehicleDetails()
  const createGetVehicleDetailsWrapper = (
    getVehicleDetailsFunction: (variables: {
      permno: string
    }) => Promise<ApolloQueryResult<any>>,
  ) => {
    return async (plate: string) => {
      const variables = { permno: plate }
      const result = await getVehicleDetailsFunction(variables)
      return result.data.vehicleOwnerchangeChecksByPermno // Adjust based on your query
    }
  }
  const currentVehicleList = application.externalData.currentVehicleList
    .data as CurrentVehiclesAndRecords

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
        <VehicleSelectField
          currentVehicleList={currentVehicleList.vehicles}
          {...props}
        />
      ) : (
        <VehicleRadioField
          currentVehicleList={currentVehicleList?.vehicles}
          {...props}
        />
      )}
      {(errors as any)?.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </Box>
  )
}
