import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/service-portal/core'
import { StudentAssessmentTable } from './components/StudentAssessmentTable'

function EducationStudentAssessment(): JSX.Element {
  useNamespaces('sp.education-student-assessment')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={defineMessage({
          id:
            'sp.education-student-assessment:education-student-assessment-title',
          defaultMessage: 'Námsmat',
        })}
        intro={defineMessage({
          id:
            'sp.education-student-assessment:education-student-assessment-intro',
          defaultMessage: 'Hér getur þú skoðað námsmat.',
        })}
      />
      <StudentAssessmentTable />
    </Box>
  )
}

export default EducationStudentAssessment
