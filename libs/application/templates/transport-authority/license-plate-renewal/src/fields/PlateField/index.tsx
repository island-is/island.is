import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useCallback, useEffect } from 'react'
import { PlateOwnership } from '../../shared'
import { ApolloQueryResult, useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import {
  VehicleRadioFormField,
  VehicleSelectFormField,
} from '@island.is/application/ui-fields'
import { applicationCheck, error, information } from '../../lib/messages'
import { checkCanRenew } from '../../utils'
import { useLazyPlateDetails } from '../../hooks/useLazyPlateDetails'

export const PlateField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { locale } = useLocale()
  const { setValue } = useFormContext()
  const { application } = props
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const myPlateOwnershipList = application.externalData['myPlateOwnershipList']
    .data as PlateOwnership[]

  const getPlateDetails = useLazyPlateDetails()
  const createGetPlateDetailsWrapper = (
    getPlateDetailsFunction: (variables: {
      regno: string
    }) => Promise<ApolloQueryResult<any>>,
  ) => {
    return async (value: string) => {
      const variables = { regno: value }
      const result = await getPlateDetailsFunction(variables)
      return result.data.myPlateOwnershipChecksByRegno // Adjust based on your query
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
    setValue('information', undefined)
    updateData()
  }, [setValue, updateData])

  return (
    <Box paddingTop={2}>
      {myPlateOwnershipList.length > 5 ? (
        <VehicleSelectFormField
          {...props}
          field={{
            id: 'pickPlate',
            title: information.labels.pickPlate.title,
            type: FieldTypes.VEHICLE_SELECT,
            component: FieldComponents.VEHICLE_SELECT,
            children: undefined,
            itemType: 'PLATE',
            itemList: myPlateOwnershipList,
            getDetails: createGetPlateDetailsWrapper(getPlateDetails),
            shouldValidateErrorMessages: true,
            shouldValidateRenewal: true,
            inputLabelText: information.labels.pickPlate.plate,
            inputPlaceholderText: information.labels.pickPlate.placeholder,
            alertMessageErrorTitle: information.labels.pickPlate.hasErrorTitle,
            validationErrorMessages: applicationCheck.validation,
            validationErrorFallbackMessage:
              applicationCheck.validation.fallbackErrorMessage,
            inputErrorMessage: error.requiredValidPlate,
            renewalExpiresAtTag: information.labels.pickPlate.expiresTag,
            validateRenewal: (item) => checkCanRenew(item as PlateOwnership),
          }}
        />
      ) : (
        <VehicleRadioFormField
          {...props}
          field={{
            id: 'pickPlate',
            title: information.labels.pickPlate.title,
            type: FieldTypes.VEHICLE_RADIO,
            component: FieldComponents.VEHICLE_RADIO,
            children: undefined,
            itemType: 'PLATE',
            itemList: myPlateOwnershipList,
            shouldValidateErrorMessages: true,
            shouldValidateRenewal: true,
            alertMessageErrorTitle: information.labels.pickPlate.hasErrorTitle,
            validationErrorMessages: applicationCheck.validation,
            validationErrorFallbackMessage:
              applicationCheck.validation.fallbackErrorMessage,
            inputErrorMessage: error.requiredValidPlate,
            renewalExpiresAtTag: information.labels.pickPlate.expiresTag,
            validateRenewal: (item) => checkCanRenew(item as PlateOwnership),
          }}
        />
      )}
    </Box>
  )
}
