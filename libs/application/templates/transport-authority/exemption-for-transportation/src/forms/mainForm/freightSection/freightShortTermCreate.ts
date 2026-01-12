import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import { ExemptionFor } from '../../../shared'
import {
  checkIfExemptionTypeShortTerm,
  getFreightShortTermErrorMessage,
} from '../../../utils'
import { FreightCommonHiddenInputs } from './freightCommonHiddenInputs'
import { Application } from '@island.is/application/types'

// Since there is max 1 freight and 1 convoy in short-term
const freightIndex = 0
const convoyIndex = 0

export const FreightShortTermCreateMultiField = buildMultiField({
  id: 'freightShortTermCreateMultiField',
  condition: checkIfExemptionTypeShortTerm,
  title: freight.create.pageTitle,
  description: freight.create.descriptionShortTerm,
  children: [
    ...FreightCommonHiddenInputs(`freightPairing.${freightIndex}`),
    // Note: We are reusing convoyId as freightId here.
    // This is safe because freight and convoy are separate arrays,
    // and each requires a unique ID within its own context.
    // The overlap doesn't cause issues, and also convoyId isn't sent over to SGS
    buildHiddenInput({
      id: `freight.items.${freightIndex}.freightId`,
      defaultValue: (application: Application) =>
        getValueViaPath<string>(
          application.answers,
          `convoy.items.${convoyIndex}.convoyId`,
        ),
    }),
    buildHiddenInput({
      id: `freightPairing.${freightIndex}.freightId`,
      defaultValue: (application: Application) =>
        getValueViaPath<string>(
          application.answers,
          `convoy.items.${convoyIndex}.convoyId`,
        ),
    }),
    buildHiddenInput({
      id: `freightPairing.${freightIndex}.items.${convoyIndex}.convoyId`,
      defaultValue: (application: Application) =>
        getValueViaPath<string>(
          application.answers,
          `convoy.items.${convoyIndex}.convoyId`,
        ),
    }),
    buildHiddenInput({
      id: `freightPairing.${freightIndex}.convoyIdList`,
      defaultValue: (application: Application) => [
        getValueViaPath<string>(
          application.answers,
          `convoy.items.${convoyIndex}.convoyId`,
        ),
      ],
    }),

    // Exemption for
    buildCheckboxField({
      id: `freightPairing.${freightIndex}.items.${convoyIndex}.exemptionFor`,
      large: true,
      backgroundColor: 'blue',
      width: 'half',
      title: freight.labels.exemptionFor,
      required: true,
      options: [
        {
          value: ExemptionFor.WIDTH,
          label: freight.exemptionFor.widthOptionTitle,
        },
        {
          value: ExemptionFor.HEIGHT,
          label: freight.exemptionFor.heightOptionTitle,
        },
        {
          value: ExemptionFor.LENGTH,
          label: freight.exemptionFor.lengthOptionTitle,
        },
        {
          value: ExemptionFor.WEIGHT,
          label: freight.exemptionFor.weightOptionTitle,
        },
      ],
    }),

    // Freight info
    buildDescriptionField({
      id: 'freight.subtitle',
      title: freight.labels.freightSubtitle,
      titleVariant: 'h5',
    }),
    buildTextField({
      id: `freight.items.${freightIndex}.name`,
      title: freight.labels.freightName,
      backgroundColor: 'blue',
      width: 'full',
      maxLength: 100,
      required: true,
    }),
    buildTextField({
      id: `freightPairing.${freightIndex}.length`,
      title: freight.labels.freightLength,
      backgroundColor: 'blue',
      width: 'half',
      required: true,
      variant: 'number',
      thousandSeparator: true,
      suffix: freight.labels.metersSuffix,
    }),
    buildTextField({
      id: `freightPairing.${freightIndex}.weight`,
      title: freight.labels.freightWeight,
      backgroundColor: 'blue',
      width: 'half',
      required: true,
      variant: 'number',
      thousandSeparator: true,
      suffix: freight.labels.tonsSuffix,
    }),
    buildTextField({
      id: `freightPairing.${freightIndex}.items.${convoyIndex}.height`,
      title: freight.labels.heightWithConvoy,
      backgroundColor: 'blue',
      width: 'half',
      required: true,
      variant: 'number',
      thousandSeparator: true,
      suffix: freight.labels.metersSuffix,
    }),
    buildTextField({
      id: `freightPairing.${freightIndex}.items.${convoyIndex}.width`,
      title: freight.labels.widthWithConvoy,
      backgroundColor: 'blue',
      width: 'half',
      required: true,
      variant: 'number',
      thousandSeparator: true,
      suffix: freight.labels.metersSuffix,
    }),
    buildTextField({
      id: `freightPairing.${freightIndex}.items.${convoyIndex}.totalLength`,
      title: freight.labels.totalLengthWithConvoy,
      backgroundColor: 'blue',
      width: 'full',
      required: true,
      variant: 'number',
      thousandSeparator: true,
      suffix: freight.labels.metersSuffix,
    }),
    buildAlertMessageField({
      id: 'freightShortTermPoliceEscortAlertMessage',
      alertType: 'info',
      title: freight.create.policeEscortAlertTitle,
      message: (application) =>
        getFreightShortTermErrorMessage(
          application.externalData,
          application.answers,
          freightIndex,
          convoyIndex,
        ) || '',
      condition: (answers, externalData) =>
        !!getFreightShortTermErrorMessage(
          externalData,
          answers,
          freightIndex,
          convoyIndex,
        ),
    }),
    buildCustomField({
      component: 'HandleBeforeSubmitFreight',
      id: 'handleBeforeSubmitFreight',
      description: '',
    }),
  ],
})
