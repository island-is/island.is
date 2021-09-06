import React from 'react'
import { useRouter } from 'next/router'
import { FileUploadResult } from '@island.is/financial-aid-web/osk/src/components'
import { Text } from '@island.is/island-ui/core'

const FileUploadFailure = () => {
  const router = useRouter()

  return (
    <FileUploadResult
      subtitle={'Eitthvað fór úrskeiðis við sendingu eftirfarandi gagna'}
      subtitleColor={'red400'}
      nextButtonText={'Til baka í innsendingu'}
      nextButtonAction={() => router.push(`/${router.query.id}/gogn`)}
    >
      <Text marginTop={5}>
        Þú getur reynt aftur síðar eða sent gögnin með tölvupósti á{' '}
        <a href="mailto: felagsthjonusta@hafnarfjordur.is">
          felagsthjonusta@hafnarfjordur.is
        </a>
        . Gættu þess að láta kennitölu þína fylgja með gögnunum ef þú sendir þau
        með tölvupósti.
      </Text>
    </FileUploadResult>
  )
}

export default FileUploadFailure
