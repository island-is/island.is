import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { withClientLocale } from '@island.is/localization'
import { StudentAssessmentTable } from './components/StudentAssessmentTable'

function EducationStudentAssessment(): JSX.Element {
  return (
    <Box marginBottom={[6, 6, 10]}>
      <StudentAssessmentTable />
    </Box>
  )
}

export default withClientLocale('sp.education-student-assessment')(
  EducationStudentAssessment,
)
