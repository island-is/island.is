import {
  Box,
  InputFileUpload,
  RadioButton,
  UploadFile,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { m } from '../../lib/messages'
import { OJOIFieldBaseProps } from '../../lib/types'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../shared'

export const AdditionsAndDocuments = ({ application }: OJOIFieldBaseProps) => {
  const [isDocuments, setIsDocuments] = useState<boolean>(true)
  const { f } = useFormatMessage(application)

  // TODO: Create wrapper around file upload component to handle file upload

  return (
    <Box>
      <FormIntro
        title={f(m.additionsAndDocumentsSectionTitle)}
        description={f(m.additionsAndDocumentsFormIntro)}
      />
      <Box>
        <FormGroup>
          <Box width="full">
            <InputFileUpload
              id="files"
              accept={UPLOAD_ACCEPT}
              maxSize={FILE_SIZE_LIMIT}
              header={f(m.fileUploadHeader)}
              description={f(m.fileUploadDescription)}
              buttonLabel={f(m.fileUploadButton)}
              fileList={[]}
              onRemove={function (file: UploadFile): void {
                throw new Error('Function not implemented.')
              }}
            />
          </Box>
        </FormGroup>
        <FormGroup title={f(m.fileUploadFileNamesTitle)}>
          <Box width="full">
            <Box marginBottom={2}>
              <RadioButton
                name="documents"
                value="documents"
                label={f(m.fileUploadFileNameDocuments)}
                checked={isDocuments}
                onChange={() => setIsDocuments(true)}
              />
            </Box>
            <Box>
              <RadioButton
                name="attachments"
                value="attachments"
                label={f(m.fileUploadFileNameAttachments)}
                checked={!isDocuments}
                onChange={() => setIsDocuments(false)}
              />
            </Box>
          </Box>
        </FormGroup>
      </Box>
    </Box>
  )
}
