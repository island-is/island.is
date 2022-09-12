import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  CourtCaseInfo,
  FormContentContainer,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { titles } from '@island.is/judicial-system-web/messages'
import { AlertMessage, Box, InputFileUpload } from '@island.is/island-ui/core'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import { courtRecord as m } from './CourtRecord.strings'

const CourtRecord: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )

  const { formatMessage } = useIntl()

  const {
    files,
    handleS3Upload,
    handleRemoveFromS3,
    handleRetry,
    allFilesUploaded,
  } = useS3Upload(workingCase)

  const handleNextButtonClick = () => {}

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.JUDGE}
      activeSubSection={IndictmentsCourtSubsections.COURT_RECORD}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.court.indictments.courtRecord)} />
      <FormContentContainer>
        <PageTitle title={formatMessage(m.title)} />
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <AlertMessage
            message={formatMessage(m.alertBannerText)}
            type="info"
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(m.courtRecordTitle)} />
          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.COURT_RECORD,
            )}
            header={formatMessage(m.inputFieldLabel)}
            buttonLabel={formatMessage(m.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.COURT_RECORD)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading title={formatMessage(m.rulingTitle)} />
          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.RULING,
            )}
            header={formatMessage(m.inputFieldLabel)}
            buttonLabel={formatMessage(m.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.RULING)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.CASES_ROUTE}`} // TODO: Add previous url when it is ready
          onNextButtonClick={handleNextButtonClick}
          nextIsDisabled={!allFilesUploaded}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
