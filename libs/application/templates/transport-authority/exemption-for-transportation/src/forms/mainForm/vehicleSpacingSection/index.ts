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
  hasFreightItemWithExemptionForWeight,
  hasConvoyItemWithTrailer,
  checkHasDolly,
  checkHasTrailer,
  checkHasSingleDolly,
  checkHasDoubleDolly,
} from '../../../utils'
import { Application } from '@island.is/application/types'
import { DollyType } from '../../../shared'

export const vehicleSpacingSection = buildSection({
  id: 'vehicleSpacingSection',
  title: vehicleSpacing.general.sectionTitle,
  condition: (answers) => {
    const hasTrailer = hasConvoyItemWithTrailer(answers)
    const hasExemptionForWeight = hasFreightItemWithExemptionForWeight(answers)
    return hasTrailer && hasExemptionForWeight
  },
  children: [
    buildMultiField({
      id: 'vehicleSpacingMultiField',
      title: vehicleSpacing.general.pageTitle,
      description: vehicleSpacing.general.description,
      children: [
        buildHiddenInput({
          id: `vehicleSpacing.exemptionPeriodType`,
          defaultValue: (application: Application) => {
            return getExemptionType(application.answers)
          },
        }),
        buildHiddenInput({
          id: `vehicleSpacing.hasExemptionForWeight`,
          defaultValue: (application: Application) => {
            return hasFreightItemWithExemptionForWeight(application.answers)
          },
        }),

        ...Array(MAX_CNT_CONVOY)
          .fill(null)
          .flatMap((_, convoyIndex) => {
            return [
              buildHiddenInput({
                id: `vehicleSpacing.convoyList.${convoyIndex}.convoyId`,
                defaultValue: (application: Application) => {
                  const convoyItem = getConvoyItem(
                    application.answers,
                    convoyIndex,
                  )
                  return convoyItem?.convoyId
                },
                condition: (answers) => {
                  const convoyItem = getConvoyItem(answers, convoyIndex)
                  return !!convoyItem
                },
              }),
              buildHiddenInput({
                id: `vehicleSpacing.convoyList.${convoyIndex}.hasTrailer`,
                defaultValue: (application: Application) => {
                  const convoyItem = getConvoyItem(
                    application.answers,
                    convoyIndex,
                  )
                  return !!convoyItem?.trailer?.permno
                },
                condition: (answers) => {
                  const convoyItem = getConvoyItem(answers, convoyIndex)
                  return !!convoyItem
                },
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
                condition: (answers) => {
                  const convoyItem = getConvoyItem(answers, convoyIndex)
                  return !!convoyItem
                },
              }),
              buildDescriptionField({
                id: `vehicleSpacingInfo.convoySubtitle.${convoyIndex}`,
                condition: (answers) => {
                  const isExemptionTypeLongTerm =
                    checkIfExemptionTypeLongTerm(answers)
                  const convoyItem = getConvoyItem(answers, convoyIndex)
                  const hasTrailer = !!convoyItem?.trailer?.permno
                  return hasTrailer && isExemptionTypeLongTerm
                },
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
                condition: (answers) => checkHasDolly(answers),
                title: vehicleSpacing.labels.vehicleToDolly,
                backgroundColor: 'blue',
                width: 'full',
                required: true,
                variant: 'number',
                suffix: vehicleSpacing.labels.metersSuffix,
              }),
              buildTextField({
                id: `vehicleSpacing.convoyList.${convoyIndex}.dollyToTrailerValue`,
                condition: (answers) => checkHasDolly(answers),
                title: vehicleSpacing.labels.dollyToTrailer,
                backgroundColor: 'blue',
                width: 'full',
                required: true,
                variant: 'number',
                suffix: vehicleSpacing.labels.metersSuffix,
              }),
              buildTextField({
                id: `vehicleSpacing.convoyList.${convoyIndex}.vehicleToTrailerValue`,
                condition: (answers) =>
                  !checkHasDolly(answers) &&
                  checkHasTrailer(answers, convoyIndex),
                title: vehicleSpacing.labels.vehicleToTrailer,
                backgroundColor: 'blue',
                width: 'full',
                required: true,
                variant: 'number',
                suffix: vehicleSpacing.labels.metersSuffix,
              }),
            ]
          }),
      ],
    }),
  ],
})
