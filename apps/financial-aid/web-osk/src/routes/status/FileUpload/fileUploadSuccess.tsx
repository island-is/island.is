import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FileUploadResult } from '@island.is/financial-aid-web/osk/src/components'
import { Routes } from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

const FileUploadSuccess = () => {
  const router = useRouter()

  const { emptyFormProvider } = useContext(FormContext)

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      emptyFormProvider()
    })
  }, [])

  return (
    <FileUploadResult
      subtitle={'Eftirfarandi gögn hafa verið send inn'}
      subtitleColor={'mint600'}
      nextButtonText={'Til baka á forsíðu'}
      nextButtonAction={() => {
        router.push(`
      ${Routes.statusPage(router.query.id as string)}`)
      }}
    />
  )
}

export default FileUploadSuccess
