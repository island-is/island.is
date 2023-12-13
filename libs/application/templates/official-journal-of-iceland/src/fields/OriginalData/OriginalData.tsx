import { FieldBaseProps } from '@island.is/application/types'
import { FileUploadController } from '@island.is/application/ui-components'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { m } from '../../lib/messages'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../shared'

export const OriginalData: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { f } = useFormatMessage(application)

  // TODO: handle file upload

  return (
    <Box>
      <FormIntro
        title={f(m.originalDataFormTitle)}
        description={f(m.originalDataFormIntro)}
      />
      <Box>
        <FormGroup>
          <Box width="full">
            <FileUploadController
              id="originalData"
              application={application}
              accept={UPLOAD_ACCEPT}
              maxSize={FILE_SIZE_LIMIT}
              header={f(m.originalDataFileUploadHeader)}
              description={f(m.originalDataFileUploadDescription)}
              buttonLabel={f(m.originalDataFileUploadButton)}
            />
          </Box>
        </FormGroup>
      </Box>
    </Box>
  )
}
