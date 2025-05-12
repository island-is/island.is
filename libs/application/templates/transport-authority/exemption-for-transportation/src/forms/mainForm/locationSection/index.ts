import {
  buildDescriptionField,
  buildFileUploadField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
} from '@island.is/application/core'
import { location } from '../../../lib/messages'
import {
  EXEMPTION_REGIONS,
  FILE_SIZE_LIMIT,
  FILE_TYPES_ALLOWED,
  getExemptionType,
  isExemptionTypeLongTerm,
  isExemptionTypeShortTerm,
} from '../../../utils'
import { ExemptionType } from '../../../shared'
import { Application } from '@island.is/application/types'

export const locationSection = buildSection({
  id: 'locationSection',
  title: (application: Application) => {
    return isExemptionTypeShortTerm(application.answers)
      ? location.general.sectionTitleShortTerm
      : location.general.sectionTitleLongTerm
  },
  children: [
    buildMultiField({
      id: 'locationMultiField',
      title: (application: Application) => {
        return getExemptionType(application.answers) ===
          ExemptionType.SHORT_TERM
          ? location.general.pageTitleShortTerm
          : location.general.pageTitleLongTerm
      },
      children: [
        buildHiddenInput({
          id: 'location.exemptionPeriodType',
          defaultValue: (application: Application) => {
            return getExemptionType(application.answers)
          },
        }),

        // Short term exemption:
        // Location from
        buildDescriptionField({
          id: 'location.shortTerm.fromSubtitle',
          title: location.shortTerm.fromSubtitle,
          titleVariant: 'h5',
          condition: (answers) => {
            return isExemptionTypeShortTerm(answers)
          },
        }),
        buildTextField({
          id: 'location.shortTerm.addressFrom',
          title: location.shortTerm.addressFrom,
          width: 'half',
          required: true,
          condition: (answers) => {
            return isExemptionTypeShortTerm(answers)
          },
        }),
        buildTextField({
          id: 'location.shortTerm.postalCodeAndCityFrom',
          title: location.shortTerm.postalCodeAndCityFrom,
          width: 'half',
          required: true,
          condition: (answers) => {
            return isExemptionTypeShortTerm(answers)
          },
        }),

        // Location to
        buildDescriptionField({
          id: 'location.shortTerm.toSubtitle',
          title: location.shortTerm.toSubtitle,
          titleVariant: 'h5',
          condition: (answers) => {
            return isExemptionTypeShortTerm(answers)
          },
        }),
        buildTextField({
          id: 'location.shortTerm.addressTo',
          title: location.shortTerm.addressTo,
          width: 'half',
          required: true,
          condition: (answers) => {
            return isExemptionTypeShortTerm(answers)
          },
        }),
        buildTextField({
          id: 'location.shortTerm.postalCodeAndCityTo',
          title: location.shortTerm.postalCodeAndCityTo,
          width: 'half',
          required: true,
          condition: (answers) => {
            return isExemptionTypeShortTerm(answers)
          },
        }),

        // Directions
        buildTextField({
          id: 'location.shortTerm.directions',
          variant: 'textarea',
          required: true,
          rows: 5,
          title: location.shortTerm.directions,
          placeholder: location.shortTerm.directionsPlaceholder,
          condition: (answers) => {
            return isExemptionTypeShortTerm(answers)
          },
        }),

        // Long term exemption:
        // Regions
        buildDescriptionField({
          id: 'location.longTerm.regionsSubtitle',
          title: location.longTerm.regionsSubtitle,
          titleVariant: 'h5',
          condition: (answers) => {
            return isExemptionTypeLongTerm(answers)
          },
        }),
        buildSelectField({
          id: 'location.longTerm.regions',
          title: location.longTerm.regions,
          placeholder: location.longTerm.regionsPlaceholder,
          width: 'full',
          isMulti: true,
          options: () => {
            return EXEMPTION_REGIONS.map((x) => ({ value: x, label: x }))
          },
          condition: (answers) => {
            return isExemptionTypeLongTerm(answers)
          },
        }),

        // Directions
        buildTextField({
          id: 'location.longTerm.directions',
          variant: 'textarea',
          rows: 5,
          title: location.longTerm.directions,
          placeholder: location.longTerm.directionsPlaceholder,
          condition: (answers) => {
            return isExemptionTypeLongTerm(answers)
          },
        }),

        // Location documents
        buildFileUploadField({
          id: 'location.longTerm.files',
          introduction: '',
          uploadAccept: FILE_TYPES_ALLOWED,
          maxSize: FILE_SIZE_LIMIT,
          uploadMultiple: true,
          uploadHeader: location.longTerm.fileUploadHeader,
          uploadDescription: {
            ...location.longTerm.fileUploadDescription,
            values: { allowedTypes: FILE_TYPES_ALLOWED },
          },
          uploadButtonLabel: location.longTerm.fileUploadButtonLabel,
          condition: (answers) => {
            return isExemptionTypeLongTerm(answers)
          },
        }),
      ],
    }),
  ],
})
