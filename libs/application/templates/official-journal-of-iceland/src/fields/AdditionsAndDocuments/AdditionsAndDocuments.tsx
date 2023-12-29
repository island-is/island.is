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
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../lib/constants'
import { additionsAndDocuments } from '../../lib/messages'
import { OJOIFieldBaseProps } from '../../lib/types'

export const AdditionsAndDocuments = ({ application }: OJOIFieldBaseProps) => {
  const [isDocuments, setIsDocuments] = useState<boolean>(true)
  const { f } = useFormatMessage(application)

  // TODO: Create wrapper around file upload component to handle file upload

  return (
    <Box>
      <FormIntro
        title={f(additionsAndDocuments.general.formTitle)}
        intro={f(additionsAndDocuments.general.formIntro)}
      />
      <Box>
        <FormGroup>
          <Box width="full">
            <InputFileUpload
              id="files"
              accept={UPLOAD_ACCEPT}
              maxSize={FILE_SIZE_LIMIT}
              header={f(additionsAndDocuments.fileUpload.header)}
              description={f(additionsAndDocuments.fileUpload.description)}
              buttonLabel={f(additionsAndDocuments.fileUpload.buttonLabel)}
              fileList={[]}
              onRemove={function (file: UploadFile): void {
                throw new Error('Function not implemented.')
              }}
            />
          </Box>
        </FormGroup>
        <FormGroup
          title={f(additionsAndDocuments.nameOfDocumentsChapter.title)}
        >
          <Box width="full">
            <Box marginBottom={2}>
              <RadioButton
                name="documents"
                value="documents"
                label={f(additionsAndDocuments.radio.documents.label)}
                checked={isDocuments}
                onChange={() => setIsDocuments(true)}
              />
            </Box>
            <Box>
              <RadioButton
                name="attachments"
                value="attachments"
                label={f(additionsAndDocuments.radio.additions.label)}
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
