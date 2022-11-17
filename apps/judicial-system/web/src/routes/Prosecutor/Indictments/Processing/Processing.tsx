import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  processing as m,
} from '@island.is/judicial-system-web/messages'
import { Box, Text } from '@island.is/island-ui/core'
import {
  CaseState,
  CaseTransition,
  Institution,
} from '@island.is/judicial-system/types'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import CommentsInput from '@island.is/judicial-system-web/src/components/CommentsInput/CommentsInput'
import { isProcessingStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'
import * as constants from '@island.is/judicial-system/consts'

import { ProsecutorSection, SelectCourt } from '../../components'

const Processing: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { setAndSendCaseToServer, transitionCase } = useCase()
  const { formatMessage } = useIntl()
  const { courts } = useInstitution()
  const router = useRouter()

  const handleCourtChange = (court: Institution) => {
    if (workingCase) {
      setAndSendCaseToServer(
        [
          {
            courtId: court.id,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      return true
    }

    return false
  }

  const handleNextButtonClick = async () => {
    if (workingCase.state === CaseState.NEW) {
      await transitionCase(workingCase, CaseTransition.OPEN, setWorkingCase)
    }

    router.push(`${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`)
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={IndictmentsProsecutorSubsections.PROCESSING}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.processing)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} hideCourt />
        <ProsecutorSection />
        <Box component="section" marginBottom={5}>
          <SelectCourt
            workingCase={workingCase}
            courts={courts}
            onChange={handleCourtChange}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <CommentsInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_CASE_FILE_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isProcessingStepValidIndictments(workingCase)}
          onNextButtonClick={handleNextButtonClick}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Processing
