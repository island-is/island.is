import { FileUploadController } from '@island.is/application/ui-components'
import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { Application } from '@island.is/application/types'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../lib/constants'
import { original } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath } from '@island.is/application/core'

export const Original = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  return (
    <FormGroup>
      <FileUploadController
        application={props.application as unknown as Application}
        id={InputFields.original.files}
        accept={UPLOAD_ACCEPT}
        maxSize={FILE_SIZE_LIMIT}
        header={f(original.fileUpload.header)}
        description={f(original.fileUpload.description)}
        buttonLabel={f(original.fileUpload.buttonLabel)}
        error={
          props.errors &&
          getErrorViaPath(props.errors, InputFields.original.files)
        }
      />
    </FormGroup>
  )
}
