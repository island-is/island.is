import {
  buildVehiclePermnoWithInfoField,
  buildMultiField,
  buildRadioField,
} from '@island.is/application/core'
import { convoy } from '../../../lib/messages'
import { isExemptionTypeShortTerm, loadValidation } from '../../../utils'
import { DollyType } from '../../../shared'

export const ConvoyShortTermMultiField = buildMultiField({
  id: 'convoyShortTermMultiField',
  condition: (answers) => {
    return isExemptionTypeShortTerm(answers)
  },
  title: convoy.general.pageTitle,
  description: convoy.general.description,
  children: [
    buildVehiclePermnoWithInfoField({
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
    buildVehiclePermnoWithInfoField({
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
    buildRadioField({
      id: 'convoy.items[0].dollyType',
      title: convoy.dollyType.subtitle,
      required: true,
      marginTop: 2,
      options: [
        {
          value: DollyType.NONE,
          label: convoy.dollyType.noneOptionTitle,
        },
        {
          value: DollyType.SINGLE,
          label: convoy.dollyType.singleOptionTitle,
        },
        {
          value: DollyType.DOUBLE,
          label: convoy.dollyType.doubleOptionTitle,
        },
      ],
      width: 'full',
    }),
  ],
})
