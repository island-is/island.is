import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'

import { Box, InputFileUpload } from '@island.is/island-ui/core'
import { PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import { DefendantEventType } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'
import useEventLog from '@island.is/judicial-system-web/src/utils/hooks/useEventLog'

import { strings } from './SendToPrisonAdmin.strings'

enum AvailableModal {
  SUCCESS = 'SUCCESS',
}

const SendToPrisonAdmin: FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const [modalVisible, setModalVisible] = useState<AvailableModal>()
  const router = useRouter()
  const { defendantId } = useParams<{ caseId: string; defendantId: string }>()
  const { createEventLog } = useEventLog()
  const { updateDefendant } = useDefendants()

  const defendant = workingCase.defendants?.find(
    (defendant) => defendant.id === defendantId,
  )

  const handleNextButtonClick = () => {
    setModalVisible(AvailableModal.SUCCESS)
  }

  const handleSecondaryButtonClick = () => {
    setModalVisible(undefined)
  }

  const handlePrimaryButtonClick = async () => {
    if (!defendant) {
      return
    }

    await updateDefendant({
      defendantId: defendant.id,
      caseId: workingCase.id,
      isSentToPrisonAdmin: true,
    })

    router.push(
      `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE}/${workingCase.id}`,
    )
  }

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
            accept="application/pdf"
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
          onNextButtonClick={handleNextButtonClick}
        />
      </FormContentContainer>
      {modalVisible === AvailableModal.SUCCESS && defendant && (
        <Modal
          title={formatMessage(strings.modalTitle)}
          text={formatMessage(strings.modalText, {
            courtCaseNumber: workingCase.courtCaseNumber,
            defendant: defendant.name,
          })}
          secondaryButtonText={formatMessage(core.back)}
          primaryButtonText={formatMessage(strings.modalNextButtonText)}
          onPrimaryButtonClick={handlePrimaryButtonClick}
          onSecondaryButtonClick={handleSecondaryButtonClick}
          onClose={handleSecondaryButtonClick}
          isPrimaryButtonLoading={createEventLog.loading}
          loading={createEventLog.loading}
        />
      )}
    </PageLayout>
  )
}

export default SendToPrisonAdmin
