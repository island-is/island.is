import { useContext, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { Box, PdfViewer, Text } from '@island.is/island-ui/core'
import { COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  VerdictAppealFiles,
} from '@island.is/judicial-system-web/src/components'
import FileNotFoundModal from '@island.is/judicial-system-web/src/components/Modals/FileNotFoundModal/FileNotFoundModal'
import {
  AppealCaseTransition,
  AppealRulingType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import useAppealCase from '@island.is/judicial-system-web/src/utils/hooks/useAppealCase'
import useFileList from '@island.is/judicial-system-web/src/utils/hooks/useFileList'
import * as styles from '@island.is/judicial-system-web/src/utils/styles/modalPdfPreview.css'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'
import { appendAppealCaseIdQuery } from '@island.is/judicial-system-web/src/utils/utils'

import { getVerdictAppealDefenderCaseNumber } from '../VerdictAppealDefender/VerdictAppealDefender.logic'
import { getVerdictAppealStatusHeaderLines } from '../VerdictAppealStatus/VerdictAppealStatus.logic'
import VerdictAppealConclusionBoxes from './VerdictAppealConclusionBoxes'
import VerdictAppealRulingDate from './VerdictAppealRulingDate'
import VerdictAppealRulingDocument from './VerdictAppealRulingDocument'
import {
  canConfirmVerdictAppeal,
  getConfirmableVerdictAppealRulingFile,
  getVerdictAppealConfirmationTarget,
  getVerdictAppealRulingDecisionLabel,
  getVerdictAppealSummaryStage,
  isSameVerdictAppealConfirmationTarget,
  isVerdictAppealOutcomeShown,
} from './VerdictAppealSummary.logic'

/**
 * The summary of a verdict appeal at the Court of Appeals, where the court
 * confirms how it ended once it has recorded that on the status step.
 *
 * Confirming reads the document in a modal first, the way the district court
 * confirms its own verdict. It marks the appeal ready to complete and sends
 * nothing: the parties do not see the outcome until it is released, which
 * completes the appeal. Once confirmed, the page shows the appeal as it ended
 * and offers nothing more to do. Correcting how it ended, here or on the
 * status step, takes it back, and the page then offers to confirm it again.
 */
const VerdictAppealSummary = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  // Read directly rather than through the shared resolver, for the reason
  // the overview gives.
  const verdictAppealCase = workingCase.verdictAppealCase
  const router = useRouter()
  const { transitionAppealCase, isTransitioningAppealCase } = useAppealCase()
  const { getFileUrl, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })

  const [isConfirming, setIsConfirming] = useState(false)
  const [rulingUrl, setRulingUrl] = useState<string>()
  const [isFetchingRulingUrl, setIsFetchingRulingUrl] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [isPdfLoading, setIsPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState(false)
  // Held while the appeal is being finished. A ref, so a second click that
  // lands before the next render is turned away too; the state mirrors it so
  // the modal can lock itself for as long as the request runs.
  const isConfirmingAppealRef = useRef(false)
  const [isConfirmingAppeal, setIsConfirmingAppeal] = useState(false)
  // The case and appeal on the page now, for a response to check against
  // once it arrives: the handlers that await it hold the ones they began
  // with.
  const currentTargetRef = useRef(
    getVerdictAppealConfirmationTarget(workingCase),
  )
  // Counts the visits to an appeal: it goes up each time the page moves to
  // another case or appeal, also when it comes back to one it showed before.
  const visitRef = useRef(0)
  const caseId = workingCase.id
  const appealCaseId = verdictAppealCase?.id

  // The page stays mounted when the user moves to another case or appeal, so
  // a review begun for the one they left is dropped. This closes the modal
  // even while a confirmation is under way: that request is for the appeal
  // left behind and does not touch the one now on the page.
  useEffect(() => {
    visitRef.current += 1
    currentTargetRef.current = { caseId, appealCaseId }
    setIsConfirming(false)
    setRulingUrl(undefined)
    setIsFetchingRulingUrl(false)
    setHasReviewed(false)
    setPdfError(false)
    setIsPdfLoading(true)
  }, [caseId, appealCaseId])

  // Marks the start of a request and returns a check of whether its response
  // still answers for the page: the appeal on the page is the one the request
  // began for, in the same visit. Leaving for another appeal and coming back
  // is a new visit, so a response from the earlier one does not act on it.
  const startRequest = () => {
    const started = getVerdictAppealConfirmationTarget(workingCase)
    const visit = visitRef.current

    return () =>
      visit === visitRef.current &&
      isSameVerdictAppealConfirmationTarget(started, currentTargetRef.current)
  }

  const statusUrl = appendAppealCaseIdQuery(
    `${COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE}/${workingCase.id}`,
    verdictAppealCase?.id,
  )

  const navigateTo = (destination: string) =>
    router.push(
      appendAppealCaseIdQuery(
        `${destination}/${workingCase.id}`,
        verdictAppealCase?.id,
      ),
    )

  const headerLines = getVerdictAppealStatusHeaderLines(workingCase)
  const caseNumber = getVerdictAppealDefenderCaseNumber(workingCase)
  const decisionLabel = getVerdictAppealRulingDecisionLabel(verdictAppealCase)
  const stage = getVerdictAppealSummaryStage(verdictAppealCase)
  const isConfirmed = stage !== 'IN_PROGRESS'
  const canConfirm = canConfirmVerdictAppeal(workingCase)
  const isRuling =
    verdictAppealCase?.appealRulingType === AppealRulingType.RULING

  const closeModal = () => {
    if (isConfirmingAppealRef.current) {
      return
    }

    setIsConfirming(false)
    setHasReviewed(false)
    setPdfError(false)
    setIsPdfLoading(true)
  }

  // A failed fetch has already told the user why: the hook toasts a failed
  // request and raises fileNotFound, shown below, for a missing file.
  const openConfirmation = async () => {
    const rulingFile = getConfirmableVerdictAppealRulingFile(workingCase)

    if (!rulingFile) {
      toast.error(isRuling ? 'Úrskurður fannst ekki' : 'Dómur fannst ekki')

      return
    }

    const isStillOnPage = startRequest()

    setIsFetchingRulingUrl(true)

    try {
      const url = await getFileUrl(rulingFile.id)

      if (!url || !isStillOnPage()) {
        return
      }

      setRulingUrl(url)
      setIsConfirming(true)
    } finally {
      // Moving to another appeal has already cleared this, and a fetch begun
      // there since must keep it.
      if (isStillOnPage()) {
        setIsFetchingRulingUrl(false)
      }
    }
  }

  // Confirms the appeal and closes the modal, staying in it when that fails.
  // The transition writes the confirmed appeal into the working case, so the
  // page then shows it as confirmed. It writes only to the appeal it was sent
  // for, so when the user has moved to another appeal meanwhile, nothing on
  // the page changes. The lock is held until the request ends, so no other
  // appeal is confirmed while it runs.
  const confirmAppeal = async () => {
    if (!verdictAppealCase || isConfirmingAppealRef.current) {
      return
    }

    const isStillOnPage = startRequest()

    isConfirmingAppealRef.current = true
    setIsConfirmingAppeal(true)

    try {
      const confirmed = await transitionAppealCase(
        workingCase.id,
        verdictAppealCase.id,
        AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
        setWorkingCase,
      )

      if (!confirmed || !isStillOnPage()) {
        return
      }
    } finally {
      isConfirmingAppealRef.current = false
      setIsConfirmingAppeal(false)
    }

    closeModal()
    // The confirmed page changes at its top, above where the modal was opened.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {stage === 'CONFIRMED' && (
        <AlertBanner
          variant="warning"
          title="Niðurstaða skráð en ekki gefin út"
          description="Aðilar máls sjá niðurstöðuna ekki fyrr en hún er gefin út."
        />
      )}
      {stage === 'IN_PROGRESS' &&
        decisionLabel &&
        isVerdictAppealOutcomeShown(verdictAppealCase) && (
          <AlertBanner
            variant="warning"
            title="Niðurstaða Landsréttar"
            description={decisionLabel}
          />
        )}
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
        onNavigationTo={navigateTo}
      >
        <PageHeader title={titles.courtOfAppeal.verdictAppeal.summary} />
        <FormContentContainer>
          <div className={stack({ gap: 5 })}>
            <Box>
              <PageTitle marginBottom={caseNumber ? 5 : 1}>Samantekt</PageTitle>
              <div className={stack({ gap: 1 })}>
                {caseNumber && (
                  <Text as="h2" variant="h2">
                    {caseNumber}
                  </Text>
                )}
                {headerLines.map((line) => (
                  <Text key={line} as="h5" variant="h5">
                    {line}
                  </Text>
                ))}
              </div>
            </Box>
            {isConfirmed && (
              <InfoCardClosedIndictment
                appealCase={verdictAppealCase ?? null}
              />
            )}
            <VerdictAppealConclusionBoxes workingCase={workingCase} />
            <VerdictAppealFiles />
            <VerdictAppealRulingDocument workingCase={workingCase} />
            <VerdictAppealRulingDate />
          </div>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={statusUrl}
            actions={
              isConfirmed
                ? undefined
                : [
                    {
                      text: 'Staðfesta',
                      icon: 'checkmark',
                      disabled:
                        !canConfirm ||
                        isFetchingRulingUrl ||
                        isTransitioningAppealCase,
                      onClick: openConfirmation,
                      testId: 'continueButton',
                    },
                  ]
            }
          />
        </FormContentContainer>
        <AnimatePresence>
          {isConfirming && (
            <Modal
              title="Viltu staðfesta dómsúrlausn og ljúka máli?"
              text={
                <Box display="flex" rowGap={2} flexDirection="column">
                  <Box>
                    <Text fontWeight="semiBold" as="span">
                      Lyktir:
                    </Text>
                    <Text as="span">{` ${decisionLabel ?? ''}`}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semiBold" as="span">
                      Dagsetning lykta:
                    </Text>
                    <Text as="span">{` ${
                      formatDate(verdictAppealCase?.appealRulingDate) ?? ''
                    }`}</Text>
                  </Box>
                  <Box as="ul" marginLeft={2}>
                    <li>
                      <Text as="span">
                        Vinsamlegast rýnið skjal fyrir staðfestingu.
                      </Text>
                    </li>
                    <li>
                      <Text as="span">
                        Ekkert er sent við staðfestingu. Aðilar máls sjá
                        niðurstöðuna ekki fyrr en hún er gefin út.
                      </Text>
                    </li>
                  </Box>
                </Box>
              }
              onClose={closeModal}
              loading={isConfirmingAppeal}
              buttons={[
                {
                  text: 'Hætta við',
                  onClick: closeModal,
                  variant: 'ghost',
                },
                {
                  text: 'Staðfesta',
                  onClick: confirmAppeal,
                  isLoading: isTransitioningAppealCase,
                  isDisabled: !hasReviewed || isPdfLoading || pdfError,
                  dataTestId: 'confirmVerdictAppealButton',
                },
              ]}
              footerCheckbox={{
                label: 'Ég hef rýnt þetta dómskjal',
                checked: hasReviewed,
                onChange: () => setHasReviewed(!hasReviewed),
                disabled: isPdfLoading || pdfError,
              }}
            >
              {rulingUrl && (
                <div
                  className={cn(styles.ruling, {
                    [styles.loading]: isPdfLoading,
                  })}
                >
                  <PdfViewer
                    file={rulingUrl}
                    onLoadingSuccess={() => {
                      setPdfError(false)
                      setIsPdfLoading(false)
                    }}
                    onLoadingError={() => setPdfError(true)}
                    showAllPages
                  />
                </div>
              )}
            </Modal>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
        </AnimatePresence>
      </PageLayout>
    </>
  )
}

export default VerdictAppealSummary
