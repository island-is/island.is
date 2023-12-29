import { Box, InputFileUpload, UploadFile } from '@island.is/island-ui/core'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../lib/constants'
import { originalData } from '../../lib/messages'
import { OJOIFieldBaseProps } from '../../lib/types'

export const OriginalData = ({ application }: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)

  // TODO: handle file upload

  return (
    <Box>
      <FormIntro
        title={f(originalData.general.formTitle)}
        intro={f(originalData.general.formIntro)}
      />
      <Box>
        <FormGroup>
          <Box width="full">
            <InputFileUpload
              id="originalData"
              accept={UPLOAD_ACCEPT}
              maxSize={FILE_SIZE_LIMIT}
              header={f(originalData.fileUpload.header)}
              description={f(originalData.fileUpload.description)}
              buttonLabel={f(originalData.fileUpload.buttonLabel)}
              fileList={[]}
              onRemove={function (file: UploadFile): void {
                throw new Error('Function not implemented.')
              }}
            />
          </Box>
        </FormGroup>
      </Box>
    </Box>
  )
}
