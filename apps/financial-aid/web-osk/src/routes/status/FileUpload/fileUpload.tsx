import React from 'react'

import {
  Footer,
  StatusLayout,
  Files,
} from '@island.is/financial-aid-web/osk/src/components'

import { useRouter } from 'next/router'

const FileUpload = () => {
  const router = useRouter()

  return (
    <StatusLayout>
      <Files
        headline="Senda inn gögn"
        about="Þú getur alltaf sent okkur gögn sem þú telur hjálpa umsókninni, t.d.
        launagögn"
      />
      <Footer
        previousUrl={`/stada/${router.query.id}`}
        nextButtonText="Senda gögn"
      />
    </StatusLayout>
  )
}

export default FileUpload
