import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { FileUploadResult } from '@island.is/financial-aid-web/osk/src/components'
import { Text } from '@island.is/island-ui/core'
import { Routes } from '@island.is/financial-aid/shared/lib'

import * as styles from './fileUpload.treat'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const FileUploadFailure = () => {
  const router = useRouter()
  const { municipality } = useContext(AppContext)

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
      <Text marginTop={5}>
        Þú getur reynt aftur síðar eða sent gögnin með tölvupósti á{' '}
        <a href={`mailto: ${municipality?.email}`}>
          <span className={styles.link}>{municipality?.email}</span>
        </a>
        . Gættu þess að láta kennitölu þína fylgja með gögnunum ef þú sendir þau
        með tölvupósti.
      </Text>
    </FileUploadResult>
  )
}

export default FileUploadFailure
