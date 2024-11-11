import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, InputFileUpload } from '@island.is/island-ui/core'
import { PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'

import { strings } from './SendToFMST.strings'

const SendToFMST: FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
    >
      <PageHeader title={formatMessage(strings.title)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <SectionHeading
          heading="h2"
          title={formatMessage(strings.fileUploadTitle)}
          description={formatMessage(strings.fileUploadDescription)}
        />
        <Box marginBottom={10}>
          <InputFileUpload
            fileList={[]}
            accept={'application/pdf'}
            header={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={(files) => console.log('TODO: IMPLEMENT')}
            onRemove={(file) => console.log('TODO: IMPLEMENT')}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE}/${workingCase.id}`}
          nextButtonText={formatMessage(strings.nextButtonText)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default SendToFMST
