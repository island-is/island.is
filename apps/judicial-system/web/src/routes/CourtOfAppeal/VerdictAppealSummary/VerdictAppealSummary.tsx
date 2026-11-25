import { useContext, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { Box, PdfViewer, Text } from '@island.is/island-ui/core'
import { COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
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
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'
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
  getVerdictAppealRulingDecisionLabel,
  getVerdictAppealSummaryStage,
} from './VerdictAppealSummary.logic'

/**
 * The summary of a verdict appeal at the Court of Appeals, where the court
 * confirms how it ended once it has recorded that on the status step.
 *
 * Confirming reads the document in a modal first, the way the district court
 * confirms its own verdict. It marks the appeal ready to complete and sends
 * nothing: the parties do not see the outcome until it is released, which
 * completes the appeal. Once confirmed, the page shows the appeal as it ended
 * and offers nothing more to do; it can still be corrected on the status
 * step.
 */
const VerdictAppealSummary = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  // Read directly rather than through the shared resolver, for the reason
  // the overview gives.
  const verdictAppealCase = workingCase.verdictAppealCase
  const { formatMessage } = useIntl()
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

    setIsFetchingRulingUrl(true)

    try {
      const url = await getFileUrl(rulingFile.id)

      if (!url) {
        return
      }

      setRulingUrl(url)
      setIsConfirming(true)
    } finally {
      setIsFetchingRulingUrl(false)
    }
  }

  // Confirms the appeal and closes the modal, staying in it when that fails.
  // The transition writes the confirmed appeal into the working case, so the
  // page then shows it as confirmed.
  const confirmAppeal = async () => {
    if (!verdictAppealCase || isConfirmingAppealRef.current) {
      return
    }

    isConfirmingAppealRef.current = true
    setIsConfirmingAppeal(true)

    try {
      const confirmed = await transitionAppealCase(
        workingCase.id,
        verdictAppealCase.id,
        AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
        setWorkingCase,
      )

      if (!confirmed) {
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
      {stage === 'IN_PROGRESS' && decisionLabel && (
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
        <PageHeader title={titleForCase(formatMessage, workingCase)} />
        <FormContentContainer>
          <div className={stack({ gap: 5 })}>
            <Box>
              <PageTitle marginBottom={1}>Samantekt</PageTitle>
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
                  dataTestId: 'confirmCompleteAppealButton',
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
