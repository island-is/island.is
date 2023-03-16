import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { StudentAssessmentTable } from './components/StudentAssessmentTable'
import { FootNote, MENNTAMALASTOFNUN_ID } from '@island.is/service-portal/core'

function EducationStudentAssessment() {
  useNamespaces('sp.education-student-assessment')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <StudentAssessmentTable />
      <FootNote serviceProviderID={MENNTAMALASTOFNUN_ID} />
    </Box>
  )
}

export default EducationStudentAssessment
