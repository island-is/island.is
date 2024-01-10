import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { StudentAssessmentTable } from './components/StudentAssessmentTable'
import {
  FootNote,
  MENNTAMALASTOFNUN_SLUG,
} from '@island.is/service-portal/core'

function EducationStudentAssessment() {
  useNamespaces('sp.education-student-assessment')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <StudentAssessmentTable />
      <FootNote serviceProviderSlug={MENNTAMALASTOFNUN_SLUG} />
    </Box>
  )
}

export default EducationStudentAssessment
