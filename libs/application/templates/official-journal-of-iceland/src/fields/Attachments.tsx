import { Box } from '@island.is/island-ui/core'
import { FormGroup } from '../components/form/FormGroup'
import { UPLOAD_ACCEPT, FILE_SIZE_LIMIT, FileNames } from '../lib/constants'
import { attachments } from '../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { FileUploadController } from '@island.is/application/ui-components'
import { Application } from '@island.is/application/types'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath } from '@island.is/application/core'

export const Attachments = ({ application, errors }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  // TODO: Create wrapper around file upload component to handle file upload

  return (
    <>
      <FormGroup>
        <Box width="full">
          <FileUploadController
            application={application as unknown as Application}
            id={InputFields.attachments.files}
            accept={UPLOAD_ACCEPT}
            maxSize={FILE_SIZE_LIMIT}
            header={f(attachments.inputs.fileUpload.header)}
            description={f(attachments.inputs.fileUpload.description)}
            buttonLabel={f(attachments.inputs.fileUpload.buttonLabel)}
            error={
              errors && getErrorViaPath(errors, InputFields.attachments.files)
            }
          />
        </Box>
      </FormGroup>
      <FormGroup title={f(attachments.headings.fileNames)}>
        <Box width="full">
          <Box marginBottom={2}>
            <RadioController
              largeButtons={false}
              id={InputFields.attachments.fileNames}
              defaultValue={
                application.answers?.attachments?.fileNames ||
                FileNames.DOCUMENT
              }
              options={[
                {
                  value: FileNames.DOCUMENT,
                  label: f(attachments.inputs.radio.additions.label),
                },
                {
                  value: FileNames.ADDITIONS,
                  label: f(attachments.inputs.radio.documents.label),
                },
              ]}
              error={
                errors &&
                getErrorViaPath(errors, InputFields.attachments.fileNames)
              }
            />
          </Box>
        </Box>
      </FormGroup>
    </>
  )
}
