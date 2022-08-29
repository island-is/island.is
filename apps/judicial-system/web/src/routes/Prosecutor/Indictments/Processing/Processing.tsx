import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContentContainer,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
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
import { Institution } from '@island.is/judicial-system/types'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import CommentsInput from '@island.is/judicial-system-web/src/components/CommentsInput/CommentsInput'
import { isProcessingStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'
import * as constants from '@island.is/judicial-system/consts'

import ProsecutorSection from '../../SharedComponents/ProsecutorSection/ProsecutorSection'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import PoliceCaseNumbersTags from '../../SharedComponents/PoliceCaseNumbersTags/PoliceCaseNumbersTags'

const Processing: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { setAndSendToServer } = useCase()
  const { formatMessage } = useIntl()
  const { courts } = useInstitution()

  const handleCourtChange = (court: Institution) => {
    if (workingCase) {
      setAndSendToServer(
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
        <PoliceCaseNumbersTags
          policeCaseNumbers={workingCase.policeCaseNumbers}
        />
        <Box component="section" marginBottom={5}>
          <ProsecutorSection />
        </Box>
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
          previousUrl={`${constants.INDICTMENTS_DEFENDANT_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isProcessingStepValidIndictments(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Processing
