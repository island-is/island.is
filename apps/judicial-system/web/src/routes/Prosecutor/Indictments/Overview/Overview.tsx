import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  FormContentContainer,
  FormFooter,
  InfoCard,
  Modal,
  PageLayout,
  PdfButton,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { core, titles } from '@island.is/judicial-system-web/messages'
import { Box, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  useCase,
  useFileList,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { CaseState, CaseTransition } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import * as strings from './Overview.strings'
import * as styles from './Overview.css'

const Overview: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [modal, setModal] = useState<'noModal' | 'caseSubmittedModal'>(
    'noModal',
  )
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { onOpen } = useFileList({ caseId: workingCase.id })
  const { transitionCase } = useCase()

  const handleNextButtonClick = async () => {
    await transitionCase(workingCase, CaseTransition.SUBMIT, setWorkingCase)
    setModal('caseSubmittedModal')
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={IndictmentsProsecutorSubsections.OVERVIEW}
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
          <InfoCard
            data={[
              {
                title: formatMessage(strings.overview.indictmentCreated),
                value: formatDate(workingCase.created, 'PP'),
              },
              {
                title: formatMessage(strings.overview.prosecutor),
                value: `${workingCase.creatingProsecutor?.institution?.name}`,
              },
              {
                title: formatMessage(core.policeCaseNumber),
                value: workingCase.policeCaseNumbers.join(', '),
              },
              {
                title: formatMessage(core.court),
                value: workingCase.court?.name,
              },
              {
                title: formatMessage(strings.overview.caseType),
                value: capitalize(caseTypes[workingCase.type]),
              },
            ]}
            defendants={
              workingCase.defendants
                ? {
                    title: capitalize(
                      workingCase.defendants.length > 1
                        ? formatMessage(core.indictmentDefendants)
                        : formatMessage(core.indictmentDefendant, {
                            gender: workingCase.defendants[0].gender,
                          }),
                    ),
                    items: workingCase.defendants,
                  }
                : undefined
            }
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(strings.overview.caseFilesHeading)}
            </Text>
          </Box>
          {workingCase.caseFiles?.map((caseFile, index) => {
            return (
              <Box key={index} className={styles.caseFileContainer}>
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={caseFile.name}
                  handleClick={() => onOpen(caseFile.id)}
                />
              </Box>
            )
          })}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.INDICTMENTS_CASE_FILES_ROUTE}
          nextButtonText={formatMessage(strings.overview.nextButtonText, {
            isNewIndictment:
              workingCase.state === CaseState.NEW ||
              workingCase.state === CaseState.DRAFT,
          })}
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
            primaryButtonText={formatMessage(strings.overview.modalButtonText)}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
