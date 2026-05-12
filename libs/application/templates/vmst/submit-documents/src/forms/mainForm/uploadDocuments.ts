import {
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTableRepeaterField,
  coreMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { uploadDocuments as udm } from '../../lib/messages'

export const uploadDocumentsSection = buildSection({
  id: 'uploadDocumentsSection',
  title: udm.sectionStepTitle,
  children: [
    buildMultiField({
      id: 'submitDocumentsMultiField',
      title: udm.title,
      description: udm.multiFieldDescription,
      children: [
        buildTableRepeaterField({
          id: 'documents',
          initActiveFieldIfEmpty: true,
          fields: {
            type: {
              component: 'select',
              label: 'Tegund gagna',
              width: 'full',
              required: true,
              options: (application) => {
                const attachmentTypes =
                  getValueViaPath<{ id: string; name: string }[]>(
                    application.externalData,
                    'attachmentTypes.data',
                  ) ?? []
                return attachmentTypes.map((type) => ({
                  label: type.name,
                  value: type.id,
                }))
              },
            },
            file: {
              component: 'fileUpload',
              label: 'Skjal',
              uploadAccept: '.pdf,.docx,.rtf,.doc,.jpg,.jpeg,.png,.heic',
            },
            comment: {
              component: 'input',
              label: 'Athugasemd',
              width: 'full',
              textarea: true,
              displayInTable: false,
              rows: 4,
              required: true,
            },
          },
          table: {
            format: {
              type: (value, _index, application) => {
                const attachmentTypes =
                  getValueViaPath<{ id: string; name: string }[]>(
                    application?.externalData || {},
                    'attachmentTypes.data',
                  ) ?? []
                return (
                  attachmentTypes.find((type) => type.id === value)?.name ??
                  value
                )
              },
              file: (value) => {
                if (Array.isArray(value)) {
                  return value.map((f: { name: string }) => f.name).join(', ')
                }
                return ''
              },
            },
          },
        }),
        buildSubmitField({
          id: 'confirmationSubmit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: coreMessages.buttonNext,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
