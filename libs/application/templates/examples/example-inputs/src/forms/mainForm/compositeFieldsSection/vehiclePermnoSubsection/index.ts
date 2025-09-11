import {
  buildMultiField,
  buildSubSection,
  buildVehiclePermnoWithInfoField,
} from '@island.is/application/core'
import { GET_EXEMPTION_VALIDATION_BY_PERMNO } from './queries'
import {
  ExemptionValidation,
  QueryVehicleExemptionValidationArgs,
} from '@island.is/api/schema'
import { FormText } from '@island.is/application/types'

export const vehiclePermnoSubsection = buildSubSection({
  id: 'vehiclePermnoSubsection',
  title: 'Vehicle permno',
  children: [
    buildMultiField({
      id: 'vehiclePermnoMultiField',
      title: 'Vehicle permno',
      children: [
        // Note: Can add vehicle.hasError to dataSchema to make sure user cannot continue if vehicle has validation error
        buildVehiclePermnoWithInfoField({
          id: 'vehicle',
          width: 'full',
          required: false,
          loadValidation: async ({ apolloClient, permno }) => {
            try {
              const { data } = await apolloClient.query<
                {
                  vehicleExemptionValidation: ExemptionValidation
                },
                QueryVehicleExemptionValidationArgs
              >({
                query: GET_EXEMPTION_VALIDATION_BY_PERMNO,
                variables: {
                  permno,
                  isTrailer: false,
                },
              })
              const validation = data.vehicleExemptionValidation

              const errorMessages: FormText[] = [
                // Custom error message for this validation endpoint
                ...(!validation.isInOrder ? ['Ökutæki er ekki í lagi'] : []),
                ...(!validation.isInspected ? ['Ökutæki er ekki skoðað'] : []),
              ]

              // Custom translation for error messages returned from API
              const errorMap: Record<string, FormText> = {
                VEHICLE_NOT_IN_ALLOWED_GROUP:
                  'Ökutæki ekki í leyfðum ökutækjaflokki',
              }
              const validationMessages = validation.errorMessages || []
              for (const { errorNo, defaultMessage } of validationMessages) {
                if (errorNo && errorMap[errorNo]) {
                  errorMessages.push(errorMap[errorNo])
                } else if (defaultMessage) {
                  errorMessages.push(defaultMessage)
                }
              }

              return { errorMessages }
            } catch (e) {
              return {
                errorMessages: ['Það kom upp villa'],
              }
            }
          },
          permnoLabel: 'Fastanúmer ökutækis',
          makeAndColorLabel: 'Tegund og litur ökutækis',
          errorTitle: 'Athugið',
          fallbackErrorMessage: 'Það kom upp villa',
          validationFailedErrorMessage:
            'Það kom upp villa við að athuga hvort ökutæki sé leyfilegt',
        }),
      ],
    }),
  ],
})
