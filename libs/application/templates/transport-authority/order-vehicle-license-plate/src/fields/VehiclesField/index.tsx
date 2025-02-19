import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useCallback, useEffect } from 'react'
import { CurrentVehiclesAndRecords } from '../../shared'
import {
  FindVehicleFormField,
  VehicleRadioFormField,
  VehicleSelectFormField,
} from '@island.is/application/ui-fields'
import { information, error } from '../../lib/messages'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { ApolloQueryResult, useMutation } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'

export const VehiclesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { locale } = useLocale()
  const { setValue } = useFormContext()
  const { application } = props
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
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
      return result.data.vehiclePlateOrderChecksByPermno // Adjust based on your query
    }
  }

  const updateData = useCallback(async () => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ownerCoOwners: [],
          },
        },
        locale,
      },
    })
  }, [application.id, locale, updateApplication])

  useEffect(() => {
    setValue('plateSize.frontPlateSize', [])
    setValue('plateSize.rearPlateSize', [])
    updateData()
  }, [setValue, updateData])

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
            additionalErrors: true,
            fallbackErrorMessage: error.validationFallbackErrorMessage,
            findPlatePlaceholder:
              information.labels.pickVehicle.findPlatePlaceholder,
            findVehicleButtonText: information.labels.pickVehicle.findButton,
            hasErrorTitle: information.labels.pickVehicle.hasErrorTitle,
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
            getDetails: createGetVehicleDetailsWrapper(getVehicleDetails),
            shouldValidateErrorMessages: true,
            inputLabelText: information.labels.pickVehicle.vehicle,
            inputPlaceholderText: information.labels.pickVehicle.placeholder,
            alertMessageErrorTitle:
              information.labels.pickVehicle.hasErrorTitle,
            validationErrorFallbackMessage:
              error.validationFallbackErrorMessage,
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
            shouldValidateErrorMessages: true,
            alertMessageErrorTitle:
              information.labels.pickVehicle.hasErrorTitle,
            validationErrorFallbackMessage:
              error.validationFallbackErrorMessage,
            inputErrorMessage: error.requiredValidVehicle,
          }}
        />
      )}
    </Box>
  )
}
