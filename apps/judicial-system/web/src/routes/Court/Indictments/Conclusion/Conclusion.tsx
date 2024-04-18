import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Box,
  Checkbox,
  Input,
  InputFileUpload,
  RadioButton,
  toast,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtArrangements,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { conclusion as m } from './Conclusion.strings'

type Actions = 'POSTPONE'
interface Postponement {
  newDate?: string | null
  courtRoom?: string | null
  postponedIndefinitely?: boolean
  reason?: string
}

const Conclusion: React.FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [selectedAction, setSelectedAction] = useState<Actions>()
  const [postponement, setPostponement] = useState<Postponement>()
  const { courtDate, handleCourtDateChange } = useCourtArrangements(workingCase)

  const { formatMessage } = useIntl()
  const { transitionCase, isTransitioningCase, setAndSendCaseToServer } =
    useCase()

  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      const transitionSuccessful = await transitionCase(
        workingCase.id,
        CaseTransition.ACCEPT,
      )

      if (transitionSuccessful) {
        setNavigateTo(destination)
      } else {
        toast.error(formatMessage(errors.transitionCase))
      }
    },
    [transitionCase, workingCase, formatMessage],
  )

  useEffect(() => {
    if (selectedAction === 'POSTPONE') {
      setPostponement({
        newDate: workingCase.courtDate,
        courtRoom: workingCase.courtRoom,
      })
    }
  }, [selectedAction, workingCase.courtDate, workingCase.courtRoom])

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={allFilesDoneOrError}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.courtRecord)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(m.decisionTitle)} required />
          <BlueBox>
            <RadioButton
              id="conclusion-postpone"
              name="conclusion-decision"
              checked={selectedAction === 'POSTPONE'}
              onChange={() => {
                setSelectedAction('POSTPONE')
              }}
              large
              backgroundColor="white"
              label={formatMessage(m.postponed)}
            />
          </BlueBox>
        </Box>
        {selectedAction === 'POSTPONE' && (
          <>
            <SectionHeading title={formatMessage(m.arrangeAnotherHearing)} />
            <Box marginBottom={5}>
              <BlueBox>
                <Box marginBottom={2}>
                  <CourtArrangements
                    workingCase={workingCase}
                    setWorkingCase={setWorkingCase}
                    handleCourtDateChange={(date, valid) => {
                      if (valid && date) {
                        setPostponement((prev) => ({
                          ...prev,
                          newDate: formatDateForServer(date),
                        }))
                      }
                    }}
                    handleCourtRoomChange={(evt) =>
                      setPostponement((prev) => ({
                        ...prev,
                        courtRoom: evt.target.value,
                      }))
                    }
                    dateTimeDisabled={postponement?.postponedIndefinitely}
                    courtRoomDisabled={postponement?.postponedIndefinitely}
                    selectedCourtDate={postponement?.newDate}
                    selectedCourtRoom={postponement?.courtRoom}
                    blueBox={false}
                  />
                </Box>
                <Box marginBottom={2}>
                  <Checkbox
                    name="postponedIndefinitely"
                    label={formatMessage(m.postponedIndefinitely)}
                    large
                    filled
                    onChange={(event) =>
                      setPostponement({
                        newDate: null,
                        courtRoom: null,
                        postponedIndefinitely: event.target.checked,
                      })
                    }
                  />
                </Box>
                <Input
                  name="reasonForPostponement"
                  rows={10}
                  autoExpand={{ on: true, maxHeight: 600 }}
                  label={formatMessage(m.reasonForPostponement)}
                  placeholder={formatMessage(
                    m.reasonForPostponementPlaceholder,
                  )}
                  onBlur={(event) =>
                    setPostponement({ reason: event.target.value })
                  }
                  disabled={!postponement?.postponedIndefinitely}
                  textarea
                />
              </BlueBox>
            </Box>
          </>
        )}
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(m.courtRecordTitle)} />
          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.COURT_RECORD,
            )}
            accept="application/pdf"
            header={formatMessage(m.inputFieldLabel)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) => {
              handleUpload(
                addUploadFiles(files, CaseFileCategory.COURT_RECORD),
                updateUploadFile,
              )
            }}
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading title={formatMessage(m.rulingTitle)} />
          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.RULING,
            )}
            accept="application/pdf"
            header={formatMessage(m.inputFieldLabel)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, CaseFileCategory.RULING),
                updateUploadFile,
              )
            }
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_DEFENDER_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE)
          }
          nextIsDisabled={!allFilesDoneOrError}
          nextIsLoading={isTransitioningCase}
          nextButtonText={formatMessage(m.nextButtonText)}
        />
      </FormContentContainer>
      {navigateTo !== undefined && (
        <Modal
          title={formatMessage(m.modalTitle)}
          text={formatMessage(m.modalText)}
          onPrimaryButtonClick={() => {
            router.push(`${navigateTo}/${workingCase.id}`)
          }}
          primaryButtonText={formatMessage(core.closeModal)}
        />
      )}
    </PageLayout>
  )
}

export default Conclusion
