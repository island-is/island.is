import React, { useContext } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PoliceCaseNumbers from '../SharedComponents/PoliceCaseNumbers/PoliceCaseNumbers'

const Defendant: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PoliceCaseNumbers
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
      />
    </PageLayout>
  )
}

export default Defendant
