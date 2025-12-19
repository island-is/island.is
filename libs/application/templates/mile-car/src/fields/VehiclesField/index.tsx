import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { CurrentVehiclesAndRecords } from '../../shared'
import { ApolloQueryResult, useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import {
  FindVehicleFormField,
  VehicleRadioFormField,
  VehicleSelectFormField,
} from '@island.is/application/ui-fields'
import { selectVehicle as selectVehicleMessages } from '../../lib/messages'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'

export const VehiclesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { locale } = useLocale()
  const { setValue } = useFormContext()
  const { application } = props
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const currentVehicleList = application.externalData.currentVehicles
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
      return result.data.vehicleBasicInfoByPermno // Adjust based on your query
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
  }, [application.id, locale, updateApplication])

  useEffect(() => {
    setValue('sellerCoOwner', [])
    updateData()
  }, [setValue, updateData])

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
            description: selectVehicleMessages.labels.description,
            type: FieldTypes.FIND_VEHICLE,
            component: FieldComponents.FIND_VEHICLE,
            children: undefined,
            getDetails: createGetVehicleDetailsWrapper(getVehicleDetails),
            validationErrors: selectVehicleMessages.validation,
            additionalErrors: false,
            fallbackErrorMessage:
              selectVehicleMessages.validation.fallbackErrorMessage,
            isNotDebtLessTag: selectVehicleMessages.labels.isNotDebtLessTag,
            findPlatePlaceholder:
              selectVehicleMessages.labels.findPlatePlaceholder,
            findVehicleButtonText: selectVehicleMessages.labels.findButton,
            hasErrorTitle: selectVehicleMessages.labels.hasErrorTitle,
            notFoundErrorMessage: selectVehicleMessages.labels.notFoundMessage,
            notFoundErrorTitle: selectVehicleMessages.labels.notFoundTitle,
            requiredValidVehicleErrorMessage:
              selectVehicleMessages.errors.requiredValidVehicle,
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
            shouldValidateErrorMessages: false,
            shouldValidateDebtStatus: false,
            inputLabelText: selectVehicleMessages.labels.vehicle,
            inputPlaceholderText: selectVehicleMessages.labels.placeholder,
            alertMessageErrorTitle: selectVehicleMessages.labels.hasErrorTitle,
            validationErrorMessages: selectVehicleMessages.validation,
            validationErrorFallbackMessage:
              selectVehicleMessages.validation.fallbackErrorMessage,
            inputErrorMessage:
              selectVehicleMessages.errors.requiredValidVehicle,
            debtStatusErrorMessage:
              selectVehicleMessages.labels.isNotDebtLessTag,
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
            shouldValidateErrorMessages: true,
            shouldValidateDebtStatus: true,
            alertMessageErrorTitle: selectVehicleMessages.labels.hasErrorTitle,
            validationErrorMessages: selectVehicleMessages.validation,
            validationErrorFallbackMessage:
              selectVehicleMessages.validation.fallbackErrorMessage,
            inputErrorMessage:
              selectVehicleMessages.errors.requiredValidVehicle,
            debtStatusErrorMessage:
              selectVehicleMessages.labels.isNotDebtLessTag,
          }}
        />
      )}
    </Box>
  )
}
