import { useContext, useMemo } from 'react'
import { useMutation } from '@apollo/client'

import {
  ApplicationMutation,
  CreateApplicationMutation,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import {
  User,
  ApplicationState,
  FileType,
  Application,
  ApplicationEventType,
} from '@island.is/financial-aid/shared/lib'
import {
  Form,
  FormContext,
} from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { UploadFile } from '@island.is/island-ui/core'
import { useFileUpload } from './useFileUpload'

const useUpdateApplication = () => {
  const { form, updateForm } = useContext(FormContext)
  const { uploadFiles } = useFileUpload(form.otherFiles)

  const [updateApplicationMutation] = useMutation<{ application: Application }>(
    ApplicationMutation,
  )

  const sendFiles = async () => {
    try {
      await uploadFiles().then(async () => {
        await updateApplicationMutation({
          variables: {
            input: {
              id: '',
              state: ApplicationState.INPROGRESS,
              event: ApplicationEventType.INPROGRESS,
            },
          },
        })

        updateForm({
          ...form,
          status: ApplicationState.INPROGRESS,
        })

        console.log('suzzes')
      })
    } catch (e) {
      console.log('error catch')
    }
  }

  return {
    sendFiles,
  }
}

export default useUpdateApplication
