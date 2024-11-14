import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useCallback, useEffect } from 'react'
import { VehicleRadioField } from './VehicleRadioField'
import { useFormContext } from 'react-hook-form'
import { CurrentVehiclesAndRecords } from '../../shared'
import { ApolloQueryResult, useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { VehicleSelectField } from './VehicleSelectField'
import {
  FindVehicleFormField,
  VehicleRadioFormField,
} from '@island.is/application/ui-fields'
import { information, applicationCheck, error } from '../../lib/messages'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'

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
      return result.data.vehicleOwnerchangeChecksByPermno // Adjust based on your query
    }
  }

  const updateData = useCallback(async () => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            sellerCoOwner: [],
          },
        },
        locale,
      },
    })
  }, [])
  useEffect(() => {
    setValue('sellerCoOwner', [])
    updateData()
  }, [setValue])
  return (
    <Box paddingTop={2}>
      {currentVehicleList.totalRecords > 20 ? (
        <FindVehicleFormField
          setFieldLoadingState={props.setFieldLoadingState}
          setSubmitButtonDisabled={props.setSubmitButtonDisabled}
          {...props}
          field={{
            id: 'pickVehicle',
            title: information.labels.pickVehicle.title,
            description: information.labels.pickVehicle.description,
            type: FieldTypes.FIND_VEHICLE,
            component: FieldComponents.FIND_VEHICLE,
            children: undefined,
            getDetails: createGetVehicleDetailsWrapper(getVehicleDetails),
            validationErrors: applicationCheck.validation,
            additionalErrors: true,
            fallbackErrorMessage:
              applicationCheck.validation.fallbackErrorMessage,
            isNotDebtLessTag: information.labels.pickVehicle.isNotDebtLessTag,
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

      <VehicleRadioFormField
        {...props}
        field={{
          id: 'pickVehicle',
          title: information.labels.pickVehicle.title,
          description: information.labels.pickVehicle.description,
          type: FieldTypes.VEHICLE_RADIO,
          component: FieldComponents.VEHICLE_RADIO,
          children: undefined,
          alertMessageErrorTitle: information.labels.pickVehicle.hasErrorTitle,
          errorIsNotDebtLessMessage:
            information.labels.pickVehicle.isNotDebtLessTag,
          validationErrorMessages: applicationCheck.validation,
          validationErrorFallbackMessage:
            applicationCheck.validation.fallbackErrorMessage,
          inputErrorMessage: error.requiredValidVehicle,
        }}
        currentVehicleList={currentVehicleList?.vehicles}
      />
    </Box>
  )
}
