import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import router from 'next/router'

import {
  Accordion,
  Box,
  PdfViewer,
  Text,
  toast,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { hasGeneratedCourtRecordPdf } from '@island.is/judicial-system/types'
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
  PdfButton,
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
import * as styles from './Summary.css'

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
  const [modalVisible, setModalVisible] = useState<
    'CONFIRM_INDICTMENT' | 'CONFIRM_RULING'
  >()
  const [rulingUrl, setRulingUrl] = useState<string>()
  const [hasReviewed, setHasReviewed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pdfError, setPDFError] = useState(false)
  const { user } = useContext(UserContext)

  const { onOpen, getFileUrl } = useFileList({
    caseId: workingCase.id,
  })

  const hasGeneratedCourtRecord = hasGeneratedCourtRecordPdf(
    workingCase.state,
    workingCase.indictmentRulingDecision,
    workingCase.courtSessions,
    user,
  )

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

  const handleRuling = async () => {
    const showError = () => toast.error('Dómur fannst ekki')

    const rulings = workingCase.caseFiles?.filter(
      (c) => c.category === CaseFileCategory.RULING,
    )

    if (!rulings || rulings.length === 0) {
      showError()
      return
    }

    const rulingId = rulings[0].id
    const url = await getFileUrl(rulingId)

    if (url) {
      setRulingUrl(url)
      setModalVisible('CONFIRM_RULING')
    } else {
      showError()
    }
  }

  const handleNextButtonClick = async () => {
    if (
      workingCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.RULING
    ) {
      await handleRuling()
    } else {
      setModalVisible('CONFIRM_INDICTMENT')
    }
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
        {(rulingFiles.length > 0 ||
          courtRecordFiles.length > 0 ||
          hasGeneratedCourtRecord) && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4">
              {formatMessage(strings.caseFilesSubtitleRuling)}
            </Text>
            {hasGeneratedCourtRecord && (
              <PdfButton
                caseId={workingCase.id}
                title={`Þingbók ${workingCase.courtCaseNumber}.pdf`}
                pdfType="courtRecord"
                renderAs="row"
                elementId="Þingbók"
              />
            )}
            {courtRecordFiles.length > 0 && (
              <RenderFiles caseFiles={courtRecordFiles} onOpenFile={onOpen} />
            )}
            {rulingFiles.length > 0 && (
              <RenderFiles caseFiles={rulingFiles} onOpenFile={onOpen} />
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
          onNextButtonClick={handleNextButtonClick}
          hideNextButton={!canUserCompleteCase}
          infoBoxText={
            canUserCompleteCase
              ? ''
              : formatMessage(strings.onlyAssignedJudgeCanComplete)
          }
        />
      </FormContentContainer>
      {modalVisible === 'CONFIRM_RULING' && (
        <Modal
          title="Staðfesting dóms"
          text={`Vinsamlegast rýnið skjal fyrir staðfestingu.            
Staðfestur dómur verður aðgengilegur málflytjendum í Réttarvörslugátt. Ef birta þarf dóminn verður hann sendur í rafræna birtingu í stafrænt pósthólf dómfellda á island.is.`}
          primaryButton={{
            text: 'Staðfesta',
            onClick: async () => await handleModalPrimaryButtonClick(),
            isLoading: isTransitioningCase,
            isDisabled: false, // !hasReviewed || pdfError, TODO FIX BUG ON PRD AND REVERT THIS
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => {
              setIsLoading(true)
              setModalVisible(undefined)
              setHasReviewed(false)
              setPDFError(false)
            },
          }}
          footerCheckbox={{
            label: 'Ég hef rýnt þetta dómskjal',
            checked: hasReviewed,
            onChange: () => setHasReviewed(!hasReviewed),
            disabled: pdfError,
          }}
        >
          {rulingUrl && (
            <div className={cn(styles.ruling, { [styles.loading]: isLoading })}>
              <PdfViewer
                file={rulingUrl}
                onLoadingSuccess={() => {
                  setPDFError(false)
                  setIsLoading(false)
                }}
                onLoadingError={() => setPDFError(true)}
                showAllPages
              />
            </div>
          )}
        </Modal>
      )}
      {modalVisible === 'CONFIRM_INDICTMENT' && (
        <Modal
          title={formatMessage(strings.completeCaseModalTitle)}
          text={formatMessage(strings.completeCaseModalBody)}
          primaryButton={{
            text: formatMessage(strings.completeCaseModalPrimaryButton),
            onClick: async () => await handleModalPrimaryButtonClick(),
            isLoading: isTransitioningCase,
          }}
          secondaryButton={{
            text: formatMessage(strings.completeCaseModalSecondaryButton),
            onClick: () => setModalVisible(undefined),
          }}
        />
      )}
    </PageLayout>
  )
}

export default Summary
