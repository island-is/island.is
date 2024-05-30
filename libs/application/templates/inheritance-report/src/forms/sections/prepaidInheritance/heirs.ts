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

export const prePaidHeirs = buildSection({
  id: 'prePaidHeirs',
  title: 'Erfingjar',
  children: [
    buildSubSection({
      id: 'prePaidHeirs',
      title: m.heirsTitlePrePaid,
      children: [
        buildMultiField({
          id: 'prePaidHeirs',
          title: m.heirsTitlePrePaid,
          description: m.heirsDescriptionPrePaid,
          children: [
            buildCustomField(
              {
                title: '',
                id: 'prePaidHeirs.data',
                doesNotRequireAnswer: false,
                component: 'HeirsAndPartitionRepeater',
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
              titleVariant: 'h5',
              space: 'containerGutter',
              marginBottom: 'smallGutter',
            }),
            buildFileUploadField({
              id: 'heirsAdditionalInfoFilesOtherDocuments',
              uploadAccept: '.pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx',
              uploadDescription: m.fileUploadFileTypes,
              title: '',
              uploadHeader: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
