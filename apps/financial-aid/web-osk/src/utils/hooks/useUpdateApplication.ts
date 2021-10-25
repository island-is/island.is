import { useContext } from 'react'
import { useMutation } from '@apollo/client'

import { ApplicationMutation } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import {
  ApplicationState,
  FileType,
  Application,
  ApplicationEventType,
} from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

import { useFileUpload } from './useFileUpload'

const useUpdateApplication = () => {
  const { form, updateForm } = useContext(FormContext)
  const { uploadFiles } = useFileUpload(form.otherFiles)

  const [updateApplicationMutation] = useMutation<{ application: Application }>(
    ApplicationMutation,
  )

  const updateApplication = async (
    applicationId: string,
    fileType: FileType,
  ) => {
    await uploadFiles(applicationId, fileType).then(async () => {
      updateForm({ ...form, applicationId: applicationId })
      await updateApplicationMutation({
        variables: {
          input: {
            id: applicationId,
            state: ApplicationState.INPROGRESS,
            event: ApplicationEventType.FILEUPLOAD,
          },
        },
      })
    })
  }

  return {
    updateApplication,
  }
}

export default useUpdateApplication
