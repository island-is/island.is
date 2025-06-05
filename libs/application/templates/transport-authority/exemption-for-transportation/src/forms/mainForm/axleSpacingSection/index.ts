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
  getConvoyItem,
  getConvoyTrailer,
  getConvoyVehicle,
  getExemptionType,
  getFreightItems,
  getFreightPairingItems,
  isExemptionTypeLongTerm,
  isExemptionTypeShortTerm,
  MAX_CNT_AXLE,
  MAX_CNT_CONVOY,
  shouldUseSameValuesForTrailer,
} from '../../../utils'
import { DollyType, ExemptionFor } from '../../../shared'
import { Application } from '@island.is/application/types'

// Note: Since dolly is only allowed in short-term, then there is only one convoy
const convoyIndexForDolly = 0
// Note: We can have max double dolly, which means only one axle spacing required to input, but keeping this as array in case we allow triple dolly in the future
const dollyAxleIndex = 0

export const axleSpacingSection = buildSection({
  id: 'axleSpacingSection',
  title: axleSpacing.general.sectionTitle,
  condition: (answers) => {
    if (isExemptionTypeShortTerm(answers)) {
      const freightItems = getFreightItems(answers)
      return freightItems.some((item) =>
        item.exemptionFor?.includes(ExemptionFor.WEIGHT),
      )
    } else if (isExemptionTypeLongTerm(answers)) {
      const freightPairingAllItems = getFreightPairingItems(answers)
      return freightPairingAllItems.some((item) =>
        item?.exemptionFor?.includes(ExemptionFor.WEIGHT),
      )
    }
    return false
  },
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
          condition: (answers) => {
            if (!isExemptionTypeShortTerm(answers)) return false

            const convoyItem = getConvoyItem(answers, convoyIndexForDolly)
            return convoyItem?.dollyType === DollyType.DOUBLE
          },
          title: axleSpacing.general.doubleDollySubtitle,
          description: axleSpacing.labels.numberOfAxlesDoubleDolly,
          titleVariant: 'h5',
        }),
        buildHiddenInput({
          id: `axleSpacing.dolly.type`,
          defaultValue: (application: Application) => {
            const convoyItem = getConvoyItem(
              application.answers,
              convoyIndexForDolly,
            )
            return convoyItem?.dollyType
          },
        }),
        buildTextField({
          id: `axleSpacing.dolly.values.${dollyAxleIndex}`,
          condition: (answers) => {
            if (!isExemptionTypeShortTerm(answers)) return false

            const convoyItem = getConvoyItem(answers, convoyIndexForDolly)
            return convoyItem?.dollyType === DollyType.DOUBLE
          },
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: {
              axleNumberFrom: dollyAxleIndex + 1,
              axleNumberTo: dollyAxleIndex + 2,
            },
          },
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
            ]
          }),
      ],
    }),
  ],
})
