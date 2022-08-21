import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContentContainer,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PoliceCaseNumbers from '../SharedComponents/PoliceCaseNumbers/PoliceCaseNumbers'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  indictmentsDefendant as m,
} from '@island.is/judicial-system-web/messages'
import { Box, Text } from '@island.is/island-ui/core'

const Defendant: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={IndictmentsProsecutorSubsections.DEFENDANT}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.defendant)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <PoliceCaseNumbers
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Defendant
