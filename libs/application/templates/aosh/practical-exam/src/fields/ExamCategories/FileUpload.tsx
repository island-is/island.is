import { FieldBaseProps } from '@island.is/application/types'
import { Box, InputFileUpload, LoadingDots } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Controller } from 'react-hook-form'
import { examCategories } from '../../lib/messages'
import { FC } from 'react'

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
    <Controller
      name={`examCategories[${idx}].medicalCertificate`}
      render={({ field: { ref, ...rest } }) => (
        <Box display={showFileUpload ? 'block' : 'none'}>
          {false && (
            <Box
              width="full"
              display={'flex'}
              justifyContent={'center'}
              marginY={2}
            >
              <LoadingDots large />
            </Box>
          )}
          <InputFileUpload
            {...rest}
            applicationId={application.id}
            fileList={[]}
            header={formatMessage(examCategories.fileUpload.title, {
              value: chosenMedicalCategories,
            })}
            description={formatMessage(examCategories.fileUpload.description)}
            buttonLabel={formatMessage(
              examCategories.fileUpload.downloadButton,
            )}
            onChange={(e) => null}
            onRemove={() => null}
            onUploadRejection={() => null}
            errorMessage={''}
            multiple={false}
            accept={['application/pdf', 'image/jpeg', 'image/png']}
            maxSize={12000}
          />
        </Box>
      )}
    />
  )
}
