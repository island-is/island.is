import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
  InfoCardActiveIndictment,
  Modal,
  PageHeader,
  PageLayout,
  ProsecutorCaseInfo,
  SectionHeading,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import DenyIndictmentCaseModal from './DenyIndictmentCaseModal/DenyIndictmentCaseModal'
import * as strings from './Overview.strings'
import * as styles from './Overview.css'

const Overview: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState<
    | 'noModal'
    | 'indictmentSubmittedModal'
    | 'indictmentSentForConfirmationModal'
    | 'indictmentDeniedModal'
  >('noModal')
  const [indictmentConfirmationDecision, setIndictmentConfirmationDecision] =
    useState<'confirm' | 'deny'>()
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { transitionCase } = useCase()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const isNewIndictment =
    workingCase.state === CaseState.NEW || workingCase.state === CaseState.DRAFT

  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED

  const handleNextButtonClick = async () => {
    let transitionType
    let modalType: typeof modal = 'noModal'

    if (isNewIndictment) {
      transitionType = CaseTransition.ASK_FOR_CONFIRMATION
      modalType = 'indictmentSentForConfirmationModal'
    } else if (user?.canConfirmAppeal) {
      if (indictmentConfirmationDecision === 'confirm') {
        transitionType = CaseTransition.SUBMIT
        modalType = 'indictmentSubmittedModal'
      } else if (indictmentConfirmationDecision === 'deny') {
        modalType = 'indictmentDeniedModal'
      }
    } else if (workingCase.state === CaseState.WAITING_FOR_CONFIRMATION) {
      modalType = 'indictmentSentForConfirmationModal'
    }

    if (transitionType) {
      const caseTransitioned = await transitionCase(
        workingCase.id,
        transitionType,
        setWorkingCase,
      )

      if (!caseTransitioned) {
        return
      }
    }

    if (modalType !== 'noModal') {
      setModal(modalType)
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.overview)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.overview.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <InfoCardActiveIndictment />
        </Box>
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )}
        <Box marginBottom={user?.canConfirmAppeal ? 5 : 10}>
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        {user?.canConfirmAppeal && (
          <Box marginBottom={10}>
            <SectionHeading
              title={formatMessage(
                strings.overview.indictmentConfirmationTitle,
              )}
              required
            />
            <BlueBox>
              <div className={styles.gridRowEqual}>
                <RadioButton
                  large
                  name="indictmentConfirmationRequest"
                  id="confirmIndictment"
                  backgroundColor="white"
                  label={formatMessage(strings.overview.confirmIndictment)}
                  checked={indictmentConfirmationDecision === 'confirm'}
                  onChange={() => setIndictmentConfirmationDecision('confirm')}
                />
                <RadioButton
                  large
                  name="indictmentConfirmationRequest"
                  id="denyIndictment"
                  backgroundColor="white"
                  label={formatMessage(strings.overview.denyIndictment)}
                  checked={indictmentConfirmationDecision === 'deny'}
                  onChange={() => setIndictmentConfirmationDecision('deny')}
                />
              </div>
            </BlueBox>
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={
            caseHasBeenReceivedByCourt
              ? constants.CASES_ROUTE
              : `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`
          }
          nextButtonText={
            user?.canConfirmAppeal
              ? undefined
              : formatMessage(strings.overview.nextButtonText, {
                  isNewIndictment,
                })
          }
          hideNextButton={caseHasBeenReceivedByCourt}
          infoBoxText={
            caseHasBeenReceivedByCourt
              ? formatMessage(strings.overview.indictmentSentToCourt)
              : undefined
          }
          onNextButtonClick={handleNextButtonClick}
          nextIsDisabled={
            user?.canConfirmAppeal && !indictmentConfirmationDecision
          }
        />
      </FormContentContainer>
      <AnimatePresence>
        {modal === 'indictmentSubmittedModal' ? (
          <Modal
            title={formatMessage(strings.overview.modalHeading)}
            onClose={() => router.push(constants.CASES_ROUTE)}
            onPrimaryButtonClick={() => {
              router.push(constants.CASES_ROUTE)
            }}
            primaryButtonText={formatMessage(core.closeModal)}
          />
        ) : modal === 'indictmentSentForConfirmationModal' ? (
          <Modal
            title={formatMessage(
              strings.overview.indictmentSentForConfirmation,
            )}
            text={formatMessage(
              strings.overview.indictmentSentForConfirmationText,
            )}
            onClose={() => router.push(constants.CASES_ROUTE)}
            onPrimaryButtonClick={() => {
              router.push(constants.CASES_ROUTE)
            }}
            primaryButtonText={formatMessage(core.closeModal)}
          />
        ) : modal === 'indictmentDeniedModal' ? (
          <DenyIndictmentCaseModal
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            onClose={() => setModal('noModal')}
            onComplete={() => router.push(constants.CASES_ROUTE)}
          />
        ) : null}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
