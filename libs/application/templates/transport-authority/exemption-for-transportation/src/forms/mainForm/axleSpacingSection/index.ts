import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { axleSpacing } from '../../../lib/messages'
import { getConvoyItem } from '../../../utils'
import { DollyType } from '../../../shared'

const convoyIndex = 0
const axleSubIndex0 = 0
const axleSubIndex1 = 1
const axleSubIndex2 = 2
const axleSubIndex3 = 3
const axleSubIndex4 = 4

export const axleSpacingSection = buildSection({
  id: 'axleSpacingSection',
  title: axleSpacing.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'axleSpacingMultiField',
      title: axleSpacing.general.pageTitle,
      description: axleSpacing.general.description,
      children: [
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
        //TODOx repeat per axle
        buildTextField({
          id: `axleSpacing.${convoyIndex}.vehicle.${axleSubIndex0}`,
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: {
              axleNumberFrom: axleSubIndex0 + 1,
              axleNumberTo: axleSubIndex0 + 2,
            },
          },
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          suffix: axleSpacing.labels.metersSuffix,
        }),
        buildTextField({
          id: `axleSpacing.${convoyIndex}.vehicle.${axleSubIndex1}`,
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: {
              axleNumberFrom: axleSubIndex1 + 1,
              axleNumberTo: axleSubIndex1 + 2,
            },
          },
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          suffix: axleSpacing.labels.metersSuffix,
        }),
        buildTextField({
          id: `axleSpacing.${convoyIndex}.vehicle.${axleSubIndex2}`,
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: {
              axleNumberFrom: axleSubIndex2 + 1,
              axleNumberTo: axleSubIndex2 + 2,
            },
          },
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          suffix: axleSpacing.labels.metersSuffix,
        }),
        buildTextField({
          id: `axleSpacing.${convoyIndex}.vehicle.${axleSubIndex3}`,
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: {
              axleNumberFrom: axleSubIndex3 + 1,
              axleNumberTo: axleSubIndex3 + 2,
            },
          },
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          suffix: axleSpacing.labels.metersSuffix,
        }),
        buildTextField({
          id: `axleSpacing.${convoyIndex}.vehicle.${axleSubIndex4}`,
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: {
              axleNumberFrom: axleSubIndex4 + 1,
              axleNumberTo: axleSubIndex4 + 2,
            },
          },
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          suffix: axleSpacing.labels.metersSuffix,
        }),

        // Double dolly (if applies)
        // Note: No axle space if single dolly / no dolly
        buildDescriptionField({
          id: `axleSpacingInfo.dollySubtitle.${convoyIndex}`,
          condition: (answers) => {
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
        //TODOx condition if trailer included
        buildDescriptionField({
          id: `axleSpacingInfo.trailerSubtitle.${convoyIndex}`,
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
        //TODOx checkbox if should be same value for all
        //TODOx repeat per axle
        buildTextField({
          id: `axleSpacing.${convoyIndex}.trailer.${axleSubIndex0}`,
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: {
              axleNumberFrom: axleSubIndex0 + 1,
              axleNumberTo: axleSubIndex0 + 2,
            },
          },
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          suffix: axleSpacing.labels.metersSuffix,
        }),
        buildTextField({
          id: `axleSpacing.${convoyIndex}.trailer.${axleSubIndex1}`,
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: {
              axleNumberFrom: axleSubIndex1 + 1,
              axleNumberTo: axleSubIndex1 + 2,
            },
          },
          backgroundColor: 'blue',
          width: 'full',
          required: true,
          variant: 'number',
          suffix: axleSpacing.labels.metersSuffix,
        }),
        buildTextField({
          id: `axleSpacing.${convoyIndex}.trailer.${axleSubIndex2}`,
          title: {
            ...axleSpacing.labels.axleSpaceFromTo,
            values: {
              axleNumberFrom: axleSubIndex2 + 1,
              axleNumberTo: axleSubIndex2 + 2,
            },
          },
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
