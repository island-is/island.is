import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  InputFileUploadDeprecated,
  LoadingDots,
  UploadFileDeprecated,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Controller, useFormContext } from 'react-hook-form'
import { examCategories } from '../../lib/messages'
import { FC, useState } from 'react'
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
  const { setValue, getValues } = useFormContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [fileState, setFileState] = useState<Array<UploadFileDeprecated>>([])

  const rejectFile = () => {
    setValue(`examCategories[${idx}].medicalCertificate`, undefined)
    setValue('medicalCertificateError', 'true')
    return
  }

  const removeFile = () => {
    setValue(`examCategories[${idx}].medicalCertificate`, undefined)
    setFileState([])
  }

  const changeFile = (props: File[]) => {
    setIsLoading(true)
    const reader = new FileReader()

    reader.onload = (event) => {
      // The result contains the file data as a base64 encoded string
      const base64String = event.target?.result as string
      const pureBase64 = base64String.split(',')[1]
      const name = props[0].name
      const type = props[0].type
      setValue(`examCategories[${idx}].medicalCertificate`, {
        content: pureBase64,
        type: type,
        name: name,
      })
      const file = props[0]
      setFileState([file])
      setIsLoading(false)
    }

    reader.onerror = (_) => {
      setValue(`examCategories[${idx}].medicalCertificate`, undefined)
      setIsError(true)
    }

    // Read the file as a data URL
    reader.readAsDataURL(props[0])
  }

  console.log(getValues())
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
//<Controller
//   name={`examCategories[${idx}].medicalCertificate`}
//   key={`examCategories[${idx}].medicalCertificate`}
//   render={({ field: { ref, ...rest } }) => (
//     <Box display={showFileUpload ? 'block' : 'none'}>
//       {isLoading && (
//         <Box
//           width="full"
//           display={'flex'}
//           justifyContent={'center'}
//           marginY={2}
//         >
//           <LoadingDots large />
//         </Box>
//       )}
//       {isError && (
//         <Box
//           width="full"
//           display={'flex'}
//           justifyContent={'center'}
//           marginY={2}
//         >
//           <AlertMessage
//             type="warning"
//             message={formatMessage(examCategories.fileUpload.error)}
//           />
//         </Box>
//       )}
//       <InputFileUploadDeprecated
//         {...rest}
//         applicationId={application.id}
//         fileList={fileState}
//         header={formatMessage(examCategories.fileUpload.title, {
//           value: chosenMedicalCategories,
//         })}
//         description={formatMessage(examCategories.fileUpload.description)}
//         buttonLabel={formatMessage(
//           examCategories.fileUpload.downloadButton,
//         )}
//         onChange={(e) => changeFile(e)}
//         onRemove={() => removeFile()}
//         onUploadRejection={() => rejectFile()}
//         errorMessage={''}
//         multiple={false}
//         accept={['.pdf', '.jpeg', '.png', '.jpg']}
//         maxSize={FILE_SIZE_LIMIT}
//       />
//     </Box>
//   )}
// />
