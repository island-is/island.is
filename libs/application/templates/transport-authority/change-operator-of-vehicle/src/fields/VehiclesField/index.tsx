import {
  FieldBaseProps,
  FieldTypes,
  FieldComponents,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useCallback, useEffect } from 'react'
import { CurrentVehiclesAndRecords } from '../../shared'
import { useFormContext } from 'react-hook-form'
import { ApolloQueryResult, useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import {
  FindVehicleFormField,
  VehicleRadioFormField,
  VehicleSelectFormField,
} from '@island.is/application/ui-fields'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { applicationCheck, error, information } from '../../lib/messages'

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
      // Extract relevant data based on your query structure
      return result.data.vehicleOperatorChangeChecksByPermno // Adjust based on your query
    }
  }

  const updateData = useCallback(async () => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ownerCoOwner: [],
            oldOperators: [],
          },
        },
        locale,
      },
    })
  }, [application.id, locale, updateApplication])

  useEffect(() => {
    setValue('ownerCoOwner', [])
    setValue('oldOperators', [])
    updateData()
  }, [setValue, updateData])

  return (
    <Box paddingTop={2}>
      <Box paddingTop={2}>
        {currentVehicleList.totalRecords > 20 ? (
          <FindVehicleFormField
            application={application}
            setFieldLoadingState={props.setFieldLoadingState}
            setSubmitButtonDisabled={props.setSubmitButtonDisabled}
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
              shouldValidateDebtStatus: true,
              inputLabelText: information.labels.pickVehicle.vehicle,
              inputPlaceholderText: information.labels.pickVehicle.placeholder,
              alertMessageErrorTitle:
                information.labels.pickVehicle.hasErrorTitle,
              validationErrorMessages: applicationCheck.validation,
              validationErrorFallbackMessage:
                applicationCheck.validation.fallbackErrorMessage,
              inputErrorMessage: error.requiredValidVehicle,
              debtStatusErrorMessage:
                information.labels.pickVehicle.isNotDebtLessTag,
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
              shouldValidateDebtStatus: true,
              alertMessageErrorTitle:
                information.labels.pickVehicle.hasErrorTitle,
              validationErrorMessages: applicationCheck.validation,
              validationErrorFallbackMessage:
                applicationCheck.validation.fallbackErrorMessage,
              inputErrorMessage: error.requiredValidVehicle,
              debtStatusErrorMessage:
                information.labels.pickVehicle.isNotDebtLessTag,
            }}
          />
        )}
      </Box>
    </Box>
  )
}
