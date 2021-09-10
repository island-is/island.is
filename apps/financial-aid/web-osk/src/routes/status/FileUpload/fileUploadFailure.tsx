import React from 'react'
import { useRouter } from 'next/router'
import { FileUploadResult } from '@island.is/financial-aid-web/osk/src/components'
import { Text, Link, Button, Box } from '@island.is/island-ui/core'
import { Routes } from '@island.is/financial-aid/shared/lib'

const FileUploadFailure = () => {
  const router = useRouter()

  return (
    <FileUploadResult
      subtitle={'Eitthvað fór úrskeiðis við sendingu eftirfarandi gagna'}
      subtitleColor={'red400'}
      nextButtonText={'Til baka í innsendingu'}
      nextButtonAction={() =>
        router.push(`
      ${Routes.statusFileUpload(router.query.id as string)}`)
      }
    >
      <Box marginTop={5}>
        Þú getur reynt aftur síðar eða sent gögnin með tölvupósti á{' '}
        <Link
          href="mailto: felagsthjonusta@hafnarfjordur.is"
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          felagsthjonusta@hafnarfjordur.is
        </Link>
        . Gættu þess að láta kennitölu þína fylgja með gögnunum ef þú sendir þau
        með tölvupósti.
      </Box>
    </FileUploadResult>
  )
}

export default FileUploadFailure
