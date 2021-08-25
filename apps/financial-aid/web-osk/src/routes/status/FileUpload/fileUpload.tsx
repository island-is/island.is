import React from 'react'
import { Text, InputFileUpload } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  StatusLayout,
  FileUploadContainer,
  Files,
} from '@island.is/financial-aid-web/osk/src/components'

const FileUpload = () => {
  return (
    <StatusLayout>
      <Files
        headline="Senda inn gögn"
        about="Þú getur alltaf sent okkur gögn sem þú telur hjálpa umsókninni, t.d.
        launagögn"
      />
      <Footer previousUrl="/stada" nextButtonText="Senda gögn" />
    </StatusLayout>
  )
}

export default FileUpload
