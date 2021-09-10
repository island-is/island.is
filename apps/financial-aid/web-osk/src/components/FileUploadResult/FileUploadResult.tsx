import React, { useContext } from 'react'
import {
  ContentContainer,
  StatusLayout,
  Footer,
} from '@island.is/financial-aid-web/osk/src/components'
import { FileList } from '@island.is/financial-aid/shared/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './fileUpload.treat'
import { Colors } from '@island.is/island-ui/theme'

interface Props {
  subtitle: string
  subtitleColor: Colors
  nextButtonText: string
  nextButtonAction: () => void
  children?: React.ReactNode
}

const FileUploadSuccess = ({
  subtitle,
  subtitleColor,
  nextButtonText,
  nextButtonAction,
  children,
}: Props) => {
  const { form } = useContext(FormContext)

  return (
    <StatusLayout>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Senda inn gögn
        </Text>
        <Text paddingTop={2} variant="h3" color={subtitleColor}>
          {subtitle}
        </Text>
        <Box marginTop={3}>
          <FileList
            files={form.otherFiles}
            className={`contentUp delay-125 ${styles.widthAlmostFull}`}
          />
        </Box>
        {children}
      </ContentContainer>
      <Footer
        nextButtonText={nextButtonText}
        onNextButtonClick={nextButtonAction}
        hidePreviousButton={true}
      />
    </StatusLayout>
  )
}

export default FileUploadSuccess
