import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTableRepeaterField,
  coreMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { uploadDocuments as udm } from '../../lib/messages'
import { MAX_DOCUMENTS } from '../../utils/constants'

export const uploadDocumentsSection = buildSection({
  id: 'uploadDocumentsSection',
  title: udm.sectionStepTitle,
  children: [
    buildMultiField({
      id: 'submitDocumentsMultiField',
      title: udm.title,
      children: [
        buildDescriptionField({
          id: 'uploadDocuments.descriptionFieldTwo',
          description: udm.multiFieldDescription,
          marginBottom: 1,
        }),
        buildDescriptionField({
          id: 'uploadDocument.textField',
          condition: (_, externalData) => {
            const requestedAttachments =
              getValueViaPath<{ attachmentTypeId?: string }[]>(
                externalData,
                'requestedAttachments.data',
              ) ?? []

            return requestedAttachments.length > 0 ? true : false
          },
          description: (application, _locale, formatMessage) => {
            const requestedAttachments =
              getValueViaPath<{ attachmentTypeId?: string }[]>(
                application.externalData,
                'requestedAttachments.data',
              ) ?? []
            const attachmentTypes =
              getValueViaPath<{ id: string; name: string }[]>(
                application.externalData,
                'attachmentTypes.data',
              ) ?? []

            const names = requestedAttachments
              .map(
                (ra) =>
                  attachmentTypes.find((at) => at.id === ra.attachmentTypeId)
                    ?.name,
              )
              .filter(Boolean)

            if (names.length === 0) {
              return ''
            }

            const heading = formatMessage
              ? formatMessage(udm.requestedAttachmentsDescription)
              : ''
            const bulletList = names.map((name) => `* ${name}`).join('\n')

            return `${heading}\n\n${bulletList}`
          },
        }),
        buildTableRepeaterField({
          id: 'documents',
          maxRows: MAX_DOCUMENTS,
          initActiveFieldIfEmpty: true,
          fields: {
            type: {
              component: 'select',
              label: udm.typeLabel,
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
              required: true,
              label: udm.fileLabel,
              uploadAccept: '.pdf,.docx,.rtf,.doc,.jpg,.jpeg,.png,.heic',
            },
            comment: {
              component: 'input',
              label: udm.commentLabel,
              width: 'full',
              textarea: true,
              displayInTable: false,
              rows: 4,
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
