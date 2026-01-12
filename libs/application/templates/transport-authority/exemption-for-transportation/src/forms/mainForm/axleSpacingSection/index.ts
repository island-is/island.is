import {
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { axleSpacing } from '../../../lib/messages'
import {
  getConvoyTrailerForSpacing,
  getConvoyVehicleForSpacing,
  getExemptionType,
  MAX_CNT_AXLE,
  MAX_CNT_CONVOY,
  shouldUseSameValuesForTrailer,
  checkHasDoubleDolly,
  checkHasSingleDolly,
  checkHasFreightPairingItemWithExemptionForWeight,
  checkHasConvoyVehicleForSpacingAtIndex,
  checkHasConvoyTrailerForSpacingAtIndex,
  checkIfExemptionTypeShortTerm,
} from '../../../utils'
import { Application } from '@island.is/application/types'
import { DollyType } from '../../../shared'

export const axleSpacingSection = buildSection({
  id: 'axleSpacingSection',
  title: axleSpacing.general.sectionTitle,
  condition: (answers) =>
    checkIfExemptionTypeShortTerm(answers) &&
    checkHasFreightPairingItemWithExemptionForWeight(answers),
  children: [
    buildMultiField({
      id: 'axleSpacingMultiField',
      title: axleSpacing.general.pageTitle,
      description: axleSpacing.general.description,
      children: [
        buildHiddenInput({
          id: `axleSpacing.exemptionPeriodType`,
          defaultValue: (application: Application) =>
            getExemptionType(application.answers),
        }),
        buildHiddenInput({
          id: `axleSpacing.hasExemptionForWeight`,
          defaultValue: (application: Application) =>
            checkHasFreightPairingItemWithExemptionForWeight(
              application.answers,
            ),
        }),

        // Vehicle list
        ...Array(MAX_CNT_CONVOY)
          .fill(null)
          .flatMap((_, vehicleIndex) => {
            return [
              buildDescriptionField({
                id: `axleSpacingInfo.vehicleSubtitle.${vehicleIndex}`,
                condition: (answers) =>
                  checkHasConvoyVehicleForSpacingAtIndex(answers, vehicleIndex),
                title: (application) => {
                  const vehicle = getConvoyVehicleForSpacing(
                    application.answers,
                    vehicleIndex,
                  )
                  return {
                    ...axleSpacing.general.vehicleSubtitle,
                    values: { vehiclePermno: vehicle?.permno },
                  }
                },
                description: (application) => {
                  const vehicle = getConvoyVehicleForSpacing(
                    application.answers,
                    vehicleIndex,
                  )
                  return {
                    ...axleSpacing.labels.numberOfAxles,
                    values: { numberOfAxles: vehicle?.numberOfAxles },
                  }
                },
                titleVariant: 'h5',
              }),
              buildHiddenInput({
                id: `axleSpacing.vehicleList.${vehicleIndex}.permno`,
                condition: (answers) =>
                  checkHasConvoyVehicleForSpacingAtIndex(answers, vehicleIndex),
                defaultValue: (application: Application) =>
                  getConvoyVehicleForSpacing(application.answers, vehicleIndex)
                    ?.permno,
              }),

              // Vehicle axle list
              ...Array(MAX_CNT_AXLE)
                .fill(null)
                .flatMap((_, axleIndex) => {
                  return [
                    buildTextField({
                      id: `axleSpacing.vehicleList.${vehicleIndex}.values.${axleIndex}`,
                      condition: (answers) => {
                        const numberOfAxles =
                          getConvoyVehicleForSpacing(answers, vehicleIndex)
                            ?.numberOfAxles || 0
                        return (
                          checkHasConvoyVehicleForSpacingAtIndex(
                            answers,
                            vehicleIndex,
                          ) && axleIndex < numberOfAxles - 1
                        )
                      },
                      title: {
                        ...axleSpacing.labels.axleSpaceFromTo,
                        values: {
                          axleNumberFrom: axleIndex + 1,
                          axleNumberTo: axleIndex + 2,
                        },
                      },
                      backgroundColor: 'blue',
                      width: 'full',
                      required: true,
                      variant: 'number',
                      thousandSeparator: true,
                      suffix: axleSpacing.labels.metersSuffix,
                    }),
                  ]
                }),
            ]
          }),

        // Double dolly (if applies)
        // Note: No axle space if single dolly / no dolly
        buildDescriptionField({
          id: `axleSpacingInfo.dollySubtitle`,
          condition: checkHasDoubleDolly,
          title: axleSpacing.general.doubleDollySubtitle,
          description: axleSpacing.labels.numberOfAxlesDoubleDolly,
          titleVariant: 'h5',
        }),
        buildHiddenInput({
          id: `axleSpacing.dolly.type`,
          defaultValue: (application: Application) => {
            if (checkHasSingleDolly(application.answers))
              return DollyType.SINGLE
            else if (checkHasDoubleDolly(application.answers))
              return DollyType.DOUBLE
            else return DollyType.NONE
          },
        }),
        buildTextField({
          id: `axleSpacing.dolly.value`,
          condition: checkHasDoubleDolly,
          title: axleSpacing.labels.axleSpaceAll,
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          thousandSeparator: true,
          suffix: axleSpacing.labels.metersSuffix,
        }),

        // Trailer list
        ...Array(MAX_CNT_CONVOY)
          .fill(null)
          .flatMap((_, trailerIndex) => {
            return [
              buildDescriptionField({
                id: `axleSpacingInfo.trailerSubtitle.${trailerIndex}`,
                condition: (answers) =>
                  checkHasConvoyTrailerForSpacingAtIndex(answers, trailerIndex),
                title: (application) => {
                  const trailer = getConvoyTrailerForSpacing(
                    application.answers,
                    trailerIndex,
                  )
                  return {
                    ...axleSpacing.general.trailerSubtitle,
                    values: { trailerPermno: trailer?.permno },
                  }
                },
                description: (application) => {
                  const trailer = getConvoyTrailerForSpacing(
                    application.answers,
                    trailerIndex,
                  )
                  return {
                    ...axleSpacing.labels.numberOfAxles,
                    values: { numberOfAxles: trailer?.numberOfAxles },
                  }
                },
                titleVariant: 'h5',
              }),
              buildCheckboxField({
                id: `axleSpacing.trailerList.${trailerIndex}.useSameValues`,
                condition: (answers) =>
                  checkHasConvoyTrailerForSpacingAtIndex(answers, trailerIndex),
                large: false,
                backgroundColor: 'white',
                options: [
                  {
                    value: YES,
                    label: axleSpacing.labels.useSameSpacing,
                  },
                ],
                defaultValue: [],
                marginBottom: 0,
              }),
              buildHiddenInput({
                id: `axleSpacing.trailerList.${trailerIndex}.permno`,
                condition: (answers) =>
                  checkHasConvoyTrailerForSpacingAtIndex(answers, trailerIndex),
                defaultValue: (application: Application) =>
                  getConvoyTrailerForSpacing(application.answers, trailerIndex)
                    ?.permno,
              }),

              // Trailer axle list
              ...Array(MAX_CNT_AXLE)
                .fill(null)
                .flatMap((_, axleIndex) => {
                  return [
                    buildTextField({
                      id: `axleSpacing.trailerList.${trailerIndex}.values.${axleIndex}`,
                      condition: (answers) => {
                        const numberOfAxles =
                          getConvoyTrailerForSpacing(answers, trailerIndex)
                            ?.numberOfAxles || 0
                        return (
                          checkHasConvoyTrailerForSpacingAtIndex(
                            answers,
                            trailerIndex,
                          ) &&
                          !shouldUseSameValuesForTrailer(
                            answers,
                            trailerIndex,
                          ) &&
                          axleIndex < numberOfAxles - 1
                        )
                      },
                      title: {
                        ...axleSpacing.labels.axleSpaceFromTo,
                        values: {
                          axleNumberFrom: axleIndex + 1,
                          axleNumberTo: axleIndex + 2,
                        },
                      },
                      backgroundColor: 'blue',
                      width: 'full',
                      required: true,
                      variant: 'number',
                      thousandSeparator: true,
                      suffix: axleSpacing.labels.metersSuffix,
                    }),
                  ]
                }),
              buildTextField({
                id: `axleSpacing.trailerList.${trailerIndex}.singleValue`,
                condition: (answers) =>
                  checkHasConvoyTrailerForSpacingAtIndex(
                    answers,
                    trailerIndex,
                  ) && shouldUseSameValuesForTrailer(answers, trailerIndex),
                title: axleSpacing.labels.axleSpaceAll,
                backgroundColor: 'blue',
                width: 'full',
                required: true,
                variant: 'number',
                thousandSeparator: true,
                suffix: axleSpacing.labels.metersSuffix,
              }),
              buildHiddenInput({
                id: `axleSpacing.trailerList.${trailerIndex}.axleCount`,
                condition: (answers) =>
                  checkHasConvoyTrailerForSpacingAtIndex(
                    answers,
                    trailerIndex,
                  ) && shouldUseSameValuesForTrailer(answers, trailerIndex),
                defaultValue: (application: Application) =>
                  getConvoyTrailerForSpacing(application.answers, trailerIndex)
                    ?.numberOfAxles || 0,
              }),
            ]
          }),
      ],
    }),
  ],
})
