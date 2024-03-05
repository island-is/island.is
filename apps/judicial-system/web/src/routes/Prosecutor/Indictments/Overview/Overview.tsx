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

import * as strings from './Overview.strings'
import * as styles from './Overview.css'

const Overview: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState<'noModal' | 'caseSubmittedModal'>(
    'noModal',
  )
  const [appealConfirmationDecision, setAppealConfirmationDecision] = useState<
    'confirmAppeal' | 'denyAppeal'
  >()
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { transitionCase } = useCase()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const isNewIndictment =
    workingCase.state === CaseState.NEW || workingCase.state === CaseState.DRAFT

  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED

  const handleNextButtonClick = async () => {
    if (isNewIndictment) {
      const caseTransitioned = await transitionCase(
        workingCase.id,
        CaseTransition.ASK_FOR_CONFIRMATION,
        setWorkingCase,
      )

      if (!caseTransitioned) {
        return
      }
    }

    setModal('caseSubmittedModal')
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
              title={formatMessage(strings.overview.appealConfirmationTitle)}
              required
            />
            <BlueBox>
              <div className={styles.gridRowEqual}>
                <RadioButton
                  large
                  name="appealConfirmationDecision"
                  id="confirmAppeal"
                  backgroundColor="white"
                  label={formatMessage(strings.overview.confirmAppeal)}
                  checked={appealConfirmationDecision === 'confirmAppeal'}
                  onChange={() =>
                    setAppealConfirmationDecision('confirmAppeal')
                  }
                />
                <RadioButton
                  large
                  name="appealConfirmationDecision"
                  id="denyAppeal"
                  backgroundColor="white"
                  label={formatMessage(strings.overview.denyAppeal)}
                  checked={appealConfirmationDecision === 'denyAppeal'}
                  onChange={() => setAppealConfirmationDecision('denyAppeal')}
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
              : formatMessage(strings.overview.nextButtonText)
          }
          hideNextButton={caseHasBeenReceivedByCourt}
          infoBoxText={
            caseHasBeenReceivedByCourt
              ? formatMessage(strings.overview.caseSendToCourt)
              : undefined
          }
          onNextButtonClick={handleNextButtonClick}
          nextIsDisabled={user?.canConfirmAppeal && !appealConfirmationDecision}
        />
      </FormContentContainer>
      <AnimatePresence>
        {modal === 'caseSubmittedModal' && (
          <Modal
            title={formatMessage(strings.overview.modalHeading)}
            onClose={() => router.push(constants.CASES_ROUTE)}
            onPrimaryButtonClick={() => {
              router.push(constants.CASES_ROUTE)
            }}
            primaryButtonText={formatMessage(core.closeModal)}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
