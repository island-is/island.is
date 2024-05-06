import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  FormContentContainer,
  FormContext,
  PageHeader,
  PageLayout,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import {
  Defendants,
  Prosecutor,
} from '@island.is/judicial-system-web/src/components/CaseInfo/CaseInfo'

import { strings } from './Summary.strings'

const Summary: React.FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const handleNavigationTo = (destination: string) => {
    return router.push(`${destination}/${workingCase.id}`)
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(strings.htmlTitle)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <Prosecutor workingCase={workingCase} />
        <Defendants workingCase={workingCase} />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Summary
