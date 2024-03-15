import { Box } from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC } from 'react'
import { CurrentVehiclesAndRecords } from '../../shared/types'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleCheckboxField } from './VehicleCheckboxField'
import { useLazyVehicleDetailsWithGrantByPermno } from '../../hooks/useLazyVehicleQuery'
import { ApolloQueryResult } from '@apollo/client'
import { FindVehicleFormField } from '@island.is/application/ui-fields'
import { information } from '../../lib/messages/information'
import { error } from '../../lib/messages'

export const SelectVehicle: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const currentVehicleList = application.externalData.currentVehicles
    .data as CurrentVehiclesAndRecords

  const getVehicleDetails = useLazyVehicleDetailsWithGrantByPermno()
  const createGetVehicleDetailsWrapper = (
    getVehicleDetailsFunction: (variables: {
      permno: string
    }) => Promise<ApolloQueryResult<any>>,
  ) => {
    return async (plate: string) => {
      const variables = { permno: plate }
      const result = await getVehicleDetailsFunction(variables)
      return result.data.energyFundVehicleDetailsWithGrant // Adjust based on your query
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
            id: 'selectVehicle',
            title: information.labels.pickVehicle.title,
            description: information.labels.pickVehicle.description,
            type: FieldTypes.FIND_VEHICLE,
            component: FieldComponents.FIND_VEHICLE,
            children: undefined,
            getDetails: createGetVehicleDetailsWrapper(getVehicleDetails),
            additionalErrors: false,
            findPlatePlaceholder:
              information.labels.pickVehicle.findPlatePlaceholder,
            findVehicleButtonText: information.labels.pickVehicle.findButton,
            hasErrorTitle: information.labels.pickVehicle.hasErrorTitle,
            notFoundErrorMessage:
              information.labels.pickVehicle.notFoundMessage,
            notFoundErrorTitle: information.labels.pickVehicle.notFoundTitle,
            requiredValidVehicleErrorMessage: error.requiredValidVehicle,
            isEnergyFunds: true,
            energyFundsMessages: information.labels.pickVehicle,
          }}
        />
      ) : currentVehicleList.totalRecords > 5 ? (
        <VehicleSelectField
          currentVehicleList={currentVehicleList.vehicles}
          {...props}
        />
      ) : (
        <VehicleCheckboxField
          currentVehicleList={currentVehicleList.vehicles}
          {...props}
        />
      )}
    </Box>
  )
}
