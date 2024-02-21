import {
  Box,
  InputFileUpload,
  RadioButton,
  UploadFile,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { FormIntro } from '../../components/form/FormIntro'
import { FormGroup } from '../../components/form/FormGroup'
import { useFormatMessage } from '../../hooks'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../lib/constants'
import { attachments } from '../../lib/messages'
import { OJOIFieldBaseProps } from '../../lib/types'

export const AdditionsAndDocuments = ({ application }: OJOIFieldBaseProps) => {
  const [isDocuments, setIsDocuments] = useState<boolean>(true)
  const { f } = useFormatMessage(application)

  // TODO: Create wrapper around file upload component to handle file upload

  return (
    <Box>
      <FormIntro
        title={f(attachments.general.formTitle)}
        intro={f(attachments.general.formIntro)}
      />
      <Box>
        <FormGroup>
          <Box width="full">
            <InputFileUpload
              id="files"
              accept={UPLOAD_ACCEPT}
              maxSize={FILE_SIZE_LIMIT}
              header={f(attachments.fileUpload.header)}
              description={f(attachments.fileUpload.description)}
              buttonLabel={f(attachments.fileUpload.buttonLabel)}
              fileList={[]}
              onRemove={function (file: UploadFile): void {
                throw new Error('Function not implemented.')
              }}
            />
          </Box>
        </FormGroup>
        <FormGroup title={f(attachments.nameOfDocumentsChapter.title)}>
          <Box width="full">
            <Box marginBottom={2}>
              <RadioButton
                name="documents"
                value="documents"
                label={f(attachments.radio.documents.label)}
                checked={isDocuments}
                onChange={() => setIsDocuments(true)}
              />
            </Box>
            <Box>
              <RadioButton
                name="attachments"
                value="attachments"
                label={f(attachments.radio.additions.label)}
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
