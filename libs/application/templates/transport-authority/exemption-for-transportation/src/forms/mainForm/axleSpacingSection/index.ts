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
  getConvoyTrailer,
  getConvoyVehicle,
  getExemptionType,
  MAX_CNT_AXLE,
  MAX_CNT_CONVOY,
  shouldUseSameValuesForTrailer,
  hasFreightItemWithExemptionForWeight,
  checkHasDoubleDolly,
  checkHasSingleDolly,
} from '../../../utils'
import { Application } from '@island.is/application/types'
import { DollyType } from '../../../shared'

export const axleSpacingSection = buildSection({
  id: 'axleSpacingSection',
  title: axleSpacing.general.sectionTitle,
  condition: hasFreightItemWithExemptionForWeight,
  children: [
    buildMultiField({
      id: 'axleSpacingMultiField',
      title: axleSpacing.general.pageTitle,
      description: axleSpacing.general.description,
      children: [
        buildHiddenInput({
          id: `axleSpacing.exemptionPeriodType`,
          defaultValue: (application: Application) => {
            return getExemptionType(application.answers)
          },
        }),
        buildHiddenInput({
          id: `axleSpacing.hasExemptionForWeight`,
          defaultValue: (application: Application) => {
            return hasFreightItemWithExemptionForWeight(application.answers)
          },
        }),

        // Vehicle list
        ...Array(MAX_CNT_CONVOY)
          .fill(null)
          .flatMap((_, vehicleIndex) => {
            return [
              buildDescriptionField({
                id: `axleSpacingInfo.vehicleSubtitle.${vehicleIndex}`,
                condition: (answers) => {
                  const vehicle = getConvoyVehicle(answers, vehicleIndex)
                  const hasVehicle = !!vehicle?.permno
                  return hasVehicle
                },
                title: (application) => {
                  const vehicle = getConvoyVehicle(
                    application.answers,
                    vehicleIndex,
                  )
                  return {
                    ...axleSpacing.general.vehicleSubtitle,
                    values: { vehiclePermno: vehicle?.permno },
                  }
                },
                description: (application) => {
                  const vehicle = getConvoyVehicle(
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
                condition: (answers) => {
                  const vehicle = getConvoyVehicle(answers, vehicleIndex)
                  const hasVehicle = !!vehicle?.permno
                  return hasVehicle
                },
                defaultValue: (application: Application) => {
                  const vehicle = getConvoyVehicle(
                    application.answers,
                    vehicleIndex,
                  )
                  return vehicle?.permno
                },
              }),
              ...Array(MAX_CNT_AXLE)
                .fill(null)
                .flatMap((_, axleIndex) => {
                  return [
                    buildTextField({
                      id: `axleSpacing.vehicleList.${vehicleIndex}.values.${axleIndex}`,
                      condition: (answers) => {
                        const vehicle = getConvoyVehicle(answers, vehicleIndex)
                        const numberOfAxles = vehicle?.numberOfAxles || 0
                        const hasVehicle = !!vehicle?.permno
                        return axleIndex < numberOfAxles - 1 && hasVehicle
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
          suffix: axleSpacing.labels.metersSuffix,
        }),

        // Trailer list
        ...Array(MAX_CNT_CONVOY)
          .fill(null)
          .flatMap((_, trailerIndex) => {
            return [
              buildDescriptionField({
                id: `axleSpacingInfo.trailerSubtitle.${trailerIndex}`,
                condition: (answers) => {
                  const trailer = getConvoyTrailer(answers, trailerIndex)
                  const hasTrailer = !!trailer?.permno
                  return hasTrailer
                },
                title: (application) => {
                  const trailer = getConvoyTrailer(
                    application.answers,
                    trailerIndex,
                  )
                  return {
                    ...axleSpacing.general.trailerSubtitle,
                    values: { trailerPermno: trailer?.permno },
                  }
                },
                description: (application) => {
                  const trailer = getConvoyTrailer(
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
                condition: (answers) => {
                  const trailer = getConvoyTrailer(answers, trailerIndex)
                  const hasTrailer = !!trailer?.permno
                  return hasTrailer
                },
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
                condition: (answers) => {
                  const trailer = getConvoyTrailer(answers, trailerIndex)
                  const hasTrailer = !!trailer?.permno
                  return hasTrailer
                },
                defaultValue: (application: Application) => {
                  const trailer = getConvoyTrailer(
                    application.answers,
                    trailerIndex,
                  )
                  return trailer?.permno
                },
              }),
              ...Array(MAX_CNT_AXLE)
                .fill(null)
                .flatMap((_, axleIndex) => {
                  return [
                    buildTextField({
                      id: `axleSpacing.trailerList.${trailerIndex}.values.${axleIndex}`,
                      condition: (answers) => {
                        const trailer = getConvoyTrailer(answers, trailerIndex)
                        const numberOfAxles = trailer?.numberOfAxles || 0
                        const hasTrailer = !!trailer?.permno
                        return (
                          axleIndex < numberOfAxles - 1 &&
                          hasTrailer &&
                          !shouldUseSameValuesForTrailer(answers, trailerIndex)
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
                      suffix: axleSpacing.labels.metersSuffix,
                    }),
                  ]
                }),
              buildTextField({
                id: `axleSpacing.trailerList.${trailerIndex}.singleValue`,
                condition: (answers) => {
                  const trailer = getConvoyTrailer(answers, trailerIndex)
                  const hasTrailer = !!trailer?.permno
                  return (
                    hasTrailer &&
                    shouldUseSameValuesForTrailer(answers, trailerIndex)
                  )
                },
                title: axleSpacing.labels.axleSpaceAll,
                backgroundColor: 'blue',
                width: 'full',
                required: true,
                variant: 'number',
                suffix: axleSpacing.labels.metersSuffix,
              }),
              buildHiddenInput({
                id: `axleSpacing.trailerList.${trailerIndex}.axleCount`,
                condition: (answers) => {
                  const trailer = getConvoyTrailer(answers, trailerIndex)
                  const hasTrailer = !!trailer?.permno
                  return (
                    hasTrailer &&
                    shouldUseSameValuesForTrailer(answers, trailerIndex)
                  )
                },
                defaultValue: (application: Application) => {
                  const trailer = getConvoyTrailer(
                    application.answers,
                    trailerIndex,
                  )
                  return trailer?.numberOfAxles || 0
                },
              }),
            ]
          }),
      ],
    }),
  ],
})
