import {
  buildVehiclePermnoWithInfoField,
  buildMultiField,
  buildRadioField,
  buildHiddenInput,
  buildCustomField,
} from '@island.is/application/core'
import { convoy } from '../../../lib/messages'
import {
  getRandomId,
  checkIfExemptionTypeShortTerm,
  loadValidation,
  checkIsConvoyWithTrailer,
} from '../../../utils'
import { DollyType } from '../../../shared'

// Since there is max 1 convoy in short-term
const convoyIndex = 0

export const ConvoyShortTermMultiField = buildMultiField({
  id: 'convoyShortTermMultiField',
  condition: checkIfExemptionTypeShortTerm,
  title: convoy.general.pageTitle,
  description: convoy.general.descriptionShortTerm,
  children: [
    buildHiddenInput({
      id: `convoy.items.${convoyIndex}.convoyId`,
      defaultValue: () => getRandomId(),
    }),
    buildVehiclePermnoWithInfoField({
      id: `convoy.items.${convoyIndex}.vehicle`,
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
      id: `convoy.items.${convoyIndex}.trailer`,
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
      id: `convoy.items.${convoyIndex}.dollyType`,
      condition: (answers) => checkIsConvoyWithTrailer(answers, convoyIndex),
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
    buildHiddenInput({
      id: `convoy.items.${convoyIndex}.dollyType`,
      condition: (answers) => !checkIsConvoyWithTrailer(answers, convoyIndex),
      defaultValue: DollyType.NONE,
    }),
    buildCustomField({
      component: 'HandleBeforeSubmitConvoy',
      id: 'handleBeforeSubmitConvoy',
      description: '',
    }),
  ],
})
