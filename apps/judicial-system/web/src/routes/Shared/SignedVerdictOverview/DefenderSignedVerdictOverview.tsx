import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'
import DefenderSignedVerdictOverviewForm from './DefenderSignedVerdictOverviewForm'

export const DefenderSignedVerdictOverview: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { formatMessage } = useIntl()

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={2}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.shared.signedVerdictOverview)} />
      <DefenderSignedVerdictOverviewForm workingCase={workingCase} />
    </PageLayout>
  )
}
