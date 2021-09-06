import React, { useEffect, useContext } from 'react'
import { Text, InputFileUpload } from '@island.is/island-ui/core'

import {
  ContentContainer,
  FileUploadContainer,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useFileUpload } from '@island.is/financial-aid-web/osksrc/utils/useFileUpload'

interface Props {
  headline: string
  about: string
}

const Files = ({ headline, about }: Props) => {
  const { form, updateForm } = useContext(FormContext)

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useFileUpload(form.otherFiles)

  useEffect(() => {
    const formFiles = files.filter((f) => f.status === 'done')

    updateForm({ ...form, otherFiles: formFiles })
  }, [files])

  return (
    <ContentContainer>
      <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
        {headline}
      </Text>
      <Text marginBottom={[3, 3, 5]}>{about}</Text>
      <FileUploadContainer>
        <InputFileUpload
          fileList={files}
          header="Dragðu gögn hingað"
          description="Tekið er við öllum hefðbundnum skráargerðum"
          buttonLabel="Bættu við gögnum"
          showFileSize={true}
          errorMessage={uploadErrorMessage}
          onChange={onChange}
          onRemove={onRemove}
          onRetry={onRetry}
        />
      </FileUploadContainer>
    </ContentContainer>
  )
}

export default Files
