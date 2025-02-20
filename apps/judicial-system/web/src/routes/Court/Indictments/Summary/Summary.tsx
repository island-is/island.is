import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Accordion, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseTag,
  ConnectedCaseFilesAccordionItem,
  DateTime,
  FormContentContainer,
  FormContext,
  FormFooter,
  getIndictmentRulingDecisionTag,
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  RenderFiles,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { ProsecutorAndDefendantsEntries } from '@island.is/judicial-system-web/src/components/CaseInfo/CaseInfo'
import {
  CaseFile,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  formatDateForServer,
  useCase,
  useFileList,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Summary.strings'

const Summary: FC = () => {
  const { formatMessage } = useIntl()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { transitionCase, isTransitioningCase, setAndSendCaseToServer } =
    useCase()
  const [modalVisible, setModalVisible] = useState<'CONFIRM_INDICTMENT'>()
  const { user } = useContext(UserContext)

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const initialize = useCallback(() => {
    if (!workingCase.courtEndTime) {
      const now = new Date()
      setAndSendCaseToServer(
        [
          {
            courtEndTime: formatDateForServer(now),
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [workingCase, setWorkingCase, setAndSendCaseToServer])

  useOnceOn(isCaseUpToDate, initialize)

  const handleNavigationTo = (destination: string) => {
    return router.push(`${destination}/${workingCase.id}`)
  }

  const handleModalPrimaryButtonClick = async () => {
    const transitionSuccess = await transitionCase(
      workingCase.id,
      CaseTransition.COMPLETE,
      setWorkingCase,
    )

    if (!transitionSuccess) {
      return
    }

    router.push(`${constants.INDICTMENTS_COMPLETED_ROUTE}/${workingCase.id}`)
  }

  const handleCourtEndTimeChange = useCallback(
    (date: Date | undefined | null, valid = true) => {
      if (date && valid) {
        setAndSendCaseToServer(
          [
            {
              courtEndTime: formatDateForServer(date),
              force: true,
            },
          ],
          workingCase,
          setWorkingCase,
        )
      }
    },
    [setAndSendCaseToServer, setWorkingCase, workingCase],
  )

  const [courtRecordFiles, rulingFiles] = (workingCase.caseFiles || []).reduce(
    (acc, cf) => {
      if (cf.category === CaseFileCategory.COURT_RECORD) {
        acc[0].push(cf)
      } else if (
        cf.category === CaseFileCategory.RULING &&
        workingCase.indictmentRulingDecision &&
        [
          CaseIndictmentRulingDecision.RULING,
          CaseIndictmentRulingDecision.DISMISSAL,
        ].includes(workingCase.indictmentRulingDecision)
      ) {
        acc[1].push(cf)
      }

      return acc
    },
    [[] as CaseFile[], [] as CaseFile[]],
  )

  const indictmentRulingTag = getIndictmentRulingDecisionTag(
    workingCase.indictmentRulingDecision,
  )

  const canUserCompleteCase =
    (workingCase.indictmentRulingDecision !==
      CaseIndictmentRulingDecision.RULING &&
      workingCase.indictmentRulingDecision !==
        CaseIndictmentRulingDecision.DISMISSAL) ||
    workingCase.judge?.id === user?.id

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(strings.htmlTitle)} />

      <FormContentContainer>
        <Box display="flex" justifyContent="spaceBetween">
          <PageTitle>{formatMessage(strings.title)}</PageTitle>

          {workingCase.indictmentRulingDecision && (
            <Box marginTop={2}>
              <CaseTag
                color={indictmentRulingTag.color}
                text={formatMessage(indictmentRulingTag.text)}
              />
            </Box>
          )}
        </Box>
        <Box component="section" marginBottom={1}>
          <Text variant="h2" as="h2">
            {formatMessage(core.caseNumber, {
              caseNumber: workingCase.courtCaseNumber,
            })}
          </Text>
        </Box>
        <Box component="section" marginBottom={2}>
          <ProsecutorAndDefendantsEntries workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={6}>
          <InfoCardClosedIndictment />
        </Box>
        {workingCase.mergedCases && workingCase.mergedCases.length > 0 && (
          <Accordion>
            {workingCase.mergedCases.map((mergedCase) => (
              <Box marginBottom={5} key={mergedCase.id}>
                <ConnectedCaseFilesAccordionItem
                  connectedCaseParentId={workingCase.id}
                  connectedCase={mergedCase}
                />
              </Box>
            ))}
          </Accordion>
        )}
        <SectionHeading title={formatMessage(strings.caseFiles)} />
        {(rulingFiles.length > 0 || courtRecordFiles.length > 0) && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4">
              {formatMessage(strings.caseFilesSubtitleRuling)}
            </Text>
            {rulingFiles.length > 0 && (
              <RenderFiles caseFiles={rulingFiles} onOpenFile={onOpen} />
            )}
            {courtRecordFiles.length > 0 && (
              <RenderFiles caseFiles={courtRecordFiles} onOpenFile={onOpen} />
            )}
          </Box>
        )}
        <Box marginBottom={8} component="section">
          <SectionHeading
            title={formatMessage(strings.courtEndTimeTitle)}
            description={formatMessage(strings.courtEndTimeDescription)}
          />
          <DateTime
            name="courtEndDate"
            selectedDate={workingCase.courtEndTime}
            onChange={handleCourtEndTimeChange}
            blueBox={true}
            datepickerLabel="Dagsetning lykta"
            dateOnly
            required
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_CONCLUSION_ROUTE}/${workingCase.id}`}
          nextButtonIcon="checkmark"
          nextButtonText={formatMessage(strings.nextButtonText)}
          onNextButtonClick={() => setModalVisible('CONFIRM_INDICTMENT')}
          hideNextButton={!canUserCompleteCase}
          infoBoxText={
            canUserCompleteCase
              ? ''
              : formatMessage(strings.onlyAssignedJudgeCanComplete)
          }
        />
      </FormContentContainer>
      {modalVisible === 'CONFIRM_INDICTMENT' && (
        <Modal
          title={formatMessage(strings.completeCaseModalTitle)}
          text={formatMessage(strings.completeCaseModalBody)}
          primaryButtonText={formatMessage(
            strings.completeCaseModalPrimaryButton,
          )}
          onPrimaryButtonClick={async () =>
            await handleModalPrimaryButtonClick()
          }
          secondaryButtonText={formatMessage(
            strings.completeCaseModalSecondaryButton,
          )}
          onSecondaryButtonClick={() => setModalVisible(undefined)}
          isPrimaryButtonLoading={isTransitioningCase}
        />
      )}
    </PageLayout>
  )
}

export default Summary
