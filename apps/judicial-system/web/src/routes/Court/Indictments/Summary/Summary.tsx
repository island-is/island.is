import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Accordion, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseTag,
  ConnectedCaseFilesAccordionItem,
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
} from '@island.is/judicial-system-web/src/components'
import {
  Defendants,
  Prosecutor,
} from '@island.is/judicial-system-web/src/components/CaseInfo/CaseInfo'
import {
  CaseFile,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useFileList,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Summary.strings'

const Summary: FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { transitionCase, isTransitioningCase } = useCase()
  const [modalVisible, setModalVisible] = useState<'CONFIRM_INDICTMENT'>()

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const handleNavigationTo = (destination: string) => {
    return router.push(`${destination}/${workingCase.id}`)
  }

  const handleNextButtonClick = async () => {
    const transitionSuccess = await transitionCase(
      workingCase.id,
      CaseTransition.COMPLETE,
      setWorkingCase,
    )

    if (!transitionSuccess) {
      return
    }

    setModalVisible('CONFIRM_INDICTMENT')
  }

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
          <Prosecutor workingCase={workingCase} />
          <Defendants workingCase={workingCase} />
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
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_CONCLUSION_ROUTE}/${workingCase.id}`}
          nextButtonIcon="checkmark"
          nextButtonText={formatMessage(strings.nextButtonText)}
          onNextButtonClick={async () => await handleNextButtonClick()}
          nextIsDisabled={isTransitioningCase}
        />
      </FormContentContainer>
      {modalVisible === 'CONFIRM_INDICTMENT' && (
        <Modal
          title={formatMessage(strings.completedCaseModalTitle)}
          text={formatMessage(strings.completedCaseModalBody)}
          primaryButtonText={formatMessage(core.closeModal)}
          onPrimaryButtonClick={() =>
            router.push(
              `${constants.INDICTMENTS_COMPLETED_ROUTE}/${workingCase.id}`,
            )
          }
        />
      )}
    </PageLayout>
  )
}

export default Summary
