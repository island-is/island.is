import React, { useContext, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Footer,
  StatusLayout,
  Files,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osksrc/components/FormProvider/FormProvider'
import { useFileUpload } from '@island.is/financial-aid-web/osksrc/utils/useFileUpload'
import { UserContext } from '@island.is/financial-aid-web/osksrc/components/UserProvider/UserProvider'
import {
  Application,
  ApplicationState,
  FileType,
} from '@island.is/financial-aid/shared'
import { useMutation } from '@apollo/client'
import { UpdateApplicationMutation } from '@island.is/financial-aid-web/oskgraphql/sharedGql'

const FileUpload = () => {
  const { form } = useContext(FormContext)
  const router = useRouter()
  const [nextButtonText, setNextButtonText] = useState('Senda gögn')
  const { uploadFiles } = useFileUpload(form.otherFiles)
  const { user } = useContext(UserContext)

  const currentApplication = useMemo(() => {
    if (user?.currentApplication) {
      return user.currentApplication
    }
  }, [user])

  const [updateApplicationMutation] = useMutation<{ application: Application }>(
    UpdateApplicationMutation,
  )

  const proceed = async () => {
    if (form?.otherFiles.length <= 0 || currentApplication === undefined) {
      setNextButtonText('Engar skrár til staðar')
      return
    }

    try {
      await uploadFiles(currentApplication.id, FileType.OTHER).then(
        async () => {
          await updateApplicationMutation({
            variables: {
              input: {
                id: currentApplication.id,
                state: ApplicationState.INPROGRESS,
              },
            },
          })
          setNextButtonText('Skrám hefur verið hlaðið upp')
        },
      )
    } catch (e) {
      setNextButtonText('Ekki tókst að hlaða upp skrám')
    }
  }

  return (
    <StatusLayout>
      <Files
        headline="Senda inn gögn"
        about="Þú getur alltaf sent okkur gögn sem þú telur hjálpa umsókninni, t.d.
        launagögn"
      />
      <Footer
        previousUrl={`/${router.query.id}`}
        nextButtonText={nextButtonText}
        onNextButtonClick={() => proceed()}
      />
    </StatusLayout>
  )
}

export default FileUpload
