import { Dispatch, SetStateAction, useContext } from 'react'
import { useIntl } from 'react-intl'

import { titles } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'

import { strings } from './Overview.strings'

const UploadFilesInCourt = ({
  setShowUploadFilesView,
}: {
  setShowUploadFilesView: Dispatch<SetStateAction<boolean>>
}) => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  return (
    <>
      <PageHeader title={formatMessage(titles.court.indictments.overview)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.uploadFilesTitle)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          onPreviousButtonClick={() => setShowUploadFilesView(false)}
          nextButtonText={formatMessage(strings.submitCourtFilesButtonText)}
        />
      </FormContentContainer>
    </>
  )
}

export default UploadFilesInCourt
