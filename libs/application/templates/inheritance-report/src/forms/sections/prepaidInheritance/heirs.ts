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
          description: m.heirAdditionalInfoPrePaidDescription,
          children: [
            buildTextField({
              id: 'heirsAdditionalInfo',
              placeholder: m.infoPlaceholder,
              variant: 'textarea',
              rows: 4,
              maxLength: 1800,
            }),
            buildDescriptionField({
              id: 'heirsAdditionalInfoFilesOtherDocumentsTitle',
              title: m.fileUploadOtherDocumentsPrePaid,
              titleVariant: 'h4',
              space: 'containerGutter',
              marginBottom: 2,
            }),
            buildDescriptionField({
              id: 'heirsAdditionalInfoFilesOtherDocumentsDescription',
              description: m.fileUploadOtherDocumentsPrePaidUserGuidelines,
            }),
            buildFileUploadField({
              id: 'heirsAdditionalInfoFilesOtherDocuments',
              uploadAccept: '.pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx',
              uploadDescription: m.fileUploadOtherDocumentsPrePaidDescription,
              uploadHeader: '',
              uploadMultiple: true,
            }),
          ],
        }),
      ],
    }),
    prepaidOverview,
  ],
})
