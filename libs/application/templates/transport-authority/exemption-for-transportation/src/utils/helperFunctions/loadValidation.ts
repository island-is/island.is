import { ApolloClient } from '@apollo/client'
import {
  ExemptionValidation,
  QueryVehicleExemptionValidationArgs,
} from '@island.is/api/schema'
import { FormText } from '@island.is/application/types'
import { convoy } from '../../lib/messages'
import { GET_EXEMPTION_VALIDATION_BY_PERMNO } from '../../graphql/queries'

export const loadValidation = async (
  permno: string,
  isTrailer: boolean,
  apolloClient: ApolloClient<object>,
): Promise<{ errorMessages?: FormText[] }> => {
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
        isTrailer,
      },
    })
    const validation = data.vehicleExemptionValidation

    const errorMessages: FormText[] = [
      ...(!validation.isInOrder ? [convoy.error.notInOrder] : []),
      ...(!validation.isInspected ? [convoy.error.notInspected] : []),
    ]

    const errorMap: Record<string, FormText> = {
      VEHICLE_NOT_IN_ALLOWED_GROUP: convoy.error.notInAllowedGroup,
      VEHICLE_NOT_IN_ALLOWED_USE_GROUP: convoy.error.notInAllowedUseGroup,
      VEHICLE_NOT_TRAILER: convoy.error.notTrailer,
      VEHICLE_SHOULD_NOT_BE_TRAILER: convoy.error.shouldNotBeTrailer,
      VEHICLE_NOT_FOUND: convoy.error.notFound,
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
      errorMessages: [convoy.error.validationFailedErrorMessage],
    }
  }
}
