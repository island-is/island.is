import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Footer,
  StatusLayout,
  Files,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useFileUpload } from '@island.is/financial-aid-web/osk/src/utils/useFileUpload'
import {
  Application,
  ApplicationState,
  FileType,
} from '@island.is/financial-aid/shared/lib'
import { useMutation } from '@apollo/client'
import { UpdateApplicationMutation } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

const FileUpload = () => {
  const { form, updateForm } = useContext(FormContext)
  const router = useRouter()
  const { uploadFiles } = useFileUpload(form.otherFiles)
  const [isLoading, setIsLoading] = useState(false)

  const [updateApplicationMutation] = useMutation<{ application: Application }>(
    UpdateApplicationMutation,
  )

  const proceed = async () => {
    if (form?.otherFiles.length <= 0 || router.query.id === undefined) {
      return
    }

    setIsLoading(true)

    try {
      await uploadFiles(router.query.id as string, FileType.OTHER).then(
        async () => {
          await updateApplicationMutation({
            variables: {
              input: {
                id: router.query.id,
                state: ApplicationState.INPROGRESS,
              },
            },
          })
          updateForm({ ...form, status: ApplicationState.INPROGRESS })
          router.push(`/${router.query.id}/gogn/send`)
        },
      )
    } catch (e) {
      router.push(`/${router.query.id}/gogn/villa`)
    }

    setIsLoading(false)
  }

  return (
    <StatusLayout>
      <Files
        header="Senda inn gögn"
        fileKey="otherFiles"
        uploadFiles={form.otherFiles}
      />
      <Footer
        previousUrl={`/${router.query.id}`}
        nextButtonText={'Senda gögn'}
        nextIsLoading={isLoading}
        onNextButtonClick={() => proceed()}
      />
    </StatusLayout>
  )
}

export default FileUpload
