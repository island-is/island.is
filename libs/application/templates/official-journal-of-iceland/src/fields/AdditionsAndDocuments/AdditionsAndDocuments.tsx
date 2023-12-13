import { FieldBaseProps } from '@island.is/application/types'
import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import { FC, useState } from 'react'
import { m } from '../../lib/messages'
import { useFormatMessage } from '../../hooks'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { FileUploadController } from '@island.is/application/ui-components'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../shared'

export const AdditionsAndDocuments: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const [isDocuments, setIsDocuments] = useState<boolean>(true)
  const { f, locale } = useFormatMessage(application)

  return (
    <Box>
      <FormIntro
        title={f(m.additionsAndDocumentsSectionTitle)}
        description={f(m.additionsAndDocumentsFormIntro)}
      />
      <Box>
        <FormGroup>
          <Box width="full">
            <FileUploadController
              id="files"
              application={application}
              accept={UPLOAD_ACCEPT}
              maxSize={FILE_SIZE_LIMIT}
              header={f(m.fileUploadHeader)}
              description={f(m.fileUploadDescription)}
              buttonLabel={f(m.fileUploadButton)}
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
