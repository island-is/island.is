import {
  buildAsyncVehicleTextField,
  buildMultiField,
} from '@island.is/application/core'
import { convoy } from '../../../lib/messages'
import { isExemptionTypeShortTerm } from '../../../utils'
import { loadValidation } from '../../../utils/helperFunctions/loadValidation'

export const ConvoyShortTermMultiField = buildMultiField({
  id: 'convoyShortTermMultiField',
  condition: (answers) => {
    return isExemptionTypeShortTerm(answers)
  },
  title: convoy.general.pageTitle,
  description: convoy.general.description,
  children: [
    buildAsyncVehicleTextField({
      id: 'convoy.items[0].vehicle',
      width: 'full',
      required: true,
      loadValidation: ({ apolloClient, permno }) =>
        loadValidation(permno, false, apolloClient),
      permnoLabel: convoy.labels.vehiclePermno,
      makeAndColorLabel: convoy.labels.vehicleMakeAndColor,
      errorTitle: convoy.error.alertTitle,
      fallbackErrorMessage: convoy.error.fallbackErrorMessage,
      validationFailedErrorMessage: convoy.error.validationFailedErrorMessage,
    }),
    buildAsyncVehicleTextField({
      id: 'convoy.items[0].trailer',
      width: 'full',
      required: false,
      loadValidation: ({ apolloClient, permno }) =>
        loadValidation(permno, true, apolloClient),
      permnoLabel: convoy.labels.trailerPermno,
      makeAndColorLabel: convoy.labels.trailerMakeAndColor,
      errorTitle: convoy.error.alertTitle,
      fallbackErrorMessage: convoy.error.fallbackErrorMessage,
      validationFailedErrorMessage: convoy.error.validationFailedErrorMessage,
    }),
  ],
})
