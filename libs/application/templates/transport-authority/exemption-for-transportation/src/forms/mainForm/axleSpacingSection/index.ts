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
  getExemptionType,
  getFreightItems,
  isExemptionTypeShortTerm,
  MAX_CNT_AXLE,
  shouldUseSameSpacingForTrailer,
} from '../../../utils'
import { DollyType, ExemptionFor } from '../../../shared'
import { Application } from '@island.is/application/types'

//TODOx repeat per convoy
const convoyIndex = 0

export const axleSpacingSection = buildSection({
  id: 'axleSpacingSection',
  title: axleSpacing.general.sectionTitle,
  condition: (answers) => {
    const freightItems = getFreightItems(answers)
    return freightItems.some((item) =>
      item.exemptionFor?.includes(ExemptionFor.WEIGHT),
    )
  },
  children: [
    buildMultiField({
      id: 'axleSpacingMultiField',
      title: axleSpacing.general.pageTitle,
      description: axleSpacing.general.description,
      children: [
        buildHiddenInput({
          id: `axleSpacing.${convoyIndex}.exemptionPeriodType`,
          defaultValue: (application: Application) => {
            return getExemptionType(application.answers)
          },
        }),
        buildHiddenInput({
          id: `axleSpacing.${convoyIndex}.dollyType`,
          defaultValue: (application: Application) => {
            const convoyItem = getConvoyItem(application.answers, convoyIndex)
            return convoyItem?.dollyType
          },
        }),
        buildHiddenInput({
          id: `axleSpacing.${convoyIndex}.convoyId`,
          defaultValue: (application: Application) => {
            const convoyItem = getConvoyItem(application.answers, convoyIndex)
            return convoyItem?.convoyId
          },
        }),

        // Vehicle
        buildDescriptionField({
          id: `axleSpacingInfo.vehicleSubtitle.${convoyIndex}`,
          title: (application) => {
            const convoyItem = getConvoyItem(application.answers, convoyIndex)
            return {
              ...axleSpacing.general.vehicleSubtitle,
              values: { vehiclePermno: convoyItem?.vehicle.permno },
            }
          },
          description: (application) => {
            const convoyItem = getConvoyItem(application.answers, convoyIndex)
            return {
              ...axleSpacing.labels.numberOfAxles,
              values: { numberOfAxles: convoyItem?.vehicle.numberOfAxles },
            }
          },
          titleVariant: 'h5',
        }),
        ...Array(MAX_CNT_AXLE)
          .fill(null)
          .flatMap((_, axleIndex) => {
            return [
              buildTextField({
                id: `axleSpacing.${convoyIndex}.vehicle.${axleIndex}`,
                condition: (answers) => {
                  const convoyItem = getConvoyItem(answers, convoyIndex)
                  const numberOfAxles = convoyItem?.vehicle?.numberOfAxles || 0
                  return axleIndex < numberOfAxles - 1
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

        // Double dolly (if applies)
        // Note: No axle space if single dolly / no dolly
        buildDescriptionField({
          id: `axleSpacingInfo.dollySubtitle.${convoyIndex}`,
          condition: (answers) => {
            if (!isExemptionTypeShortTerm(answers)) return false

            const convoyItem = getConvoyItem(answers, convoyIndex)
            return convoyItem?.dollyType === DollyType.DOUBLE
          },
          title: axleSpacing.general.doubleDollySubtitle,
          description: {
            ...axleSpacing.labels.numberOfAxles,
            values: { numberOfAxles: 2 },
          },
          titleVariant: 'h5',
        }),
        buildTextField({
          id: `axleSpacing.${convoyIndex}.dolly.0`,
          condition: (answers) => {
            if (!isExemptionTypeShortTerm(answers)) return false

            const convoyItem = getConvoyItem(answers, convoyIndex)
            return convoyItem?.dollyType === DollyType.DOUBLE
          },
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: { axleNumberFrom: 1, axleNumberTo: 2 },
          },
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          suffix: axleSpacing.labels.metersSuffix,
        }),

        // Trailer
        buildDescriptionField({
          id: `axleSpacingInfo.trailerSubtitle.${convoyIndex}`,
          condition: (answers) => {
            const convoyItem = getConvoyItem(answers, convoyIndex)
            const hasTrailer = !!convoyItem?.trailer?.permno
            return hasTrailer
          },
          title: (application) => {
            const convoyItem = getConvoyItem(application.answers, convoyIndex)
            return {
              ...axleSpacing.general.trailerSubtitle,
              values: { trailerPermno: convoyItem?.trailer?.permno },
            }
          },
          description: (application) => {
            const convoyItem = getConvoyItem(application.answers, convoyIndex)
            return {
              ...axleSpacing.labels.numberOfAxles,
              values: { numberOfAxles: convoyItem?.trailer?.numberOfAxles },
            }
          },
          titleVariant: 'h5',
        }),
        buildCheckboxField({
          id: `axleSpacing.${convoyIndex}.useSameSpacingForTrailer`,
          condition: (answers) => {
            const convoyItem = getConvoyItem(answers, convoyIndex)
            const hasTrailer = !!convoyItem?.trailer?.permno
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

        ...Array(MAX_CNT_AXLE)
          .fill(null)
          .flatMap((_, axleIndex) => {
            return [
              buildTextField({
                id: `axleSpacing.${convoyIndex}.trailer.${axleIndex}`,
                condition: (answers) => {
                  const convoyItem = getConvoyItem(answers, convoyIndex)
                  const numberOfAxles = convoyItem?.trailer?.numberOfAxles || 0
                  const hasTrailer = !!convoyItem?.trailer?.permno
                  return (
                    axleIndex < numberOfAxles - 1 &&
                    hasTrailer &&
                    !shouldUseSameSpacingForTrailer(answers, convoyIndex)
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
          id: `axleSpacing.${convoyIndex}.trailer.0`,
          condition: (answers) => {
            const convoyItem = getConvoyItem(answers, convoyIndex)
            const hasTrailer = !!convoyItem?.trailer?.permno
            return (
              hasTrailer && shouldUseSameSpacingForTrailer(answers, convoyIndex)
            )
          },
          title: axleSpacing.labels.axleSpaceAll,
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          suffix: axleSpacing.labels.metersSuffix,
        }),
      ],
    }),
  ],
})
