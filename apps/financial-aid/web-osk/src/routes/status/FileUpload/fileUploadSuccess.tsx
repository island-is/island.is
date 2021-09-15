import React from 'react'
import { useRouter } from 'next/router'
import { FileUploadResult } from '@island.is/financial-aid-web/osk/src/components'

const FileUploadSuccess = () => {
  const router = useRouter()

  return (
    <FileUploadResult
      subtitle={'Eftirfarandi gögn hafa verið send inn'}
      subtitleColor={'mint600'}
      nextButtonText={'Til baka á forsíðu'}
      nextButtonAction={() => router.push(`/${router.query.id}`)}
    />
  )
}

export default FileUploadSuccess
