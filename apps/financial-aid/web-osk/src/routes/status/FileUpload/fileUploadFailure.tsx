import React from 'react'
import { useRouter } from 'next/router'
import { FileUploadResult } from '@island.is/financial-aid-web/osk/src/components'
import { Text, Link } from '@island.is/island-ui/core'

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
      </Text>
    </FileUploadResult>
  )
}

export default FileUploadFailure
