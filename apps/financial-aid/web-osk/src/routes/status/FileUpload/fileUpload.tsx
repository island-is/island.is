import React from 'react'
import { Text, InputFileUpload, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  StatusLayout,
  FileUploadContainer,
} from '@island.is/financial-aid-web/osk/src/components'

const FileUpload = () => {
  return (
    <StatusLayout>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Senda inn gögn
        </Text>
        <Text marginBottom={[3, 3, 5]}>
          Þú getur alltaf sent okkur gögn sem þú telur hjálpa umsókninni, t.d.
          launagögn{' '}
        </Text>
        <FileUploadContainer>
          <InputFileUpload
            fileList={[]}
            header="Dragðu gögn hingað"
            description="Tekið er við öllum hefðbundnum skráargerðum"
            buttonLabel="Bættu við gögnum"
            showFileSize={true}
            onChange={() => {}}
            onRemove={() => {}}
            onRetry={() => {}}
          />
        </FileUploadContainer>
      </ContentContainer>
      <Footer
        previousUrl="/stada"
        prevButtonText="Til baka"
        nextButtonText="Senda gögn"
      />
    </StatusLayout>
  )
}

export default FileUpload
