import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { StudentAssessmentTable } from './components/StudentAssessmentTable'
import { FootNote, MMS_SLUG } from '@island.is/portals/my-pages/core'

const EducationStudentAssessment = () => {
  useNamespaces('sp.education-student-assessment')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <StudentAssessmentTable />
      <FootNote serviceProviderSlug={MMS_SLUG} />
    </Box>
  )
}

export default EducationStudentAssessment
