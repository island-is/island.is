import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { prepaidOverview } from './overview'

export const prePaidHeirs = buildSection({
  id: 'heirs',
  title: m.heirs,
  children: [
    buildSubSection({
      id: 'heirs',
      title: m.heirsTitlePrePaid,
      children: [
        buildMultiField({
          id: 'heirs',
          title: m.heirsTitlePrePaid,
          description: m.heirsDescriptionPrePaid,
          children: [
            buildDescriptionField({
              id: 'heirs.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'heirs.data',
                doesNotRequireAnswer: false,
                component: 'HeirsRepeater',
              },
              {
                customFields: [
                  {
                    title: m.heirsRelation,
                    id: 'relation',
                  },
                  {
                    title: m.heirsInheritanceRate,
                    id: 'heirsPercentage',
                  },
                  {
                    title: m.taxFreeInheritance,
                    id: 'taxFreeInheritance',
                    readOnly: true,
                    currency: true,
                  },
                  {
                    title: m.taxableInheritance,
                    id: 'taxableInheritance',
                    readOnly: true,
                    currency: true,
                  },
                  {
                    title: m.inheritanceAmount,
                    id: 'inheritance',
                    readOnly: true,
                    currency: true,
                  },
                  {
                    title: m.inheritanceTax,
                    id: 'inheritanceTax',
                    readOnly: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.addHeir,
                sumField: 'heirsPercentage',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'prePaidHeirsAdditionalInfo',
      title: m.heirAdditionalInfo,
      children: [
        buildMultiField({
          id: 'prePaidHeirsAdditionalInfo',
          title: m.heirAdditionalInfo,
          description: m.heirAdditionalInfoDescription,
          children: [
            buildDescriptionField({
              id: 'heirsAdditionalInfoFiles',
              title: m.info,
              titleVariant: 'h5',
              marginBottom: 'smallGutter',
            }),
            buildTextField({
              id: 'heirsAdditionalInfo',
              title: '',
              placeholder: m.infoPlaceholder,
              variant: 'textarea',
              rows: 4,
              maxLength: 1800,
            }),
            buildDescriptionField({
              id: 'heirsAdditionalInfoFilesOtherDocumentsTitle',
              title: m.fileUploadOtherDocumentsPrePaid,
              description: m.fileUploadOtherDocumentsPrePaidUserGuidelines,
              titleVariant: 'h5',
              space: 'containerGutter',
              marginBottom: 'smallGutter',
            }),
            buildFileUploadField({
              id: 'heirsAdditionalInfoFilesOtherDocuments',
              uploadAccept: '.pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx',
              uploadDescription: m.fileUploadOtherDocumentsPrePaidDescription,
              title: '',
              uploadHeader: '',
            }),
          ],
        }),
      ],
    }),
    prepaidOverview,
  ],
})
