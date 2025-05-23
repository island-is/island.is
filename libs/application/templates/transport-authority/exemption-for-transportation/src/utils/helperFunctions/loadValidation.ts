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

  let errorMessages: FormText[] = []
  if (!validation.isInOrder) {
    errorMessages.push(convoy.error.isNotInOrder)
  }
  if (!validation.isInspected) {
    errorMessages.push(convoy.error.isNotInspected)
  }
  if (validation.errorMessages) {
    errorMessages = errorMessages.concat(
      validation.errorMessages.map((x) => x.defaultMessage),
    )
  }

  return { errorMessages }
}
