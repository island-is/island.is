import {
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { vehicleSpacing } from '../../../lib/messages'
import {
  getConvoyItem,
  getExemptionType,
  checkIfExemptionTypeLongTerm,
  MAX_CNT_CONVOY,
  checkHasDolly,
  checkHasSingleDolly,
  checkHasDoubleDolly,
  checkHasConvoyAtIndex,
  checkHasFreightPairingItemWithExemptionForWeight,
  checkHasAnyConvoyWithTrailer,
  checkIsConvoyWithTrailer,
  checkIfExemptionTypeShortTerm,
} from '../../../utils'
import { Application } from '@island.is/application/types'
import { DollyType } from '../../../shared'

export const vehicleSpacingSection = buildSection({
  id: 'vehicleSpacingSection',
  title: vehicleSpacing.general.sectionTitle,
  condition: (answers) =>
    checkIfExemptionTypeShortTerm(answers) &&
    checkHasAnyConvoyWithTrailer(answers) &&
    checkHasFreightPairingItemWithExemptionForWeight(answers),
  children: [
    buildMultiField({
      id: 'vehicleSpacingMultiField',
      title: vehicleSpacing.general.pageTitle,
      description: vehicleSpacing.general.description,
      children: [
        buildHiddenInput({
          id: `vehicleSpacing.exemptionPeriodType`,
          defaultValue: (application: Application) =>
            getExemptionType(application.answers),
        }),
        buildHiddenInput({
          id: `vehicleSpacing.hasExemptionForWeight`,
          defaultValue: (application: Application) =>
            checkHasFreightPairingItemWithExemptionForWeight(
              application.answers,
            ),
        }),

        // Convoy list
        ...Array(MAX_CNT_CONVOY)
          .fill(null)
          .flatMap((_, convoyIndex) => {
            return [
              buildHiddenInput({
                id: `vehicleSpacing.convoyList.${convoyIndex}.convoyId`,
                defaultValue: (application: Application) =>
                  getConvoyItem(application.answers, convoyIndex)?.convoyId,
                condition: (answers) =>
                  checkHasConvoyAtIndex(answers, convoyIndex),
              }),
              buildHiddenInput({
                id: `vehicleSpacing.convoyList.${convoyIndex}.hasTrailer`,
                defaultValue: (application: Application) =>
                  !!getConvoyItem(application.answers, convoyIndex)?.trailer
                    ?.permno,
                condition: (answers) =>
                  checkHasConvoyAtIndex(answers, convoyIndex),
              }),
              buildHiddenInput({
                id: `vehicleSpacing.convoyList.${convoyIndex}.dollyType`,
                defaultValue: (application: Application) => {
                  if (checkHasSingleDolly(application.answers))
                    return DollyType.SINGLE
                  else if (checkHasDoubleDolly(application.answers))
                    return DollyType.DOUBLE
                  else return DollyType.NONE
                },
                condition: (answers) =>
                  checkHasConvoyAtIndex(answers, convoyIndex),
              }),
              buildDescriptionField({
                id: `vehicleSpacingInfo.convoySubtitle.${convoyIndex}`,
                condition: (answers) =>
                  checkIfExemptionTypeLongTerm(answers) &&
                  checkIsConvoyWithTrailer(answers, convoyIndex),
                title: {
                  ...vehicleSpacing.general.convoySubtitle,
                  values: { convoyNumber: convoyIndex + 1 },
                },
                description: (application) => {
                  const convoyItem = getConvoyItem(
                    application.answers,
                    convoyIndex,
                  )
                  return {
                    ...vehicleSpacing.general.convoyDescription,
                    values: {
                      vehiclePermno: convoyItem?.vehicle.permno,
                      trailerPermno: convoyItem?.trailer?.permno,
                    },
                  }
                },
                titleVariant: 'h5',
              }),
              buildTextField({
                id: `vehicleSpacing.convoyList.${convoyIndex}.vehicleToDollyValue`,
                condition: (answers) =>
                  checkIsConvoyWithTrailer(answers, convoyIndex) &&
                  checkHasDolly(answers),
                title: vehicleSpacing.labels.vehicleToDolly,
                backgroundColor: 'blue',
                width: 'full',
                required: true,
                variant: 'number',
                thousandSeparator: true,
                suffix: vehicleSpacing.labels.metersSuffix,
              }),
              buildTextField({
                id: `vehicleSpacing.convoyList.${convoyIndex}.dollyToTrailerValue`,
                condition: (answers) =>
                  checkIsConvoyWithTrailer(answers, convoyIndex) &&
                  checkHasDolly(answers),
                title: vehicleSpacing.labels.dollyToTrailer,
                backgroundColor: 'blue',
                width: 'full',
                required: true,
                variant: 'number',
                thousandSeparator: true,
                suffix: vehicleSpacing.labels.metersSuffix,
              }),
              buildTextField({
                id: `vehicleSpacing.convoyList.${convoyIndex}.vehicleToTrailerValue`,
                condition: (answers) =>
                  checkIsConvoyWithTrailer(answers, convoyIndex) &&
                  !checkHasDolly(answers),
                title: vehicleSpacing.labels.vehicleToTrailer,
                backgroundColor: 'blue',
                width: 'full',
                required: true,
                variant: 'number',
                thousandSeparator: true,
                suffix: vehicleSpacing.labels.metersSuffix,
              }),
            ]
          }),
      ],
    }),
  ],
})
