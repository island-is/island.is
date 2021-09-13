import React, { useEffect, useContext } from 'react'
import { InputFileUpload, UploadFile } from '@island.is/island-ui/core'

import { FileUploadContainer } from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useFileUpload } from '@island.is/financial-aid-web/osk/src/utils/useFileUpload'

import { UploadFileType } from '@island.is/financial-aid/shared/lib'

interface Props {
  header: string
  uploadFiles: UploadFile[]
  fileKey: UploadFileType
}

const Files = ({ header, uploadFiles, fileKey }: Props) => {
  const { form, updateForm } = useContext(FormContext)
  console.log('uploadfiles', uploadFiles)

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useFileUpload(uploadFiles)

  useEffect(() => {
    const formFiles = files.filter((f) => f.status === 'done')

    // updateForm({
    //   ...form,
    //   [fileKey]: formFiles.map((f, i) => {
    //     return { name: f.name + i }
    //   }),
    // })
    updateForm({ ...form, [fileKey]: formFiles })
  }, [files])

  return (
    <FileUploadContainer>
      <InputFileUpload
        fileList={files}
        header={header}
        description="Tekið er við öllum hefðbundnum skráargerðum"
        buttonLabel="Bættu við gögnum"
        showFileSize={true}
        errorMessage={uploadErrorMessage}
        onChange={onChange}
        onRemove={onRemove}
        onRetry={onRetry}
      />
    </FileUploadContainer>
  )
}

export default Files
