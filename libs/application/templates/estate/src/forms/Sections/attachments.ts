import {
  buildSection,
  buildMultiField,
  buildFileUploadField,
  buildTextField,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  UPLOAD_ACCEPT,
  FILE_SIZE_LIMIT,
  EstateTypes,
} from '../../lib/constants'

export const attachments = buildSection({
  id: 'estateAttachments',
  title: m.attachmentsTitle,
  children: [
    buildMultiField({
      id: 'estateAttachments',
      title: m.attachmentsTitle,
      children: [
        buildTextField({
          id: 'additionalComments',
          title: m.additionalCommentsTitle,
          description: m.additionalCommentsDescription,
          placeholder: m.additionalCommentsPlaceholder,
          variant: 'textarea',
          rows: 4,
          maxLength: 1800,
        }),
        buildDescriptionField({
          id: 'estateAttachments.description',
          description: ({ answers }) => {
            const selectedEstate = getValueViaPath(answers, 'selectedEstate')
            return selectedEstate === EstateTypes.officialDivision
              ? m.attachmentsDescription
              : selectedEstate === EstateTypes.estateWithoutAssets
              ? m.attachmentsDescriptionEstateWithoutAssets
              : selectedEstate === EstateTypes.permitForUndividedEstate
              ? m.attachmentsDescriptionUndividedEstate
              : m.attachmentsDescriptionDivisionOfEstateByHeirs
          },
          titleVariant: 'h5',
          space: 'containerGutter',
          marginBottom: 'smallGutter',
        }),
        buildFileUploadField({
          id: 'estateAttachments.attached.file',
          title: '',
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: m.uploadHeader,
          uploadDescription: m.uploadDescription,
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          uploadButtonLabel: m.attachmentsButton,
        }),
      ],
    }),
  ],
})
