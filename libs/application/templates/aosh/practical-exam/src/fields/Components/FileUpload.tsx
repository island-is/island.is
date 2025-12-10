import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { examCategories } from '../../lib/messages'
import { FC } from 'react'
import { FILE_SIZE_LIMIT } from '../../lib/constants'
import { FileUploadController } from '@island.is/application/ui-components'

type ExamFileUploadProps = {
  showFileUpload: boolean
  idx: number
  chosenMedicalCategories: string
}

export const FileUpload: FC<
  React.PropsWithChildren<FieldBaseProps & ExamFileUploadProps>
> = ({ application, showFileUpload, idx, chosenMedicalCategories }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingBottom={2} display={showFileUpload ? 'block' : 'none'}>
      <FileUploadController
        key={idx}
        application={application}
        id={`examCategories[${idx}].medicalCertificate`}
        error=""
        accept={'.pdf, .jpeg, .png, .jpg'}
        header={formatMessage(examCategories.fileUpload.title, {
          value: chosenMedicalCategories,
        })}
        description={formatMessage(examCategories.fileUpload.description)}
        buttonLabel={formatMessage(examCategories.fileUpload.downloadButton)}
        maxSize={FILE_SIZE_LIMIT}
        multiple={false}
      />
    </Box>
  )
}
