import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Footer,
  StatusLayout,
  Files,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osksrc/components/FormProvider/FormProvider'
import { useFileUpload } from '@island.is/financial-aid-web/osksrc/utils/useFileUpload'

const FileUpload = () => {
  const { form } = useContext(FormContext)
  const router = useRouter()
  const [nextButtonText, setNextButtonText] = useState('Senda gögn')
  const { uploadFiles } = useFileUpload(form.incomeFiles)

  const proceed = async () => {
    console.log(form)
    if (form?.incomeFiles.length <= 0) {
      setNextButtonText('Aint no files here')
      return
    }

    try {
      await uploadFiles().then(() => {
        setNextButtonText('Success 🙌🙌🙌')
      })
    } catch (e) {
      setNextButtonText('Fail 😭😭😭😭')
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
