import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { CaseState, CaseTransition } from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardActiveIndictment,
  Modal,
  PageLayout,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import IndictmentsLawsBrokenAccordionItem, {
  useIndictmentsLawsBroken,
} from '@island.is/judicial-system-web/src/components/AccordionItems/IndictmentsLawsBrokenAccordionItem/IndictmentsLawsBrokenAccordionItem'
import IndictmentCaseFilesList from '@island.is/judicial-system-web/src/components/IndictmentCaseFilesList/IndictmentCaseFilesList'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import * as strings from './Overview.strings'

const Overview: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [modal, setModal] = useState<'noModal' | 'caseSubmittedModal'>(
    'noModal',
  )
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { transitionCase } = useCase()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const isNewIndictment =
    workingCase.state === CaseState.NEW || workingCase.state === CaseState.DRAFT

  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED

  const handleNextButtonClick = async () => {
    if (isNewIndictment) {
      await transitionCase(
        workingCase.id,
        CaseTransition.SUBMIT,
        setWorkingCase,
      )
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
        <IndictmentCaseFilesList workingCase={workingCase} />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={
            caseHasBeenReceivedByCourt
              ? constants.CASES_ROUTE
              : `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`
          }
          nextButtonText={formatMessage(strings.overview.nextButtonText, {
            isNewIndictment,
          })}
          hideNextButton={caseHasBeenReceivedByCourt}
          infoBoxText={
            caseHasBeenReceivedByCourt
              ? formatMessage(strings.overview.caseSendToCourt)
              : undefined
          }
          onNextButtonClick={handleNextButtonClick}
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
