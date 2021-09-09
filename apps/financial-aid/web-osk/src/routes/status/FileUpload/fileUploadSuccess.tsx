import React from 'react'
import { useRouter } from 'next/router'
import { FileUploadResult } from '@island.is/financial-aid-web/osk/src/components'
import { Routes } from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'

// import * as styles from '@island.is/financial-aid/shared/components/FileList/FileList.treat'

const FileUploadSuccess = () => {
  const router = useRouter()

  return (
    <FileUploadResult
      subtitle={'Eftirfarandi gögn hafa verið send inn'}
      subtitleColor={'mint600'}
      nextButtonText={'Til baka á forsíðu'}
      nextButtonAction={() =>
        router.push(`
      ${Routes.statusPage(router.query.id as string)}`)
      }
    >
      {/* <Box className={styles.filesLink}></Box> */}
    </FileUploadResult>
  )
}

export default FileUploadSuccess
